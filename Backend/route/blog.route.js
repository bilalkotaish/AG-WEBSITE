import { Router } from "express";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import upload from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  deleteblogimage,
  getBlog,
  getBlogs,
  updateBlog,
  uploadBlogImage,
} from "../controllers/blog.controller.js";

const BlogRouter = Router();

BlogRouter.post(
  "/upload",
  auth,
  requireAdmin,
  upload.array("images"),
  uploadBlogImage
);
BlogRouter.post("/create", auth, requireAdmin, createBlog);
BlogRouter.get("/get", auth, getBlogs);
BlogRouter.delete("/deleteimage", auth, requireAdmin, deleteblogimage);
BlogRouter.get("/:id", auth, getBlog);

BlogRouter.delete("/:id", auth, requireAdmin, deleteBlog);
BlogRouter.put("/:id", auth, requireAdmin, updateBlog);

export default BlogRouter;
