import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Recipe {
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

const MOCK_RECIPES: Recipe[] = [
    {
      recipeName: "Pâtes Carbonara",
      totalTime: "30 min",
      cookingTime: "15 min",
      steps: [
        {
          stepNumber: 1,
          time: "5 min",
          description: "Faire chauffer l'eau pour les pâtes"
        },
        {
          stepNumber: 2,
          time: "10 min",
          description: "Cuire les lardons et préparer la sauce"
        }
      ],
      ingredients: [
        {
          ingredient: "Pâtes",
          quantity: "300",
          unit: "g"
        },
        {
          ingredient: "Lardons",
          quantity: "200",
          unit: "g"
        }
      ]
    },
    {
      recipeName: "Salade César",
      totalTime: "20 min",
      cookingTime: "0 min",
      steps: [
        {
          stepNumber: 1,
          time: "10 min",
          description: "Laver et préparer la laitue"
        },
        {
          stepNumber: 2,
          time: "5 min",
          description: "Préparer la sauce et les croûtons"
        }
      ],
      ingredients: [
        {
          ingredient: "Laitue",
          quantity: "1",
          unit: "unité"
        },
        {
          ingredient: "Croûtons",
          quantity: "100",
          unit: "g"
        }
      ]
    },
    {
      recipeName: "Tarte aux Pommes",
      totalTime: "60 min",
      cookingTime: "40 min",
      steps: [
        {
          stepNumber: 1,
          time: "20 min",
          description: "Préparer la pâte et éplucher les pommes"
        },
        {
          stepNumber: 2,
          time: "40 min",
          description: "Cuire la tarte au four"
        }
      ],
      ingredients: [
        {
          ingredient: "Pommes",
          quantity: "4",
          unit: "unité"
        },
        {
          ingredient: "Pâte brisée",
          quantity: "1",
          unit: "unité"
        }
      ]
    }
  ];

const GenerateScreen = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleGenerateRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Veuillez entrer au moins un ingrédient');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulation d'appel API avec délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecipes(MOCK_RECIPES);
      
    } catch (err) {
      setError('Erreur lors de la génération des recettes');
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
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
      <TextInput
        style={styles.input}
        multiline
        placeholder="Liste vos ingrédients (séparés par des virgules)"
        value={ingredients}
        onChangeText={setIngredients}
      />

      <Button
        title="Générer des recettes"
        onPress={handleGenerateRecipes}
        disabled={loading}
        color="#FF6D6D"
      />

      {loading && <ActivityIndicator size="large" color="#FF6D6D" style={styles.loader} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  input: {
    height: 100,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
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

export default GenerateScreen;