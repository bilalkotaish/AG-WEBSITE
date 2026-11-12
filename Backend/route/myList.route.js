import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addToMyList,
  deleteMyList,
  getMyList,
} from "../controllers/mylist.controller.js";

const myListRouter = Router();

myListRouter.post("/add", auth, addToMyList);
myListRouter.delete("/delete/:id", deleteMyList);
myListRouter.get("/getList", auth, getMyList);

export default myListRouter;
