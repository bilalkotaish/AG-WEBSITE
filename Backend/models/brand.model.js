import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      url: { type: String, required: true },
      fileId: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const BrandModel = mongoose.model("brand", brandSchema);
export default BrandModel;
