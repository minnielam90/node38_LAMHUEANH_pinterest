import express from "express";
import {
  getCommentInfo,
  getImageInfo,
  getSaveImage,
  postCommentImage,
} from "../controllers/detailControllers.js";
import { lockApi, verifyUserToken } from "../config/jwt.js";

const detailRoutes = express.Router();

detailRoutes.get("/image-info/:hinhId", lockApi, getImageInfo);
detailRoutes.get("/comment-info/:hinhId", lockApi, getCommentInfo);
detailRoutes.get("/save-image/:hinhId", lockApi, verifyUserToken, getSaveImage);
detailRoutes.post(
  "/post-comment/:hinhId",
  lockApi,
  verifyUserToken,
  postCommentImage
);

export default detailRoutes;
