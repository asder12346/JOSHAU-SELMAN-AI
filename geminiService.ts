
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole, SourceReference } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the verified Research Assistant for the archives of Apostle Joshua Selman and Koinonia Global.

YOUR CORE MISSION:
Provide accurate spiritual expositions based on the Apostle's teachings and verify them with REAL, ACTIVE YouTube links from official sources.

STRICT OPERATING RULES:
1. DO NOT HALLUCINATE LINKS. If you do not see a verified YouTube URL in your search results for the specific teaching, DO NOT make one up.
2. SOURCE VERIFICATION: Use the Google Search tool for every query. Look for channels like "Koinonia Global", "SermonSprout", or "Apostle Joshua Selman" official archives.
3. FORMATTING: 
   - Start with a clear, 3-4 paragraph exposition of the teaching.
   - Do NOT include URLs inside the body of the text.
   - At the very end of your response, if and only if you found a verified source, write: "SERMON_DATA_START" followed by the Title, YouTube Link, and Audio Link (if found), then "SERMON_DATA_END".
4. If no specific sermon is found for the exact topic, apologize and suggest a related verified teaching.
5. NO ASTERISKS. NO MARKDOWN. Use plain, professional English.
`;

export const sendMessageToGemini = async (
  prompt: string,
  history: Message[]
): Promise<{ text: string; sources: SourceReference[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history
          .filter(m => m.role !== MessageRole.SYSTEM_NOTICE)
          .map(m => ({
            role: m.role === MessageRole.USER ? "user" : "model",
            parts: [{ text: m.content }]
          })),
        { role: "user", parts: [{ text: `Search for Apostle Joshua Selman's official teaching on: ${prompt}. Ensure you find the correct YouTube link.` }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Lower temperature for higher accuracy
      },
    });

    let rawText = response.text || "";
    const sources: SourceReference[] = [];
    
    // Extract sources from grounding metadata for reliability
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    
    groundingChunks.forEach(chunk => {
      if (chunk.web && chunk.web.uri) {
        const uri = chunk.web.uri;
        const title = chunk.web.title || "Sermon Archive";
        const isYouTube = uri.includes("youtube.com") || uri.includes("youtu.be");
        const isAudio = uri.includes("sermoncloud") || uri.includes("koinoniaglobal.org/sermons");

        if (isYouTube || isAudio) {
          sources.push({
            title: title.replace(/ - YouTube/g, '').replace(/Apostle Joshua Selman/gi, '').trim(),
            uri: uri,
            speaker: "Apostle Joshua Selman"
          });
        }
      }
    });

    // Clean up the "SERMON_DATA" markers from the text if the model included them
    const cleanText = rawText.split("SERMON_DATA_START")[0].trim();

    return { text: cleanText, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
