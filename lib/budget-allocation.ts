export type MealTime = 'pagi' | 'siang' | 'malam' | 'semua';

const MEAL_COUNT: Record<MealTime, number> = {
  pagi: 1,
  siang: 1,
  malam: 1,
  semua: 3,
};

export function allocateBudgetPerMeal(totalBudget: number, mealTime: MealTime): number {
  const count = MEAL_COUNT[mealTime];
  return Math.floor(totalBudget / count);
}