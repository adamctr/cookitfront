import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importation de AsyncStorage

interface Recipe {
  id: string;
  title: string; // Mise à jour du nom de la propriété
  total_time: string; // Mise à jour du nom de la propriété
  cooking_time: string; // Mise à jour du nom de la propriété
  steps: Array<{
    number: number; // Mise à jour du nom de la propriété
    time: string;
    description: string;
  }>;
}

export default function FavoritesScreen() {
  const [sorting, setSorting] = useState("name");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchFavoris = async () => {
    try {
      // Récupérer le token de manière asynchrone via AsyncStorage
      const token = await AsyncStorage.getItem("auth_token");

      if (!token) {
        setError("Utilisateur non authentifié");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/user/chatgpt/recettes",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Response data:", response.data); // Log de la réponse

      if (response.data && Array.isArray(response.data)) {
        setRecipes(response.data);
      } else {
        setError("Erreur lors de la récupération des recettes.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération de l'utilisateur.");
    }
  };

  useEffect(() => {
    fetchFavoris();
  }, []);

  const sortRecipes = (criteria: string) => {
    setLoading(true);
    setTimeout(() => {
      let sortedRecipes = [...recipes];
      if (criteria === "name") {
        sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
      } else if (criteria === "totalTime") {
        sortedRecipes.sort(
          (a, b) => parseInt(a.total_time) - parseInt(b.total_time)
        );
      } else if (criteria === "cookingTime") {
        sortedRecipes.sort(
          (a, b) => parseInt(a.cooking_time) - parseInt(b.cooking_time)
        );
      }
      setRecipes(sortedRecipes);
      setSorting(criteria);
      setLoading(false);
    }, 500);
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() =>
        router.navigate(
          `/recipe-detail?recipe=${encodeURIComponent(
            JSON.stringify(item)
          )}&origin=Historique`
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
      <Text style={styles.title}>Vos recettes favorites ❤️</Text>
      <Picker
        selectedValue={sorting}
        onValueChange={(itemValue) => sortRecipes(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Trier par nom" value="name" />
        <Picker.Item label="Trier par temps total" value="totalTime" />
        <Picker.Item label="Trier par temps de cuisson" value="cookingTime" />
      </Picker>

      {loading && (
        <ActivityIndicator size="large" color="#FF6D6D" style={styles.loader} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      <ScrollView contentContainerStyle={styles.listContainer}>
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
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
  error: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  recipeTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ingredients: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});
