import express from "express";
import authRoutes from "./authRoutes.js";
import imageRoutes from "./imageRoutes.js";
import homeRoutes from "./homeRoutes.js";
import detailRoutes from "./detailRoutes.js";
import userRoutes from "./userRoutes.js";

const rootRoutes = express.Router();

rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/image", imageRoutes);
rootRoutes.use("/home", homeRoutes);
rootRoutes.use("/detail", detailRoutes);
rootRoutes.use("/user", userRoutes);

export default rootRoutes;
