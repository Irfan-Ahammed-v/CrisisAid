function ruleBasedPriority(details, items) {
  const text = details.toLowerCase();

  let score = 0;

  // 🔴 Critical indicators (+5)
  const criticalWords = [
    "casualties",
    "collapse",
    "rescue",
    "stranded",
    "life-threatening",
    "building collapse",
    "oxygen",
    "surgical",
    "trauma",
    "blood",
    "48 hours without food"
  ];

  // 🟠 High indicators (+3)
  const highWords = [
    "flood",
    "fire",
    "disease",
    "cholera",
    "severe",
    "injuries",
    "landslide",
    "burn",
    "outbreak"
  ];

  // 🟡 Medium indicators (+1)
  const mediumWords = [
    "low supplies",
    "minor",
    "fever",
    "basic medical"
  ];

  criticalWords.forEach(word => {
    if (text.includes(word)) score += 5;
  });

  highWords.forEach(word => {
    if (text.includes(word)) score += 3;
  });

  mediumWords.forEach(word => {
    if (text.includes(word)) score += 1;
  });

  // Large quantity escalation
  const totalQty = items.reduce((sum, item) => sum + (item.qty || 0), 0);

  if (totalQty > 500) score += 3;
  if (totalQty > 1000) score += 5;

  if (score >= 8) return "critical";
  if (score >= 5) return "high";
  if (score >= 2) return "medium";
  return "low";
}

module.exports = ruleBasedPriority;
