
import { Type } from "@google/genai";

// Helper to sanitize JSON strings from AI output
const sanitizeJson = (text: string) => {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    try {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.substring(start, end + 1));
      }
      const objStart = text.indexOf('{');
      const objEnd = text.lastIndexOf('}');
      if (objStart !== -1 && objEnd !== -1) {
        return JSON.parse(text.substring(objStart, objEnd + 1));
      }
    } catch (innerE) {
      return null;
    }
    return null;
  }
};

const callBackend = async (action: string, payload: any, config: any) => {
  try {
    // Cloudflare Pages Functions map /functions/api.ts to /api
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload, config })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Backend call failed");
    return data;
  } catch (err: any) {
    console.error("API Call Error:", err);
    throw err;
  }
};

export const getAIscholarResponse = async (query: string, lang: 'ur' | 'en' = 'ur') => {
  try {
    const data = await callBackend('scholar', query, {
      systemInstruction: `You are a world-class, highly knowledgeable, and compassionate Islamic Scholar (Mufti/Aalim). Your expertise covers Fiqh, Hadith, Seerah, and Quranic Tafseer. Primary language is ${lang === 'ur' ? 'Urdu' : 'English'}. Provide deep, accurate, and evidence-based answers from the Quran and Sunnah. Be respectful and use a formal scholarly tone. Response must be in ${lang === 'ur' ? 'beautiful and precise Urdu' : 'clear and scholarly English'}.`,
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 0 } 
    });
    return data.text || (lang === 'ur' ? "معذرت، میں ابھی جواب دینے سے قاصر ہوں۔" : "I am sorry, I am unable to respond at the moment.");
  } catch (err) {
    return lang === 'ur' 
      ? "اے پی آئی کلید (API Key) کا مسئلہ یا سروس میں عارضی دشواری۔" 
      : "API Key issue or service temporarily unavailable.";
  }
};

export const searchHadith = async (
  topic: string, 
  lang: 'ur' | 'en' = 'ur', 
  sourceFilter?: string, 
  authenticityFilter?: string
) => {
  let prompt = `Act as a Hadith Database. Provide a list of 5 reliable and distinct Hadiths related to: ${topic}. 
  Provide text in ${lang === 'ur' ? 'Urdu' : 'English'}. 
  Ensure each Hadith has clear narrator, source (e.g., Bukhari, Muslim), and authenticity. Return ONLY a JSON array of objects.`;
  
  if (sourceFilter && sourceFilter !== 'all') {
    prompt += ` The source must be primarily ${sourceFilter}.`;
  }
  if (authenticityFilter && authenticityFilter !== 'all') {
    prompt += ` The authenticity must be ${authenticityFilter}.`;
  }

  try {
    const data = await callBackend('hadith', prompt, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            source: { type: Type.STRING },
            narrator: { type: Type.STRING },
            authenticity: { type: Type.STRING }
          },
          required: ["text", "source", "narrator", "authenticity"]
        }
      }
    });
    const parsed = sanitizeJson(data.text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    throw err;
  }
};

export const getDailyVerse = async (lang: 'ur' | 'en' = 'ur') => {
  try {
    const data = await callBackend('verse', `Provide one inspiring verse from the Quran in Arabic and ${lang === 'ur' ? 'Urdu' : 'English'} translation. Return as JSON.`, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          translation: { type: Type.STRING },
          surah: { type: Type.STRING },
          number: { type: Type.NUMBER }
        },
        required: ["text", "translation", "surah", "number"]
      }
    });
    return sanitizeJson(data.text);
  } catch (err) {
    return null;
  }
}

export const getDailyAzkar = async (lang: 'ur' | 'en' = 'ur') => {
  const today = new Date().toDateString();
  try {
    const data = await callBackend('azkar', `Date: ${today}. Provide a list of exactly 10 morning or evening Azkar. Arabic and ${lang === 'ur' ? 'Urdu' : 'English'} translation. Return as JSON array.`, {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            arabic: { type: Type.STRING },
            translation: { type: Type.STRING },
            benefit: { type: Type.STRING }
          },
          required: ["id", "arabic", "translation"]
        }
      }
    });
    const parsed = sanitizeJson(data.text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}
