import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Logo } from '../components/Logo';

// Garder le splash screen visible
SplashScreen.preventAutoHideAsync();

interface CustomSplashScreenProps {
  onReady: () => void;
}

export function CustomSplashScreen({ onReady }: CustomSplashScreenProps) {
  useEffect(() => {
    const prepare = async () => {
      try {
        // Simule le chargement de l'app
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        onReady();
      }
    };

    prepare();
  }, [onReady]);

  return (
    <View style={styles.container}>
      <Logo size={120} showText={true} textSize="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
