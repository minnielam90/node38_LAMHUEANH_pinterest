import express from "express";
import {
  getImageList,
  searchImageList,
} from "../controllers/homeControllers.js";
import { lockApi } from "../config/jwt.js";

const homeRoutes = express.Router();

homeRoutes.get("/image-list", lockApi, getImageList);
homeRoutes.get("/search-image-list/:ten_hinh", lockApi, searchImageList);

export default homeRoutes;
