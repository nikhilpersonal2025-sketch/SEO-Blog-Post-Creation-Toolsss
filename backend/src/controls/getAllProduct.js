import product from "../model/BlogDataSchema.js";

const GetAllProduct = async (req, res) => {
    try {
        // Fetch all documents
        const data = await product.find();

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message,
        });
    }
};

export default GetAllProduct;
