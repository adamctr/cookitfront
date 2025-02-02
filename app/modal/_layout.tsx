import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack 
      screenOptions={{
        presentation: 'modal',             // Mode modal
        animation: 'slide_from_bottom',      // Animation de slide depuis le bas
        gestureEnabled: true,                // Active les gestes
        gestureDirection: 'vertical',        // Permet de glisser verticalement pour fermer
      }}
    />
  );
}
