import { Redirect } from 'expo-router';
import { useAuth } from '@context/AuthProvider';

export default function Index() {
  const { user } = useAuth();

  // Redirection vers le login si non connecté
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Redirection vers l'onglet de génération si connecté
  return <Redirect href="/(tabs)/generate" />;
}