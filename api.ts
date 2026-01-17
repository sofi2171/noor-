
import { GoogleGenAI } from "@google/genai";

interface Env {
  API_KEY: string;
}

// Fixed: Replaced missing PagesFunction type with explicit parameter type to resolve TypeScript errors
export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  // 1. Check API Key
  const apiKey = env.API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API_KEY is missing in Cloudflare Environment Variables." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { action, payload, config } = await request.json() as any;
    
    // 2. Initialize Gemini
    const ai = new GoogleGenAI({ apiKey });
    const modelName = 'gemini-3-flash-preview';
    
    // Fixed: Simplified contents structure and removed maxOutputTokens to prevent thinking budget conflicts as per Gemini API guidelines
    const response = await ai.models.generateContent({
      model: modelName,
      contents: payload,
      config: {
        ...config,
      }
    });

    // 3. Return successful response
    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });
  } catch (error: any) {
    console.error("Cloudflare Worker Error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred during AI processing.",
      details: error.toString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Fixed: Replaced missing PagesFunction type to resolve compiler error
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
