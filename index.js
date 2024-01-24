import express from "express";
import cors from "cors";
import rootRoute from "./src/routes/rootRoutes.js";

const app = express();

app.listen(8084, () => {
  console.log("BE starting with port 8084");
});

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.use(rootRoute);
