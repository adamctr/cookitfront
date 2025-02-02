// app/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@context/AuthProvider';
import { ActivityIndicator, View } from 'react-native';
import { RecipesProvider } from '@context/RecipesContext';

function Routing() {

  // ICI A ADAPTER AVEC API
  //const { user, isLoading } = useAuth();
  const user = true;
  const isLoading = false;

  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RecipesProvider>
        <Routing />
      </RecipesProvider>
    </AuthProvider>
  );
}