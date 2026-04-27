export async function getAIRecommendation(userPrompt) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

 const prompt = `
You are an ecommerce search filter extractor.

Your task is to extract product intent from casual, informal, or Hinglish queries.

IMPORTANT RULES:
- Ignore filler words like: bhai, yaar, agr, ho to bata, dikhao, chahiye
- Detect product names even if written casually
- If a product is mentioned (shirt, tshirt, phone, laptop), ALWAYS fill productType
- Use singular words only
- Normalize values
- Colors must be lowercase
- If productType is clothing, category MUST be "Fashion"
- If nothing relevant is found, return empty JSON {}

Return ONLY valid JSON.
No explanation. No markdown.

JSON schema:
{
  "productType": string | null,
  "category": string | null,
  "color": string | null,
  "material": string | null,
  "gender": string | null,
  "usage": string | null,
  "minPrice": number | null,
  "maxPrice": number | null
}

Examples:

User: "bhai agr shirt ho to bta"
Output:
{
  "productType": "shirt",
  "category": "Fashion",
  "color": null,
  "material": null,
  "gender": null,
  "usage": null,
  "minPrice": null,
  "maxPrice": null
}

User: "red tshirt under 1000"
Output:
{
  "productType": "t-shirt",
  "category": "Fashion",
  "color": "red",
  "material": null,
  "gender": null,
  "usage": null,
  "minPrice": null,
  "maxPrice": 1000
}

User: "bhai agr gpu ho to bta"
Output:
{}

Now extract filters for this query.

User query:
"${userPrompt}"
`;



  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    return JSON.parse(
      aiText.replace(/```json|```/g, "").trim()
    );
  } catch (error) {
    return {
      productType: null,
      category: null,
      color: null,
      material: null,
      gender: null,
      usage: null,
      minPrice: null,
      maxPrice: null,
    };
  }
}
