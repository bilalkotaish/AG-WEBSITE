import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.modal.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import NotificationModel from "../models/notification.model.js";
import mongoose from "mongoose";

async function restoreReservedStock(reservedProducts) {
  const errors = [];

  for (const item of [...reservedProducts].reverse()) {
    try {
      const result = await ProductModel.updateOne(
        { _id: item.productId },
        { $inc: { countInStock: item.quantity } }
      );
      if (result.matchedCount !== 1) {
        errors.push(`Product ${item.productId} no longer exists`);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }

  return errors;
}

export const createorder = async (req, res) => {
  const reservedProducts = [];
  let orderPersisted = false;

  try {
    const { products, deliver_address } = req.body;

    if (
      !Array.isArray(products) ||
      products.length === 0 ||
      !mongoose.Types.ObjectId.isValid(deliver_address)
    ) {
      return res.status(400).json({
        message: "A delivery address and at least one product are required",
        error: true,
        success: false,
      });
    }

    const address = await AddressModel.findOne({
      _id: deliver_address,
      UserId: req.userId,
    });
    if (!address) {
      return res.status(403).json({
        message: "The selected delivery address is not available",
        error: true,
        success: false,
      });
    }

    const quantities = new Map();
    for (const item of products) {
      if (
        !mongoose.Types.ObjectId.isValid(item?.productId) ||
        !Number.isSafeInteger(item?.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Each product must have a valid ID and positive quantity",
          error: true,
          success: false,
        });
      }

      const productId = String(item.productId);
      quantities.set(
        productId,
        (quantities.get(productId) || 0) + item.quantity
      );
    }

    const productIds = [...quantities.keys()];
    const productsInDatabase = await ProductModel.find({
      _id: { $in: productIds },
    });
    if (productsInDatabase.length !== productIds.length) {
      return res.status(404).json({
        message: "One or more products are no longer available",
        error: true,
        success: false,
      });
    }

    const orderProducts = [];
    for (const product of productsInDatabase) {
      const quantity = quantities.get(String(product._id));
      const price = Number(product.price);

      if (
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isSafeInteger(product.countInStock) ||
        product.countInStock < quantity
      ) {
        return res.status(409).json({
          message: `${product.name} does not have enough stock`,
          error: true,
          success: false,
        });
      }

      const subtotal = Number((price * quantity).toFixed(2));
      orderProducts.push({
        productId: product._id,
        quantity,
        price,
        productTitle: { name: product.name },
        image:
          typeof product.images?.[0] === "string"
            ? product.images[0]
            : product.images?.[0]?.url || "",
        SubTotal: subtotal,
      });
    }

    for (const item of orderProducts) {
      const reservedProduct = await ProductModel.findOneAndUpdate(
        {
          _id: item.productId,
          countInStock: { $gte: item.quantity },
        },
        { $inc: { countInStock: -item.quantity } },
        { new: true }
      );

      if (!reservedProduct) {
        const rollbackErrors = await restoreReservedStock(reservedProducts);
        if (rollbackErrors.length > 0) {
          console.error("Failed to restore order inventory:", rollbackErrors);
          return res.status(500).json({
            message:
              "Order could not be completed and inventory restoration needs review",
            error: true,
            success: false,
          });
        }

        return res.status(409).json({
          message: "A product no longer has enough stock",
          error: true,
          success: false,
        });
      }

      reservedProducts.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    const total = Number(
      orderProducts.reduce((sum, item) => sum + item.SubTotal, 0).toFixed(2)
    );
    const order = new OrderModel({
      userId: req.userId,
      products: orderProducts,
      Total: total,
      orderStatus: "pending",
      deliver_address: address._id,
      Paymentstatus: "pending",
      PaymentId: "Cash on Delivery",
    });

    const savedOrder = await order.save();
    orderPersisted = true;

    try {
      await NotificationModel.create({
        type: "new_order",
        order: savedOrder._id,
      });
    } catch (notificationError) {
      console.error(
        `Order ${savedOrder._id} was created, but its admin notification could not be saved:`,
        notificationError
      );
    }

    return res.status(201).json({
      savedOrder,
      message: "Order created successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    if (reservedProducts.length > 0 && !orderPersisted) {
      const rollbackErrors = await restoreReservedStock(reservedProducts);
      if (rollbackErrors.length > 0) {
        console.error("Failed to restore order inventory:", rollbackErrors);
        return res.status(500).json({
          message:
            "Order could not be completed and inventory restoration needs review",
          error: true,
          success: false,
        });
      }
    }
    res.status(500).json({ message: "Error creating order", error: true });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        error: true,
        success: false,
      });
    }

    if (String(userId) !== String(req.userId)) {
      const requester = await UserModel.findById(req.userId).select(
        "Role Status"
      );
      if (requester?.Role !== "Admin" || requester?.Status !== "Active") {
        return res.status(403).json({
          message: "You can only view your own orders",
          error: true,
          success: false,
        });
      }
    }

    const order = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("deliver_address userId")
      .populate("products.productId");
    res.status(200).json({
      data: order,
      message: "Order details",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting orders",
      error: true,
      success: false,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const orderId = req.params.id;
    const validStatuses = [
      "pending",
      "confirmed",
      "Confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "Canceled",
    ];
    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !validStatuses.includes(orderStatus)
    ) {
      return res.status(400).json({
        message: "A valid order ID and status are required",
        error: true,
        success: false,
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, {
      orderStatus,
    }, { new: true, runValidators: true });
    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }
    res.status(200).json({
      data: updatedOrder,
      message: "Order status updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order status",
      error: true,
      success: false,
    });
  }
};

export const getallOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("deliver_address userId")
      .populate("products.productId");
    res.status(200).json({
      data: orders,
      message: "Orders fetched successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: true,
      success: false,
    });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const sales = await OrderModel.find();

    let TotalSales = 0;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Initialize all months with 0
    const MonthlySales = months.map((month) => ({
      month,
      totalSales: 0,
    }));

    // Process each order
    sales.forEach((sale) => {
      const saleDate = new Date(sale.createdAt);
      const year = saleDate.getFullYear();
      const monthIndex = saleDate.getMonth(); // 0-based

      // Only include current year
      if (year === currentYear) {
        const amount = parseFloat(sale.Total || 0);
        TotalSales += amount;
        MonthlySales[monthIndex].totalSales += amount;
      }
    });

    return res.status(200).json({
      message: "Sales fetched successfully",
      success: true,
      error: false,
      data: sales,
      TotalSales,
      MonthlySales,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching sales",
      error: error.message || error,
      success: false,
    });
  }
};
export const getTotalUsers = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Create a baseline array with all months and TotalUsers = 0
    const MonthlyUsers = months.map((month) => ({
      month,
      TotalUsers: 0,
    }));

    // Update counts based on aggregation results
    users.forEach(({ _id, count }) => {
      const monthIndex = _id.month - 1;
      if (MonthlyUsers[monthIndex]) {
        MonthlyUsers[monthIndex].TotalUsers += count;
      }
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      MonthlyUsers,
      TotalUsers: users.reduce((acc, u) => acc + u.count, 0),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      error: error.message || error,
      success: false,
    });
  }
};
