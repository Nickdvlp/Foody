"use server";

import { db } from "@/db";
import { foodItemsTable } from "@/db/schema";

export async function suggestFood(userMessage: string) {
  // 1. Fetch only AVAILABLE food
  const foods = await db
    .select({
      name: foodItemsTable.name,
      description: foodItemsTable.description,
      category: foodItemsTable.category,
      ingredients: foodItemsTable.ingredients,
      preparationTime: foodItemsTable.preparationTime,
      rating: foodItemsTable.rating,
      isVeg: foodItemsTable.isVeg,
      price: foodItemsTable.price,
    })
    .from(foodItemsTable);

  const foodContext = foods
    .map((f, index) => {
      return `
${index + 1}. ${f.name}
- Category: ${f.category}
- Veg: ${f.isVeg ? "Yes" : "No"}
- Price: ₹${f.price}
- Prep Time: ${f.preparationTime} mins
- Rating: ${f.rating ?? "N/A"}
- Ingredients: ${f.ingredients?.join(", ") ?? "Not listed"}
- Description: ${f.description}
`;
    })
    .join("\n");

  const prompt = `
You are an AI food recommendation assistant.

Your rules:
- Recommend food ONLY from the list below.
- Try to understand user's mood from their message.
- If mood is unclear or user can't express feelings, suggest a safe and popular option.
- Prefer highly rated and quick-to-prepare food when unsure.
- Do NOT ask follow-up questions.
- Keep answer under 80 words.

Available food items:
${foodContext}

User message:
"${userMessage}"

Respond in a friendly, human tone.
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2:1b",
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response as string;
}
