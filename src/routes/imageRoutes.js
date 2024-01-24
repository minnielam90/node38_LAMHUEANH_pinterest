import express from "express";
import {
  deleteImage,
  getCreatedImageByUserId,
  getSavedImageByUserId,
  getUserInfo,
} from "../controllers/imageControllers.js";

const imageRoutes = express.Router();

imageRoutes.get("/get-user-info", getUserInfo);
imageRoutes.get("/get-image-save-by-userid/:userId", getSavedImageByUserId);
imageRoutes.get("/get-image-create-by-userid/:userId", getCreatedImageByUserId);
imageRoutes.delete("/deleteimage/:hinhId", deleteImage);

export default imageRoutes;
