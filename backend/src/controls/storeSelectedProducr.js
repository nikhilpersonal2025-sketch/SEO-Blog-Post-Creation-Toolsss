import product from "../model/BlogDataSchema.js";

export default async function storeSelectedProduct(req, res) {
  try {
    const { title,price,description,category,image,rating,id} = req.body;

    console.log(req.body);

    // Store in DB and 
    const created = await product.create({ title,price,description,category,image,id,rating });

    res.json(created);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}