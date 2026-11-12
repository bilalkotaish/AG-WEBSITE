import UserModel from "../models/user.model.js";

const requireAdmin = async (request, response, next) => {
  try {
    const user = await UserModel.findById(request.userId).select("Role Status");

    if (!user || user.Status !== "Active" || user.Role !== "Admin") {
      return response.status(403).json({
        message: "Administrator access required",
        success: false,
        error: true,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default requireAdmin;
