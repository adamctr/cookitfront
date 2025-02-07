import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import axios from 'axios';

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
}

// 🔹 États globaux pour stocker `id_user` et les favoris
export default function FavoritesScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [sorting, setSorting] = useState("name");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // 📌 Récupérer `id_user` avant d'appeler `fetchFavoris()`
  const fetchUserId = async () => {
    try {
      console.log("🔍 Récupération de l'ID utilisateur...");
      const response = await axios.get('http://localhost:8080/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(response.data.token)}`
        }
      });

      console.log("✅ Utilisateur récupéré :", response.data);
      if (response.data.id) {
        setUserId(response.data.id.toString());
        fetchFavoris(response.data.id.toString()); // Appelle `fetchFavoris()` avec `id_user`
      } else {
        setError("Utilisateur non authentifié");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la récupération de l'utilisateur :", err);
      setError("Impossible de récupérer l'utilisateur.");
    }
  };

  // 📌 Récupérer les favoris de l'utilisateur connecté
  const fetchFavoris = async (userId: string) => {
    try {
      setLoading(true);
      setError('');
      console.log("🔍 Récupération des favoris pour l'utilisateur ID:", userId);

      const response = await axios.get(`http://localhost:8080/api/favoris?id_user=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      console.log("✅ Favoris récupérés :", response.data);

      if (response.data.message) {
        setError(response.data.message);
        setRecipes([]);
      } else {
        const favoris = response.data.map((fav: any) => ({
          id: fav.id.toString(),
          recipeName: fav.json?.titre || "Nom inconnu",
          totalTime: fav.json?.temps_total ? `${fav.json.temps_total} min` : "N/A",
          cookingTime: fav.json?.temps_cuisson ? `${fav.json.temps_cuisson} min` : "N/A",
          steps: fav.json?.etapes || [],
        }));

        setRecipes(favoris);
      }
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des favoris :", err);
      setError("Erreur lors de la récupération des favoris.");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Charger l'utilisateur et ses favoris dès l'ouverture
  useEffect(() => {
    fetchUserId();
  }, []);

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

  // 📌 Affichage des favoris
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => router.push({ pathname: "/recipe-detail", params: { recipe: JSON.stringify(item), origin: "favorites" } })}
    >
      <Text style={styles.recipeTitle}>{item.recipeName}</Text>
      <Text style={styles.recipeTime}>⏱ {item.totalTime}</Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}

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
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
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
});

