// services/ai/plagiarismService.js

// basic stopwords list (small & sufficient)
const stopWords = new Set([
  "the", "is", "are", "was", "were",
  "a", "an", "and", "or", "to",
  "of", "in", "on", "for", "with"
]);

// step 1: normalize text
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")   // remove punctuation & numbers
    .replace(/\s+/g, " ")       // extra spaces remove
    .trim();
};

// step 2: tokenize & remove stopwords
const getWordSet = (text) => {
  const words = text.split(" ");
  const filteredWords = words.filter(
    (word) => word && !stopWords.has(word)
  );
  return new Set(filteredWords);
};

// step 3: calculate similarity using Jaccard formula
const calculateSimilarity = (textA, textB) => {
  if (!textA || !textB) return 0;

  const cleanA = normalizeText(textA);
  const cleanB = normalizeText(textB);

  const setA = getWordSet(cleanA);
  const setB = getWordSet(cleanB);

  if (setA.size === 0 || setB.size === 0) return 0;

  // intersection
  const commonWords = new Set(
    [...setA].filter(word => setB.has(word))
  );

  // union
  const totalWords = new Set([...setA, ...setB]);

  const similarity =
    (commonWords.size / totalWords.size) * 100;

  return Math.round(similarity);
};

export default calculateSimilarity;

// We implemented a rule-based text similarity system using
// text normalization, tokenization, stop-word removal, and
// Jaccard similarity to calculate overlap between documents.

// The logic is isolated in a service layer,
// so it can be replaced with real AI later.