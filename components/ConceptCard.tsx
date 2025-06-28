import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight, Code, Lightbulb } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Concept } from '@/contexts/ConceptsContext';

interface ConceptCardProps {
  concept: Concept;
  onPress: () => void;
}

export function ConceptCard({ concept, onPress }: ConceptCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    keywords: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    definition: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    codeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent + '15',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    codeText: {
      fontSize: 12,
      color: colors.accent,
      fontWeight: '500',
      marginLeft: 4,
    },
    chevron: {
      opacity: 0.7,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Lightbulb size={20} color={colors.primary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{concept.title}</Text>
          <Text style={styles.keywords} numberOfLines={1}>{concept.keyword}</Text>
        </View>
        <ChevronRight size={20} color={colors.textSecondary} style={styles.chevron} />
      </View>
      
      <Text style={styles.definition} numberOfLines={3}>
        {concept.definition}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.codeIndicator}>
          <Code size={14} color={colors.accent} />
          <Text style={styles.codeText}>Code Example</Text>
        </View>
      </View>
    </Pressable>
  );
}