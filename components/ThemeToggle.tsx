import React from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(theme === 'dark' ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: theme === 'dark' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [theme, animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 30],
  });

  const styles = StyleSheet.create({
    container: {
      width: 60,
      height: 32,
      borderRadius: 16,
      padding: 2,
      justifyContent: 'center',
    },
    toggle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
  });

  return (
    <Pressable onPress={toggleTheme}>
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <Animated.View style={[styles.toggle, { transform: [{ translateX }] }]}>
          {theme === 'dark' ? (
            <Moon size={16} color={colors.primary} />
          ) : (
            <Sun size={16} color={colors.warning} />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}