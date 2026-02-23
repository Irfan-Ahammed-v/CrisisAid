const { GoogleGenAI } = require("@google/genai");
const ruleBasedPriority = require("./priorityRules");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const priorityOrder = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

/**
 * Internal helper to call AI for priority prediction
 */
const predictPriorityAi = async (details, items) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error("Missing API Key");
    }

    const itemsText = items
      .map(item => `${item.itemName || item.item_name} (Qty: ${item.qty || item.requestitem_qty})`)
      .join(", ");

    const prompt = `
You are an AI assistant for a disaster relief organization.
Classify the priority of this relief request:
low | medium | high | critical

Request Details: "${details}"
Requested Items: "${itemsText}"

Respond with ONLY one word (low, medium, high, or critical).
`;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const priority = result.text.trim().toLowerCase();
    const allowed = ["low", "medium", "high", "critical"];

    return allowed.includes(priority) ? priority : "medium";
  } catch (error) {
    throw error;
  }
};

/**
 * Main function to get priority using hybrid logic (Rules + AI)
 */
exports.predictPriority = async (details, items) => {
  const rulePriority = ruleBasedPriority(details, items);
  console.log(`[Rules] Calculated Priority: ${rulePriority.toUpperCase()}`);

  try {
    const aiPriority = await predictPriorityAi(details, items);
    console.log(`[AI] Predicted Priority: ${aiPriority.toUpperCase()}`);

    // Choose the higher priority between AI and Rules
    if (priorityOrder[aiPriority] > priorityOrder[rulePriority]) {
      console.log(`[Hybrid] Using AI priority: ${aiPriority.toUpperCase()}`);
      return aiPriority;
    }

    console.log(`[Hybrid] Using Rule priority: ${rulePriority.toUpperCase()}`);
    return rulePriority;

  } catch (err) {
    console.warn(`[AI Failed] Error: ${err.message}. Falling back to Rule priority.`);
    return rulePriority;
  }
};