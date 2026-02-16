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

const generateDocumentSummary=(text)=>{
    // basic validation
    if(!text || typeof text!=="string")
        throw new Error("Invalid document text")
    if(text.length<100)
    {
        return { summay:"Document is too short to generate a meaningful summary." }
    }

    // Processing (basic NLP)
    const cleanedText=text.replace(/\n+/g," ").replace(/\s+/g," ").trim();

    // split text into sentence
    const sentences=cleanedText.split(". ");

    const keywords = [
    "internship",
    "training",
    "project",
    "role",
    "worked",
    "duration",
    "developed",
    "implemented"
  ];

   const importantSentences = sentences.filter(sentence =>
    keywords.some(keyword =>
      sentence.toLowerCase().includes(keyword)
    )
  );

  const summarySentences =
    importantSentences.length > 0
      ? importantSentences.slice(0, 3)
      : sentences.slice(0, 3);

    return summarySentences.join(". ")+".";
}

export default generateDocumentSummary;


// Text validate karta hai

// Noise clean karta hai
//  Sentences nikaalta hai
//  Keywords ke basis pe important info pick karta hai
//  Short readable summary return karta hai