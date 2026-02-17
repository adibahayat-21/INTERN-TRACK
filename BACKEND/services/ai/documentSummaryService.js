// ============================== This AI feature only contains gemini integration llm but not regex and not rule based  ========================

// IS FILE KA ROLE
// Long text → short meaningful summary generate karna

// Input
// Long document text (string)

// Example:
// Internship report
// Offer letter text
// Project description

//  Output
// Short summary (string)

// Example:
// “The student completed a 6-month internship as a MERN developer focusing on backend APIs and database design.”

// extra spaces remove

// line breaks clean

// text ko sentences me todna

//  Ye NLP ka base level hota hai

// 🔹 STEP 3: Summary Logic (RULE-BASED AI)

// Abhi (skeleton phase), hum simple logic use karenge:

// Examples:

// First 2–3 important sentences

// OR
// Sentences jisme keywords ho:
// internship
// training
// project
// role
// duration

// Ye AI-assisted summarization maana jaata hai

// later humne fir gemini ai ko integrate kiya h jisse summary ai ke through aarhi h

// This feature uses Gemini LLM–based AI summarization, not rule-based NLP. I prepare structured context .
// from internship data and send it to Gemini, which generates a professional summary. The result is cached 
// in the database to avoid repeated API calls.


import { GoogleGenAI } from "@google/genai";

// Why did you keep fields = {} ?
// “I kept the fields parameter optional using a default empty object to make the function flexible.
//  This allows the function to work even when structured metadata is not available, preventing runtime errors.”

const generateGeminiSummary = async (text, fields = {}) => {
  try {
    if (!text) {
      throw new Error("No text provided for AI summary");
    }

    // ✅ create client INSIDE function
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an expert academic reviewer.

Generate a short professional internship summary using the data below.

Internship Details:
Company: ${fields.company || "Not specified"}
Role: ${fields.role || "Not specified"}
Department: ${fields.department || "Not specified"}
Duration: ${fields.duration || "Not specified"}

Document Description:
${text}

Rules:
- Keep summary within 3–4 lines
- Use professional tone
- Focus on work done by student and also tell about the company in brief
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini summary error:", error.message);
    throw new Error("AI summary generation failed");
  }
};

export default generateGeminiSummary;





// Text validate karta hai

// Noise clean karta hai
//  Sentences nikaalta hai
//  Keywords ke basis pe important info pick karta hai
//  Short readable summary return karta hai