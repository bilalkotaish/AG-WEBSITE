import { Router } from "express";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  CreateCategory,
  deletecategory,
  deleteimage,
  getCategories,
  getCategoriesCount,
  getcategoryById,
  subCategoriesCount,
  UpdateCategory,
  uploadImage,
} from "../controllers/category.controller.js";

const CategoryRouter = Router();

CategoryRouter.post(
  "/upload",
  auth,
  requireAdmin,
  upload.array("images"),
  uploadImage
);
CategoryRouter.post("/create", auth, requireAdmin, CreateCategory);
CategoryRouter.get("/getcategory", auth, getCategories);
CategoryRouter.get("/getcount", auth, getCategoriesCount);
CategoryRouter.get("/getsubcount", auth, subCategoriesCount);
CategoryRouter.get("/:id", auth, getcategoryById);
CategoryRouter.delete("/deleteimage", auth, requireAdmin, deleteimage);
CategoryRouter.delete("/:id", auth, requireAdmin, deletecategory);
CategoryRouter.put("/:id", auth, requireAdmin, UpdateCategory);

export default CategoryRouter;
