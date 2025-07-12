import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface GlobalSearchButtonProps {
  onPress: () => void;
}

export function GlobalSearchButton({ onPress }: GlobalSearchButtonProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    button: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 100 : 90,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 1000,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 }
      ]}
      onPress={onPress}
    >
      <Search size={24} color="white" />
    </Pressable>
  );
}