import { GoogleGenerativeAI } from "@google/generative-ai";
import product from "../model/BlogDataSchema.js";



const GenerateBlogContent = async (req, res) => {
    try {

        const { _id } = req.params;
        console.log("Blog Generation Request for ID:", _id);

        // To get content
        const data = await product.findById(_id);

        if (!data) {
            return res.status(404).json({
                message: "Product not found",
                error: "The product with this ID does not exist in the database"
            });
        }

        console.log("Product Data:", data);

        if (!data.SEO || data.SEO.length === 0) {
            return res.status(400).json({
                message: "SEO keywords not found",
                error: "Please generate SEO keywords first before generating the blog post"
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Write a 180-word SEO optimized blog post for a product. Return ONLY valid JSON (no markdown, no code blocks).

Product Name: ${data?.title}
Price: ${data?.price}
Rating: ${data?.rating?.rate ?? data?.rating ?? "N/A"}
Category: ${data?.category ?? "N/A"}
Description: ${data?.description ?? "N/A"}

Use these SEO keywords naturally: ${data?.SEO?.join(", ") || "N/A"}

Return valid JSON with this exact structure:
{
  "title": "SEO-optimized blog title here",
  "content": "Your 180-word blog post content here..."
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log("Gemini Response:", responseText);

        let keywords;
        try {
            // Remove any markdown code blocks if present
            let cleanedText = responseText.trim();
            if (cleanedText.startsWith("```json")) {
                cleanedText = cleanedText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
            } else if (cleanedText.startsWith("```")) {
                cleanedText = cleanedText.replace(/^```\n?/, "").replace(/\n?```$/, "");
            }
            keywords = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return res.status(500).json({
                message: "Failed to parse AI response",
                error: "The AI response was not valid JSON format"
            });
        }

        if (!keywords.content || !keywords.title) {
            return res.status(500).json({
                message: "Invalid response structure",
                error: "AI response missing required fields (title or content)"
            });
        }

        data.blog_post = keywords.content;
        data.blog_title = keywords.title;
        await data.save();

        console.log("Blog post saved successfully");

        return res.status(200).json({
            title: keywords.title,
            content: keywords.content,
            message: "Blog post generated successfully"
        });

    } catch (error) {
        console.error("Blog Generation Error:", error);
        return res.status(500).json({
            message: "Failed to generate blog content",
            error: error.message || "Unknown error occurred"
        });
    }
};

export default GenerateBlogContent;