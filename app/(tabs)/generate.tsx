import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useRecipes } from "@context/RecipesContext";
import axios from "axios";

const GenerateScreen = () => {
  const [ingredients, setIngredients] = useState(""); // Zone de texte
  const [loading, setLoading] = useState(false);
  const { addRecipe, recipes } = useRecipes(); // Récupérer les recettes du contexte
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGenerateRecipes = async () => {
    if (!ingredients.trim()) {
      setError("Veuillez entrer au moins un ingrédient");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8080/api/chatgpt/recette", // Assurez-vous que cette URL soit correcte
        {
          ingredients: ingredients,
          num_recipes: 2, // Vous pouvez adapter ce paramètre selon votre besoin
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Ajout du token d'authentification
          },
          withCredentials: true,
        }
      );

      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((recipe) => addRecipe(recipe)); // Ajout des recettes dans le contexte
      } else {
        setError("Réponse invalide du serveur");
      }
    } catch (err) {
      setError(`Erreur lors de la génération des recettes: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() =>
        router.navigate(
          `/recipe-detail?recipe=${encodeURIComponent(
            JSON.stringify(item)
          )}&origin=generate`
        )
      }
    >
      <Text style={styles.recipeTitle}>{item.title}</Text>{" "}
      {/* Modifié de 'recipeName' à 'title' */}
      <Text style={styles.recipeTime}>⏱ {item.total_time}</Text>{" "}
      {/* Assurez-vous que ce champ existe */}
      <Text style={styles.ingredients}>
        {item.ingredients.map((ing) => ing.name).join(", ")}{" "}
        {/* Modifié de 'ingredient' à 'name' */}
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
        color="#F56A00"
        style={styles.button}
      />

      {loading && (
        <ActivityIndicator size="large" color="#F56A00" style={styles.loader} />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={recipes} // Utilisation des recettes venant du contexte
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    background: "#FAFAFA",
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  button: {
    borderRadius: 12,
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: "red",
    marginVertical: 10,
    textAlign: "center",
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  recipeTime: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  ingredients: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});

export default GenerateScreen;
