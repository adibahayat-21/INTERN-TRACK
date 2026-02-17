import { GoogleGenAI } from "@google/genai";

const extractFieldAI = async (text) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
Extract the following fields from the internship description.

Return STRICT JSON only:

{
  "company": "",
  "role": "",
  "department": "",
  "duration": "",
  "startDate": "",
  "endDate": ""
}

Description:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const rawText = response.text.trim();

    const cleaned = rawText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

    // VERY IMPORTANT — safe JSON parse
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}") + 1;
   
    if (jsonStart === -1 || jsonEnd === -1) {
  throw new Error("Invalid AI JSON response");
}

  const jsonString=cleaned.slice(jsonStart,jsonEnd);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("AI field extraction error:", err.message);
    return {};
  }
};

export default extractFieldAI;
