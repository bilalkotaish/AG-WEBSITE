import { Router } from "express";
import {
  addAddress,
  DeleteAddress,
  getAddress,
  GetAddressById,
  updateAddress,
} from "../controllers/address.controller.js";
import auth from "../middleware/auth.js";

const AddressRouter = Router();

AddressRouter.post("/add", auth, addAddress);
AddressRouter.get("/get", auth, getAddress);
AddressRouter.get("/:id", auth, GetAddressById);
AddressRouter.put("/update/:id", auth, updateAddress);
AddressRouter.delete("/:id", auth, DeleteAddress);

export default AddressRouter;
