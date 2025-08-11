declare module 'react-native' {
  import { ReactNode } from 'react';
  
  export interface TouchableOpacityProps {
    style?: any;
    onPress?: () => void;
    disabled?: boolean;
    children?: ReactNode;
  }
  
  export interface PressableProps {
    style?: any;
    onPress?: () => void;
    children?: ReactNode;
  }
  
  export interface SafeAreaViewProps {
    style?: any;
    children?: ReactNode;
  }
  
  export function TouchableOpacity(props: TouchableOpacityProps): JSX.Element;
  export function Pressable(props: PressableProps): JSX.Element;
  export function SafeAreaView(props: SafeAreaViewProps): JSX.Element;
}
