const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function listAvailableModels() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    console.log("Fetching available models...");
    const response = await ai.models.list();
    
    // Log the structure to see what we got
    console.log("\nResponse Structure:", Object.keys(response));

    // In @google/genai, the models are usually in response.models or it's a paginated result
    const models = response.models || response;

    if (Array.isArray(models)) {
        console.log("\nAvailable Models:");
        models.forEach(model => {
            console.log(`- ${model.name || model.modelId} (Methods: ${model.supportedMethods?.join(", ") || "N/A"})`);
        });
    } else {
        console.log("\nModels found in response:", JSON.stringify(models, null, 2));
    }
    
  } catch (error) {
    console.error("Error listing models:", error.message);
    if (error.details) console.error("Details:", JSON.stringify(error.details, null, 2));
  }
}

listAvailableModels();
