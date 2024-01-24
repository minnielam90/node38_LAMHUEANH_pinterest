import express from "express";
import {
  getCommentInfo,
  getImageInfo,
  getSaveImage,
  postCommentImage,
} from "../controllers/detailControllers.js";

const detailRoutes = express.Router();

detailRoutes.get("/image-info/:hinhId", getImageInfo);
detailRoutes.get("/comment-info/:hinhId", getCommentInfo);
detailRoutes.get("/save-image/:hinhId", getSaveImage);
detailRoutes.post("/post-comment/:hinhId", postCommentImage);

export default detailRoutes;
