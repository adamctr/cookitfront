// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@context/AuthProvider';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@constants/Color';
import { SafeAreaView } from 'react-native-safe-area-context';

// Schéma de validation avec Zod
const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(8, 'Minimum 8 caractères')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // Surveillez l'état d'authentification et redirigez dès qu'il est vrai
  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      router.replace('/(tabs)/generate');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulation d'une requête API avec un délai de 1,5 seconde
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Vous pouvez ajouter ici une vérification simple des identifiants si besoin
      await login('fake-auth-token');
      // La redirection se fait via le useEffect lorsque isAuthenticated devient true
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('@assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Connectez-vous à votre compte</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={Colors.gray}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Mot de passe"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={secureTextEntry}
                placeholderTextColor={Colors.gray}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <Ionicons
                  name={secureTextEntry ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSubmit(handleLogin)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons name="refresh" size={24} color="white" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <Link href="/reset-password" style={styles.link}>
          Mot de passe oublié ?
        </Link>
      </View>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Ou continuer avec</Text>
        <View style={styles.separatorLine} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-apple" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Pas encore de compte ? </Text>
        <Link href="/register" style={styles.footerLink}>
          S'inscrire
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30
  },
  form: {
    gap: 20
  },
  inputContainer: {
    gap: 5
  },
  input: {
    backgroundColor: Colors.inputBackground,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.text
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginLeft: 5
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  link: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 14
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 30
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border
  },
  separatorText: {
    color: Colors.gray,
    fontSize: 14
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  socialButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 15,
    borderRadius: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  footerText: {
    color: Colors.textSecondary
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: '500'
  }
});
