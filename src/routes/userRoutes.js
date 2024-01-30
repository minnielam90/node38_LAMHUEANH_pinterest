import express from "express";
import {
  editUserInfo,
  uploadSingleImage,
} from "../controllers/userControllers.js";
import storage from "../controllers/uploadControllers.js";
import { lockApi, verifyUserToken } from "../config/jwt.js";

const userRoutes = express.Router();

userRoutes.put(
  "/edit-user-info/:userId",
  lockApi,
  verifyUserToken,
  editUserInfo
);

userRoutes.post(
  "/upload-image/:userId",
  lockApi,
  verifyUserToken,
  storage.single("file"),
  uploadSingleImage
);

export default userRoutes;
