import BrandModel from "../models/brand.model.js";
import ProductModel from "../models/product.modal.js";

export async function getBrands(request, response) {
  try {
    const brands = await BrandModel.find().sort({ name: 1 });
    return response.status(200).json({ brands, error: false, success: true });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to fetch brands",
      error: true,
      success: false,
    });
  }
}

export async function createBrand(request, response) {
  try {
    const name = request.body.name?.trim();
    const image = request.body.image;
    if (!name || !image?.url) {
      return response.status(400).json({
        message: "Brand name and image are required",
        error: true,
        success: false,
      });
    }

    const brand = await BrandModel.create({ name, image });
    return response.status(201).json({
      brand,
      message: "Brand created successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    const duplicate = error.code === 11000;
    return response.status(duplicate ? 409 : 500).json({
      message: duplicate ? "A brand with this name already exists" : error.message,
      error: true,
      success: false,
    });
  }
}

export async function updateBrand(request, response) {
  try {
    const name = request.body.name?.trim();
    const image = request.body.image;
    if (!name || !image?.url) {
      return response.status(400).json({
        message: "Brand name and image are required",
        error: true,
        success: false,
      });
    }

    const brand = await BrandModel.findByIdAndUpdate(
      request.params.id,
      { name, image },
      { new: true, runValidators: true }
    );
    if (!brand) {
      return response.status(404).json({
        message: "Brand not found",
        error: true,
        success: false,
      });
    }

    await ProductModel.updateMany(
      { brandId: brand._id },
      { $set: { brand: brand.name } }
    );
    return response.status(200).json({
      brand,
      message: "Brand updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    const duplicate = error.code === 11000;
    return response.status(duplicate ? 409 : 500).json({
      message: duplicate ? "A brand with this name already exists" : error.message,
      error: true,
      success: false,
    });
  }
}

export async function deleteBrand(request, response) {
  try {
    const brand = await BrandModel.findById(request.params.id);
    if (!brand) {
      return response.status(404).json({
        message: "Brand not found",
        error: true,
        success: false,
      });
    }

    const hasProducts = await ProductModel.exists({ brandId: brand._id });
    if (hasProducts) {
      return response.status(409).json({
        message: "This brand is assigned to products and cannot be deleted",
        error: true,
        success: false,
      });
    }

    await brand.deleteOne();
    return response.status(200).json({
      message: "Brand deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to delete brand",
      error: true,
      success: false,
    });
  }
}
