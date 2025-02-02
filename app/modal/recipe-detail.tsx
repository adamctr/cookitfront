import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeDetailModal() {
  const router = useRouter();
  const { recipe } = useLocalSearchParams();
  const parsedRecipe = recipe ? JSON.parse(recipe as string) : null;

  if (!parsedRecipe) {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.errorText}>Recette non trouvée</Text>
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      {/* Bouton de fermeture */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.handleIndicator} />
      </View>

      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.title}>{parsedRecipe.recipeName}</Text>
        <Text style={styles.time}>⏱ {parsedRecipe.totalTime}</Text>
        
        <Text style={styles.sectionTitle}>Ingrédients :</Text>
        {parsedRecipe.ingredients.map((ing, index) => (
          <Text key={index} style={styles.ingredientItem}>
            • {ing.quantity} {ing.unit} {ing.ingredient}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Étapes :</Text>
        {parsedRecipe.steps.map((step, index) => (
          <Text key={index} style={styles.stepItem}>
            {step.stepNumber}. {step.description} ({step.time})
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 40,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    position: 'absolute',
    top: 20,
  },
  modalContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  time: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
});
