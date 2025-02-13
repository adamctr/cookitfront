import { useState } from "react";
import { View, Modal, Text, Button, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@context/AuthProvider";

export default function TabsLayout() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false); // État de la modale
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirection vers la page de connexion
    router.push("/login");
  };

  const confirmLogout = () => {
    setModalVisible(false); // Fermer la modale
    handleLogout(); // Effectuer la déconnexion
  };

  const cancelLogout = () => {
    setModalVisible(false); // Fermer la modale si l'utilisateur annule
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#e91e63",
        }}
      >
        <Tabs.Screen
          name="generate"
          options={{
            title: "Générer",
            tabBarIcon: ({ color }) => (
              <Ionicons name="restaurant" size={24} color={color} />
            ),
            headerRight: () => (
              <Ionicons
                name="log-out-outline"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
                onPress={() => setModalVisible(true)} // Ouvrir la modale
              />
            ),
          }}
        />
        <Tabs.Screen
          name="historique"
          options={{
            title: "Historique", // Titre fixe pour cet onglet
            tabBarIcon: ({ color }) => (
              <Ionicons name="hourglass" size={24} color={color} />
            ),
            headerRight: () => (
              <Ionicons
                name="log-out-outline"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
                onPress={() => setModalVisible(true)} // Ouvrir la modale
              />
            ),
          }}
        />
      </Tabs>

      {/* Modale de confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmation de déconnexion</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </Text>
            <View style={styles.modalButtons}>
              <Button color="#F56A00" title="Annuler" onPress={cancelLogout} />
              <Button
                color="#F56A00"
                title="Confirmer"
                onPress={confirmLogout}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Couleur d'overlay (transparente)
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  Button: {
    borderRadius: 8,
    backgroundColor: "#F56A00",
  },
});
