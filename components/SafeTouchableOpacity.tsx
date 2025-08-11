import * as React from 'react';
import { TouchableOpacity as RNTouchableOpacity, TouchableOpacityProps } from 'react-native';

interface SafeTouchableOpacityProps extends TouchableOpacityProps {
  onPress?: () => void;
  children?: React.ReactNode;
}

export function SafeTouchableOpacity(props: SafeTouchableOpacityProps) {
  return React.createElement(RNTouchableOpacity, props, props.children);
}
