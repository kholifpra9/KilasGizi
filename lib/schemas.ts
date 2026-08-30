import { z } from 'zod';

// Struktur 1 bahan murah yang diambil dari data TanyaHarga
export type CheapIngredient = {
  name: string;
  price: number;
  unit: string;
};

// Schema hasil generate menu dari Groq
export const menuResultSchema = z.object({
  menu: z.string().min(1),
  ingredients_and_prices: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
    })
  ),
  steps: z.array(z.string()).min(1),
  nutrition_score: z.record(z.string(), z.string()), // fleksibel, misal {protein: "tinggi", kalori: "cukup"}
});

export type MenuResult = z.infer<typeof menuResultSchema>;