import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: 'small' | 'medium' | 'large';
  style?: any;
}

export function Logo({ 
  size = 60, 
  showText = false, 
  textSize = 'medium',
  style 
}: LogoProps) {
  const textStyles = {
    small: { fontSize: 12, marginTop: 4 },
    medium: { fontSize: 16, marginTop: 6 },
    large: { fontSize: 20, marginTop: 8 }
  };

  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        {/* Gradient Definition */}
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <Stop offset="50%" stopColor="#2563EB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background Circle */}
        <Circle 
          cx="100" 
          cy="100" 
          r="90" 
          fill="url(#gradient)" 
          stroke="#2563EB" 
          strokeWidth="4"
        />
        
        {/* Checkmark Icon */}
        <Circle cx="100" cy="80" r="35" fill="#FFFFFF" opacity="0.9"/>
        <Path 
          d="M85 80L95 90L115 70" 
          stroke="#2563EB" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* List Lines */}
        <Rect x="60" y="130" width="80" height="3" rx="1.5" fill="#FFFFFF"/>
        <Rect x="60" y="140" width="60" height="3" rx="1.5" fill="#FFFFFF" opacity="0.8"/>
        <Rect x="60" y="150" width="70" height="3" rx="1.5" fill="#FFFFFF" opacity="0.6"/>
        
        {/* Small decorative circles */}
        <Circle cx="50" cy="131.5" r="2" fill="#FFFFFF"/>
        <Circle cx="50" cy="141.5" r="2" fill="#FFFFFF" opacity="0.8"/>
        <Circle cx="50" cy="151.5" r="2" fill="#FFFFFF" opacity="0.6"/>
      </Svg>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.appName, textStyles[textSize]]}>
            My Todo App
          </Text>
          <Text style={[styles.subtitle, textStyles[textSize], { fontSize: textStyles[textSize].fontSize * 0.7 }]}>
            List
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: -2,
  },
});
