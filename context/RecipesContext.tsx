// context/RecipesContext.tsx

import React, { createContext, useContext, useState } from "react";

interface Recipe {
  id: string;
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

interface RecipesContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  clearRecipes: () => void;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
};

export const RecipesProvider: React.FC = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prevRecipes) => [recipe, ...prevRecipes]);
  };

  const clearRecipes = () => {
    setRecipes([]);
  };

  return (
    <RecipesContext.Provider value={{ recipes, addRecipe, clearRecipes }}>
      {children}
    </RecipesContext.Provider>
  );
};
