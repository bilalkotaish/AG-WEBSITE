import mongoose from "mongoose";

const productcolorSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productColorModel = mongoose.model("productColor", productcolorSchema);
export default productColorModel;
