import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { InputField, Button } from '../components/ui';
import { Logo } from '../components/Logo';
import { apiService, RegisterData } from '../utils/api';
import { saveToken } from '../utils/auth';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nom d\'utilisateur requis';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nom complet requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiService.register(formData);
      await saveToken(response.token);
      Alert.alert(
        'Succès',
        'Compte créé avec succès !',
        [{ text: 'OK', onPress: () => router.replace('/tasks') }]
      );
    } catch (error) {
      Alert.alert(
        'Erreur d\'inscription',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof RegisterData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size={80} showText={true} textSize="large" />
        </View>
        
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Créez votre compte</Text>

        <View style={styles.form}>
          <InputField
            label="Nom d'utilisateur"
            value={formData.username}
            onChangeText={(value: string) => updateField('username', value)}
            placeholder="nom_utilisateur"
            error={errors.username}
          />

          <InputField
            label="Nom complet"
            value={formData.name}
            onChangeText={(value: string) => updateField('name', value)}
            placeholder="Votre nom complet"
            error={errors.name}
          />

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(value: string) => updateField('email', value)}
            placeholder="votre@email.com"
            error={errors.email}
          />

          <InputField
            label="Mot de passe"
            value={formData.password}
            onChangeText={(value: string) => updateField('password', value)}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="Créer le compte"
            onPress={handleRegister}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.linkText}>
              Déjà un compte ? Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
