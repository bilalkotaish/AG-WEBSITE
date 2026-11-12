import mongoose from "mongoose";
import NotificationModel from "../models/notification.model.js";

const orderDetailsPopulate = [
  { path: "userId", select: "name email Mobile" },
  { path: "deliver_address" },
  { path: "products.productId", select: "name images" },
];

export async function getAdminNotifications(request, response) {
  try {
    const [notifications, unreadCount] = await Promise.all([
      NotificationModel.find()
        .sort({ createdAt: -1 })
        .limit(15)
        .populate({
          path: "order",
          populate: orderDetailsPopulate,
        })
        .lean(),
      NotificationModel.countDocuments({ readAt: null }),
    ]);

    return response.status(200).json({
      notifications,
      unreadCount,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Failed to fetch admin notifications:", error);
    return response.status(500).json({
      message: "Failed to fetch notifications",
      error: true,
      success: false,
    });
  }
}

export async function markAdminNotificationRead(request, response) {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({
        message: "Invalid notification ID",
        error: true,
        success: false,
      });
    }

    const notification = await NotificationModel.findByIdAndUpdate(
      request.params.id,
      { $set: { readAt: new Date() } },
      { new: true }
    );
    if (!notification) {
      return response.status(404).json({
        message: "Notification not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Notification marked as read",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return response.status(500).json({
      message: "Failed to update notification",
      error: true,
      success: false,
    });
  }
}

export async function markAllAdminNotificationsRead(request, response) {
  try {
    await NotificationModel.updateMany(
      { readAt: null },
      { $set: { readAt: new Date() } }
    );
    return response.status(200).json({
      message: "All notifications marked as read",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return response.status(500).json({
      message: "Failed to update notifications",
      error: true,
      success: false,
    });
  }
}
