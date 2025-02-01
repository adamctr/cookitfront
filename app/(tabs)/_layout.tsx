import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#e91e63',
    }}>
      <Tabs.Screen 
        name="generate" 
        options={{
          title: 'Générer',
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant" size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen 
        name="favorites" 
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          )
        }}
      />
    </Tabs>
  );
}