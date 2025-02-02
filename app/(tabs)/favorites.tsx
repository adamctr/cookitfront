import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

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

const FAVORITE_RECIPES: Recipe[] = [
  {
    id: "1",
    recipeName: "Pâtes Carbonara",
    totalTime: "30 min",
    cookingTime: "15 min",
    steps: [
      { stepNumber: 1, time: "5 min", description: "Faire chauffer l'eau pour les pâtes" },
      { stepNumber: 2, time: "10 min", description: "Cuire les lardons et préparer la sauce" },
    ],
    ingredients: [
      { ingredient: "Pâtes", quantity: "300", unit: "g" },
      { ingredient: "Lardons", quantity: "200", unit: "g" },
    ],
  },
  {
    id: "2",
    recipeName: "Salade César",
    totalTime: "20 min",
    cookingTime: "0 min",
    steps: [
      { stepNumber: 1, time: "10 min", description: "Laver et préparer la laitue" },
      { stepNumber: 2, time: "5 min", description: "Préparer la sauce et les croûtons" },
    ],
    ingredients: [
      { ingredient: "Laitue", quantity: "1", unit: "unité" },
      { ingredient: "Croûtons", quantity: "100", unit: "g" },
    ],
  },
  {
    id: "3",
    recipeName: "Omelette Fromage",
    totalTime: "10 min",
    cookingTime: "5 min",
    steps: [
      { stepNumber: 1, time: "2 min", description: "Battre les œufs avec le fromage" },
      { stepNumber: 2, time: "5 min", description: "Cuire l'omelette dans une poêle" },
    ],
    ingredients: [
      { ingredient: "Œufs", quantity: "3", unit: "unité" },
      { ingredient: "Fromage râpé", quantity: "50", unit: "g" },
    ],
  },
];

export default function FavoritesScreen() {
  const [sorting, setSorting] = useState("name");
  const [recipes, setRecipes] = useState<Recipe[]>(FAVORITE_RECIPES);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fonction de tri
  const sortRecipes = (criteria: string) => {
    setLoading(true);
    setTimeout(() => {
      let sortedRecipes = [...recipes];

      if (criteria === "name") {
        sortedRecipes.sort((a, b) => a.recipeName.localeCompare(b.recipeName));
      } else if (criteria === "totalTime") {
        sortedRecipes.sort((a, b) => parseInt(a.totalTime) - parseInt(b.totalTime));
      } else if (criteria === "cookingTime") {
        sortedRecipes.sort((a, b) => parseInt(a.cookingTime) - parseInt(b.cookingTime));
      }

      setRecipes(sortedRecipes);
      setSorting(criteria);
      setLoading(false);
    }, 500);
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => router.navigate(`/recipe-detail?recipe=${encodeURIComponent(JSON.stringify(item))}&origin=favorites`)}
    >
      <Text style={styles.recipeTitle}>{item.recipeName}</Text>
      <Text style={styles.recipeTime}>⏱ {item.totalTime}</Text>
      <Text style={styles.ingredients}>
        {item.ingredients.map(ing => ing.ingredient).join(', ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vos recettes favorites ❤️</Text>

      {/* Dropdown de tri */}
      <Picker
        selectedValue={sorting}
        onValueChange={(itemValue) => sortRecipes(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Trier par nom" value="name" />
        <Picker.Item label="Trier par temps total" value="totalTime" />
        <Picker.Item label="Trier par temps de cuisson" value="cookingTime" />
      </Picker>

      {loading && <ActivityIndicator size="large" color="#FF6D6D" style={styles.loader} />}

      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  picker: {
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recipeTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ingredients: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});
