import { Router } from "express";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../controllers/brand.controller.js";

const BrandRouter = Router();

BrandRouter.get("/", getBrands);
BrandRouter.post("/", auth, requireAdmin, createBrand);
BrandRouter.put("/:id", auth, requireAdmin, updateBrand);
BrandRouter.delete("/:id", auth, requireAdmin, deleteBrand);

export default BrandRouter;
