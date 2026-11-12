import { Router } from "express";
import auth from "../middleware/auth.js";
import requireAdmin from "../middleware/requireAdmin.js";
import upload from "../middleware/multer.js";
import {
  createProduct,
  createProductColor,
  createProductSize,
  createProductWeight,
  deletebannerimage,
  deleteMultipleProduct,
  deleteProduct,
  deleteProductimage,
  deleteProductColor,
  deleteProductsize,
  deleteProductweight,
  filterProducts,
  getAllProducts,
  getFeaturedProduct,
  getProduct,
  getProductByCategory,
  getProductByCatName,
  getProductByRating,
  getProductBySubCategory,
  getProductBySubCatName,
  getProductByThirdSubCategory,
  getProductByThirdSubCatName,
  getProductCount,
  getProductColor,
  getProductColorById,
  getProductsByPrice,
  getProductSize,
  getProductSizeById,
  getProductWeight,
  getProductweightById,
  SearchProducts,
  SortProducts,
  UpdateProduct,
  UpdateProductColor,
  UpdateProductSize,
  UpdateProductWeight,
  uploadBannerImage,
  uploadProductImage,
} from "../controllers/product.controller.js";

const ProductRouter = Router();

ProductRouter.post(
  "/uploadimage",
  auth,
  requireAdmin,
  upload.array("images"),
  uploadProductImage
);
ProductRouter.post(
  "/uploadbannerimage",
  auth,
  requireAdmin,
  upload.array("images"),
  uploadBannerImage
);
ProductRouter.post("/create", auth, requireAdmin, createProduct);
ProductRouter.post("/AddColor", auth, requireAdmin, createProductColor);
ProductRouter.post("/addSize", auth, requireAdmin, createProductSize);
ProductRouter.post("/AddWeight", auth, requireAdmin, createProductWeight);
ProductRouter.post("/filters", filterProducts);
ProductRouter.post("/Sort", SortProducts);
ProductRouter.post("/search", auth, SearchProducts);

ProductRouter.get("/products", getAllProducts);
ProductRouter.get("/getColors", getProductColor);
ProductRouter.get("/getSizes", getProductSize);
ProductRouter.get("/getWeights", getProductWeight);
ProductRouter.get("/getColors/:id", getProductColorById);
ProductRouter.get("/getSizes/:id", getProductSizeById);
ProductRouter.get("/getWeights/:id", getProductweightById);
ProductRouter.delete("/deleteimage", auth, requireAdmin, deleteProductimage);
ProductRouter.delete(
  "/deletebannerimage",
  auth,
  requireAdmin,
  deletebannerimage
);

ProductRouter.delete("/deleteSize/:id", auth, requireAdmin, deleteProductsize);
ProductRouter.delete(
  "/deleteWeight/:id",
  auth,
  requireAdmin,
  deleteProductweight
);
ProductRouter.delete(
  "/deleteColor/:id",
  auth,
  requireAdmin,
  deleteProductColor
);

ProductRouter.get("/products/:id", getProductByCategory);
ProductRouter.get("/productsbyCatname", getProductByCatName);
ProductRouter.get("/productSub/:id", getProductBySubCategory);
ProductRouter.get("/productsbySubCatname", getProductBySubCatName);
ProductRouter.get("/productthirdSub/:id", getProductByThirdSubCategory);
ProductRouter.get("/productsbythirdSubCatname", getProductByThirdSubCatName);
ProductRouter.get("/productsByPrice", getProductsByPrice);
ProductRouter.get("/productsByRating", getProductByRating);
ProductRouter.get("/productsCount", getProductCount);
ProductRouter.get("/isFeatured", getFeaturedProduct);
ProductRouter.delete("/deleteMultiple", auth, requireAdmin, deleteMultipleProduct);
ProductRouter.delete("/:id", auth, requireAdmin, deleteProduct);
ProductRouter.get("/:id", getProduct);
ProductRouter.put("/updateProduct/:id", auth, requireAdmin, UpdateProduct);
ProductRouter.put("/updateColors/:id", auth, requireAdmin, UpdateProductColor);
ProductRouter.put("/updatesize/:id", auth, requireAdmin, UpdateProductSize);
ProductRouter.put("/updateWeight/:id", auth, requireAdmin, UpdateProductWeight);

export default ProductRouter;
