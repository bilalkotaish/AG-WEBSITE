import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        productTitle: {
          name: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        image: {
          type: String,
        },
        SubTotal: {
          type: Number,
        },
      },
    ],
    PaymentId: {
      type: String,
      default: "",
    },
    Paymentstatus: {
      type: String,
      default: "",
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    deliver_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    Total: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", OrderSchema);

export default OrderModel;
