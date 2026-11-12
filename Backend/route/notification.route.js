import { Router } from "express";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "../controllers/notification.controller.js";

const NotificationRouter = Router();

NotificationRouter.use(auth, requireAdmin);
NotificationRouter.get("/", getAdminNotifications);
NotificationRouter.patch("/read-all", markAllAdminNotificationsRead);
NotificationRouter.patch("/:id/read", markAdminNotificationRead);

export default NotificationRouter;
