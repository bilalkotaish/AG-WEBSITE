import { Router } from "express";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  createorder,
  getallOrders,
  getAllSales,
  getOrderDetails,
  getTotalUsers,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const OrderRouter = Router();

OrderRouter.post("/create", auth, createorder);
OrderRouter.get("/get/:id", auth, getOrderDetails);
OrderRouter.put("/update/:id", auth, requireAdmin, updateOrderStatus);
OrderRouter.get("/get", auth, requireAdmin, getallOrders);
OrderRouter.get("/getusers", auth, requireAdmin, getTotalUsers);
OrderRouter.get("/getsales", auth, requireAdmin, getAllSales);

// OrderRouter.get("/createcheckoutsession", auth, createCheckoutSession);

export default OrderRouter;
