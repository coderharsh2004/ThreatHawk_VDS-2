import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const router: Router = Router();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing. Please check your .env file.");
}
const genAI = new GoogleGenerativeAI(apiKey || "");
const SYSTEM_PROMPT = `
You are a specialized assistant that ONLY answers questions about Vulnerability Assessment,
including topics such as penetration testing, exploits, Nmap, CVEs, threats, risk analysis, 
root cause identification, and remediation.
⚠️ Rules:
- If the query is NOT related to Vulnerability Assessment or cybersecurity, reply strictly:
  "Invalid topic. I only answer about Vulnerability Assessment."
`;
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    console.log("📩 Incoming message:", message);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${message}`);
    console.log("✅ Gemini raw response:", JSON.stringify(result, null, 2));
    const reply =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result.response?.text() ||
      "Sorry, I could not generate a reply.";
    res.json({ reply });
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error?.message || error);
    res
      .status(500)
      .json({ error: error?.message || "Failed to connect to Gemini API" });
  }
});
export default router;
