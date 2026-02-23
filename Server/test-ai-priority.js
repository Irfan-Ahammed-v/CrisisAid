const aiService = require("./services/ai.service");
require("dotenv").config();

async function testPriority(details, items) {
  console.log(`\nTesting with details: "${details}"`);
  console.log(`Items: ${items.map(i => `${i.itemName || i.item_name} (Qty: ${i.qty || i.requestitem_qty})`).join(", ")}`);
  
  try {
    const priority = await aiService.predictPriority(details, items);
    console.log(`Predicted Priority: ${priority.toUpperCase()}`);
  } catch (err) {
    console.error("Test Priority Error:", err);
  }
}

async function runTests() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error("Please set a valid GEMINI_API_KEY in the .env file before running this test.");
    return;
  }

  const tests = [
    {
      details: "Severe flooding in the area. Water level is rising rapidly. 50 families are stranded on roofs. Need immediate rescue and food.",
      items: [{ itemName: "Food Packets", qty: 200 }, { itemName: "Life Jacket", qty: 50 }]
    },
    {
      details: "CRITICAL: Multiple casualties reported after building collapse. Emergency surgical kits and oxygen cylinders required immediately. Trauma surgeons needed.",
      items: [{ itemName: "Oxygen Cylinder", qty: 20 }, { itemName: "Surgical Kit", qty: 15 }, { itemName: "Blood Bags", qty: 30 }]
    },
    {
      details: "Outbreak of water-borne disease in camp. Over 30 people showing symptoms of cholera. Need IV fluids and rehydration salts urgently.",
      items: [{ itemName: "IV Fluids", qty: 100 }, { itemName: "ORS Packets", qty: 500 }, { itemName: "Antibiotics", qty: 200 }]
    },
    {
      details: "Fire broke out in the east wing of the shelter. Several people have severe burn injuries. Need specialized burn dressings and pain relief.",
      items: [{ itemName: "Burn Dressings", qty: 50 }, { itemName: "Morphine", qty: 10 }, { itemName: "Sterile Gauze", qty: 100 }]
    },
    {
      details: "Major landslide has cut off the only access road. Food supplies are completely exhausted. 200 people without food for 48 hours.",
      items: [{ itemName: "Rice", qty: 500 }, { itemName: "Dal", qty: 200 }, { itemName: "Water Cans", qty: 100 }]
    },
    {
      details: "Running low on basic medical supplies. A few children have minor scratches and fever.",
      items: [{ itemName: "First Aid Kit", qty: 10 }, { itemName: "Paracetamol", qty: 50 }]
    },
    {
      details: "Need some extra blankets and clothes for the upcoming winter season.",
      items: [{ itemName: "Blanket", qty: 100 }, { itemName: "Clothes", qty: 200 }]
    }
  ];

  for (const test of tests) {
    await testPriority(test.details, test.items);
  }
}

runTests();
