import React, { useState, useEffect, useMemo } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search concepts..." }: SearchBarProps) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  // Immediate search without debouncing for faster results
  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery('');
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    focusedContainer: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.2,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      marginRight: 8,
    },
    clearButton: {
      padding: 4,
      borderRadius: 12,
      backgroundColor: colors.border,
    },
  }), [colors]);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      <Search size={20} color={isFocused ? colors.primary : colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {query.length > 0 && (
        <Pressable onPress={clearSearch} style={styles.clearButton}>
          <X size={16} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}