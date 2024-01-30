import express from "express";
import {
  deleteImage,
  getCreatedImageByUserId,
  getSavedImageByUserId,
  getUserInfo,
} from "../controllers/imageControllers.js";
import { lockApi, verifyUserToken } from "../config/jwt.js";

const imageRoutes = express.Router();

imageRoutes.get("/get-user-info", lockApi, getUserInfo);
imageRoutes.get(
  "/get-image-save-by-userid/:userId",
  lockApi,
  verifyUserToken,
  getSavedImageByUserId
);
imageRoutes.get(
  "/get-image-create-by-userid/:userId",
  lockApi,
  verifyUserToken,
  getCreatedImageByUserId
);
imageRoutes.delete(
  "/deleteimage/:hinhId",
  lockApi,
  verifyUserToken,
  deleteImage
);

export default imageRoutes;
