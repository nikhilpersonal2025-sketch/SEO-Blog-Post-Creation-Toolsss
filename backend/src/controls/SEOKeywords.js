import { GoogleGenerativeAI } from "@google/generative-ai";
import product from "../model/BlogDataSchema.js";


const SEOKeywords = async (req, res) => {
    try {
        const { title, id, _id } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required!" });
        }

        if (!_id && (id === undefined || id === null)) {
            return res.status(400).json({ message: "Product _id or id is required!" });
        }

        // Use MongoDB _id for reliable update (preferred over FakeStore id)
        const productQuery = _id ? { _id } : { id };

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Generate exactly 4 SEO keywords for the product: "${title}". 
                        Return ONLY a JSON array of strings, like this: ["keyword1", "keyword2", "keyword3", "keyword4"]`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let keywords;
        try {
            keywords = JSON.parse(responseText);
        } catch (e) {
            // If response has markdown code blocks, strip them
            let cleaned = responseText.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }
            keywords = JSON.parse(cleaned);
        }

        // Ensure keywords is an array
        if (!Array.isArray(keywords)) {
            keywords = [keywords];
        }

        const updatedData = await product.findOneAndUpdate(
            productQuery,
            { $set: { SEO: keywords } },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ message: "Product not found", error: "Could not update SEO - product not found in database" });
        }



        console.log(updatedData)




        return res.status(200).json({ SEO: keywords });


    } catch (error) {
        console.error("Gemini Error:", error);
        return res.status(500).json({
            message: "Failed to generate SEO keywords",
            error: error.message
        });
    }
};

export default SEOKeywords;