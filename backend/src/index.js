import express from "express";
import cors from "cors";
import StoreProducrt from "./controls/storeSelectedProducr.js";
import connectDB from "./config/Database.js";
import SEOKeywords from "./controls/SEOKeywords.js";
import script from "./controls/GenerateBlogContent.js";
import GetProductById from "./controls/GetProductById.js";
import GetAllProduct from "./controls/getAllProduct.js";

const app = express();
app.use(cors());
app.use(express.json());


app.post("/storeProduct", StoreProducrt);
app.post("/SEOWord", SEOKeywords);
app.get("/script/:_id", script);
app.get("/productById/:_id", GetProductById);
app.get("/getAllProducts", GetAllProduct);


const PORT = process.env.PORT || 3000;

// Connect to DB and  start server

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server, DB connection error:", err?.message || err);
  });
