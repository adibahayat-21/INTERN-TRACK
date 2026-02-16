const extractFieldsFromText = (documentText) => {
  if (!documentText || typeof documentText !== "string")
    throw new Error("Invalid document text");

  const text = documentText.replace(/\s+/g, " ").trim();
  const lowerText = text.toLowerCase();

  const extractedData = {
    company: null,
    role: null,
    department: null,
    duration: null,
    startDate: null,
    endDate: null
  };

  // ======================
  // 1️⃣ COMPANY EXTRACTION
  // ======================

  const companyRegex =
    /(at|with|in)\s+([A-Z][A-Za-z0-9&.,\-\s]{2,})/i;

  const companyMatch = text.match(companyRegex);
  if (companyMatch) {
    extractedData.company = companyMatch[2].trim();
  }

  // ======================
  // 2️⃣ ROLE EXTRACTION
  // ======================

  const roleRegex =
    /(worked as|as a|as an|role of|position of)\s+([A-Za-z ]{3,40})/i;

  const roleMatch = text.match(roleRegex);
  if (roleMatch) {
    extractedData.role = roleMatch[2].trim();
  }

  // ======================
  // 3️⃣ DEPARTMENT EXTRACTION
  // ======================

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
    "cyber security": "Cyber"
  };

  for (const key in deptMap) {
    if (lowerText.includes(key)) {
      extractedData.department = deptMap[key];
      break;
    }
  }

  // ======================
  // 4️⃣ DURATION EXTRACTION
  // ======================

  const durationRegex =
    /(\d+)\s?(month|months|year|years)/i;

  const durationMatch = text.match(durationRegex);
  if (durationMatch) {
    extractedData.duration =
      `${durationMatch[1]} ${durationMatch[2]}`;
  }

  // ======================
  // 5️⃣ DATE EXTRACTION
  // ======================

  const dateRegex =
    /(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)\s?\d{4}/gi;

  const dates = text.match(dateRegex);

  if (dates && dates.length >= 1) {
    extractedData.startDate = dates[0];
    if (dates.length >= 2) {
      extractedData.endDate = dates[1];
    }
  }

  return extractedData;
};

export default extractFieldsFromText;
