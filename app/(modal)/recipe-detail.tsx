import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

export default function RecipeDetailModal() {
  const router = useRouter();
  const navigation = useNavigation();
  const { recipe, origin } = useLocalSearchParams(); // Récupération des paramètres

  // Vérification et parsing des données reçues
  let parsedRecipe = null;
  try {
    parsedRecipe = recipe
      ? JSON.parse(decodeURIComponent(recipe as string))
      : null;
  } catch (error) {
    console.error("Erreur lors du parsing de la recette :", error);
  }

  // Configurer les options de geste pour la modale
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: true,
      gestureDirection: "vertical",
    });
  }, [navigation]);

  if (!parsedRecipe) {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.errorText}>Recette non trouvée</Text>
      </View>
    );
  }

  const handleClose = () => {
    if (origin) {
      router.replace(`/(tabs)/${origin}`);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.modalContainer}>
      {/* Bouton de fermeture */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#F56A00" />
        </TouchableOpacity>
        <View style={styles.handleIndicator} />
      </View>

      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.title}>{parsedRecipe.title}</Text>
        <Text style={styles.time}>
          ⏱ Temps total : {parsedRecipe.total_time} minutes
        </Text>

        <Text style={styles.sectionTitle}>Ingrédients :</Text>
        {parsedRecipe.ingredients.map((ing, index) => (
          <Text key={index} style={styles.ingredientItem}>
            • {ing.quantity} {ing.unit} {ing.name}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Étapes :</Text>
        {parsedRecipe.steps.map((step, index) => (
          <Text key={index} style={styles.stepItem}>
            {step.number}. {step.description} ({step.time} min)
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 16,
    overflow: "hidden",
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#DDD",
    borderRadius: 3,
    alignSelf: "center",
    position: "absolute",
    top: 20,
  },
  modalContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  time: {
    fontSize: 16,
    color: "#F56A009F",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  ingredientItem: {
    fontSize: 16,
    marginLeft: 10,
  },
  stepItem: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
