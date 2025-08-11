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
import { apiService, LoginData } from '../utils/api';
import { saveToken, saveUser } from '../utils/auth';

export default function LoginScreen() {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email ou username requis';
    } 
    // Accepter soit email soit username (pas de validation email stricte)

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Utiliser l'email/username et le mot de passe séparément
      const response = await apiService.login(formData.email, formData.password);
      await saveToken(response.token);
      await saveUser(response.user);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert(
        'Erreur de connexion',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof LoginData, value: string): void => {
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
        
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Accédez à vos tâches</Text>

        <View style={styles.form}>
          <InputField
            label="Email ou Username"
            value={formData.email}
            onChangeText={(value: string) => updateField('email', value)}
            placeholder="admin ou votre@email.com"
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
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.linkText}>
              Pas de compte ? Créer un compte
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
