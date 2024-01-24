import express from "express";
import {
  createUserImage,
  editUserInfo,
} from "../controllers/userControllers.js";

const userRoutes = express.Router();

userRoutes.put("/edit-user-info/:userId", editUserInfo);
userRoutes.put("/create-user-image/:userId", createUserImage);

export default userRoutes;
