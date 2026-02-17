// I built a hybrid pipeline where deterministic fields are extracted via regex, and missing fields are completed using LLM fallback.

// I implemented a hybrid information extraction pipeline where regex handles structured patterns and Gemini fills missing semantic fields. 
// This reduces API cost while maintaining accuracy

// Hybrid deterministic extractor (regex based)
// Regex handles structured patterns cheaply before AI fallback

const extractFieldsFromText = (documentText) => {
  if (!documentText || typeof documentText !== "string") {
    throw new Error("Invalid document text");
  }

  // 🔹 Clean text
  const text = documentText.replace(/\s+/g, " ").trim();
  const lowerText = text.toLowerCase();

  // 🔹 Output object
  const extractedData = {
    company: null,
    role: null,
    department: null,
    duration: null,
    startDate: null,
    endDate: null,
  };

  // =====================================================
  // 1️ COMPANY EXTRACTION (FIXED — no overcapture)
  // =====================================================

  const companyRegex =
    /(at|with|in)\s+([A-Z][A-Za-z0-9&.,\- ]{2,}?)(?=\s+(as|for|on|during|where)|\.|,|$)/i;

  const companyMatch = text.match(companyRegex);
  if (companyMatch) {
    extractedData.company = companyMatch[2].trim();
  }

  // =====================================================
  // 2️ ROLE EXTRACTION (IMPROVED)
  // =====================================================

  const roleRegex =
    /(worked as|as a|as an|role of|position of)\s+([A-Za-z0-9 \-]{3,60})/i;

  const roleMatch = text.match(roleRegex);
  if (roleMatch) {
    extractedData.role = roleMatch[2].trim();
  }

  // =====================================================
  // 3️ DEPARTMENT EXTRACTION (GOOD — kept)
  // =====================================================

  const deptMap = {
    "computer science": "Computer Science",
    "cse": "Computer Science",
    "data science": "Data Science",
    "data analytics": "Data Science",
    "ai": "AI/ML",
    "ai ml": "AI/ML",
    "ai/ml": "AI/ML",
    "artificial intelligence": "AI/ML",
    "information technology": "IT",
    "it": "IT",
    "cyber": "Cyber",
    "cyber security": "Cyber",
  };

  for (const key in deptMap) {
    if (lowerText.includes(key)) {
      extractedData.department = deptMap[key];
      break;
    }
  }

  // =====================================================
  // 4️ DURATION EXTRACTION (NORMALIZED TO MONTHS ⭐)
  // =====================================================

  const durationRegex = /(\d+)\s?(month|months|year|years)/i;

  const durationMatch = text.match(durationRegex);
  if (durationMatch) {
    let value = parseInt(durationMatch[1]);
    let unit = durationMatch[2].toLowerCase();

    // 🔹 normalize to months
    if (unit.startsWith("year")) {
      value = value * 12;
    }

    extractedData.duration = `${value} months`;
  }

  // =====================================================
  // 5️ DATE EXTRACTION (FIXED → Date object ⭐)
  // =====================================================

  const dateRegex =
    /(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)\s?\d{4}/gi;

  const dates = text.match(dateRegex);

  if (dates && dates.length >= 1) {
    const parseDate = (d) => new Date(d + " 1");

    extractedData.startDate = parseDate(dates[0]);

    if (dates.length >= 2) {
      extractedData.endDate = parseDate(dates[1]);
    }
  }

  return extractedData;
};

export default extractFieldsFromText;
