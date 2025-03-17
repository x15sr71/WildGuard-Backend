import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing in environment variables.");
}

let prompt = "Identify the exact species of the animal in this image. Provide a detailed description of its habitat, diet, and behavior. Additionally, give step-by-step care instructions for handling, feeding, and ensuring its well-being in a safe and ethical manner. Note: Answer under 50 words";

export const handleGeminiRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { image } = req.body;
        //console.log(req.body)

        if (!image ) {
            res.status(400).json({ error: 'Image required' });
            return;
        }

        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const requestBody = {
            "contents": [
              {
                "parts": [
                  {
                    "text": prompt
                  },
                  {
                    "inlineData": {
                      "mimeType": "image/jpeg",
                      "data": image  // Your Base64-encoded image
                    }
                  }
                ]
              }
            ]
          }
          ;

          const response = await axios.post<{ candidates: { content: { parts: { text: string }[] } }[] }>(
            geminiApiUrl, 
            requestBody, 
            { headers: { 'Content-Type': 'application/json' } }
        );        

        console.log(response.data);
        res.json({ text: response.data.candidates[0]?.content?.parts[0]?.text });;
    } catch (error: any) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};
