import express from "express";
import {
  getImageList,
  searchImageList,
} from "../controllers/homeControllers.js";

const homeRoutes = express.Router();

homeRoutes.get("/image-list", getImageList);
homeRoutes.get("/search-image-list/:ten_hinh", searchImageList);

export default homeRoutes;
