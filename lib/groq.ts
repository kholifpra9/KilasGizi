const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function buildMenuPrompt(
  budgetPerMeal: number,
  portions: number,
  mealTime: string,
  cheapIngredients: { name: string; price: number; unit: string }[]
): string {
  const ingredientList = cheapIngredients.length > 0
    ? cheapIngredients.map((i) => `${i.name} (Rp${i.price}/${i.unit})`).join(', ')
    : 'tidak ada data harga spesifik, gunakan bahan umum yang murah dan mudah didapat';

  return `Buatkan resep masakan rumah murah tinggi protein untuk ${portions} orang, waktu makan: ${mealTime}.
Total anggaran untuk waktu makan ini: Rp${budgetPerMeal}.
Bahan murah yang tersedia hari ini (dari data pasar): ${ingredientList}.

Prioritaskan bahan dari daftar di atas kalau memungkinkan, tapi boleh menambah bahan umum lain (bumbu dasar, dll) yang wajar ada di dapur rumahan.

Balas HANYA dalam format JSON berikut, tanpa teks tambahan:
{
  "menu": "nama menu",
  "ingredients_and_prices": [{"name": "nama bahan", "price": harga_dalam_rupiah}],
  "steps": ["langkah 1", "langkah 2", "langkah 3"],
  "nutrition_score": {"protein": "deskripsi singkat", "kalori": "deskripsi singkat", "zat_besi": "deskripsi singkat"}
}`;
}

export async function generateMenu(
  budgetPerMeal: number,
  portions: number,
  mealTime: string,
  cheapIngredients: { name: string; price: number; unit: string }[]
) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah ahli gizi dan koki rumahan Indonesia yang jago meracik menu murah tapi bergizi, khususnya untuk pencegahan stunting.',
        },
        { role: 'user', content: buildMenuPrompt(budgetPerMeal, portions, mealTime, cheapIngredients) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}