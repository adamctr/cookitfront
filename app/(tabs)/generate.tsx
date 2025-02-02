import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecipes } from '@context/RecipesContext';

const GenerateScreen = () => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const { addRecipe, recipes } = useRecipes();  // Récupérer les recettes du contexte
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerateRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Veuillez entrer au moins un ingrédient');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Simulation d'un appel API avec délai
      await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulation de plusieurs recettes générées
    const newRecipes = [
        {
        id: String(Date.now() + 1),  // Utilisation d'un id unique
        recipeName: 'Pâtes Carbonara',
        totalTime: '30 min',
        cookingTime: '15 min',
        steps: [
            { stepNumber: 1, time: '5 min', description: 'Faire chauffer l\'eau' },
            { stepNumber: 2, time: '10 min', description: 'Cuire les lardons' },
        ],
        ingredients: [
            { ingredient: 'Pâtes', quantity: '300', unit: 'g' },
            { ingredient: 'Lardons', quantity: '200', unit: 'g' },
        ],
        },
        {
        id: String(Date.now() + 2),  // Un autre id unique
        recipeName: 'Salade César',
        totalTime: '20 min',
        cookingTime: '0 min',
        steps: [
            { stepNumber: 1, time: '10 min', description: 'Laver et préparer la laitue' },
            { stepNumber: 2, time: '5 min', description: 'Préparer la sauce et les croûtons' },
        ],
        ingredients: [
            { ingredient: 'Laitue', quantity: '1', unit: 'unité' },
            { ingredient: 'Croûtons', quantity: '100', unit: 'g' },
        ],
        },
    ];

    // Ajouter chaque recette à votre contexte
    newRecipes.forEach(recipe => addRecipe(recipe));

    setLoading(false);
        } catch (err) {
        setError('Erreur lors de la génération des recettes');
        } finally {
        setLoading(false);
        }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => router.navigate(`/recipe-detail?recipe=${encodeURIComponent(JSON.stringify(item))}&origin=generate`)}
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
        placeholder="Listez vos ingrédients ici (ex. : tomate, oignon, basilic)"
        value={ingredients}
        onChangeText={setIngredients}
        placeholderTextColor="#aaa"
      />

      <Button
        title="Générer des recettes"
        onPress={handleGenerateRecipes}
        disabled={loading}
        color="#FF6D6D"
        style={styles.button}
      />

      {loading && <ActivityIndicator size="large" color="#FF6D6D" style={styles.loader} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={recipes}  // Utilisation des recettes venant du contexte
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}  // Utilisation de l'id unique
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  button: {
    borderRadius: 12,
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recipeTime: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  ingredients: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default GenerateScreen;
