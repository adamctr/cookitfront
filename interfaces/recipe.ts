export interface Recipe {
  recipeName: string;
  totalTime: string;
  cookingTime: string;
  steps: Array<{
    stepNumber: number;
    time: string;
    description: string;
  }>;
  ingredients: Array<{
    ingredient: string;
    quantity: string;
    unit: string;
  }>;
}