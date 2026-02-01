import { GoogleGenerativeAI } from "@google/generative-ai";
import product from "../model/BlogDataSchema.js";



const GetProductById = async (req, res) => {
    try {
        const { _id } = req.params;

        const data = await product.findById(_id);

        if (!data) {
            return res.status(404).json({
                message: "Product not found",
                error: "The product with this ID does not exist in the database"
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

export default GetProductById;