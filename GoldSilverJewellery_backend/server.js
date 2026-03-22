import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./Routes/auth.js";
import Collection from './Routes/CollectionRoutes.js'
import Category from './Routes/CategoryRoutes.js'
import Product from './Routes/ProductRoutes.js'
import connectCloudinary from "./config/cloudinary.js";


// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB(); 
connectCloudinary();
//MIDDLEWARES
app.use(express.json());
app.use(cors());


app.use("/api", authRouter);
app.use("/api/collections",Collection)
app.use("/api/categories", Category)
app.use("/api/products",Product);
app.get("/", (req, res) => {
  res.send("API WORKING");
});
app.listen(port, () => console.log("Server started on ", port));
