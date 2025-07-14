import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight, Code, Lightbulb, Clock, AlertCircle } from 'lucide-react-native';
import { GitCompare } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Concept } from '@/contexts/ConceptsContext';
//import { SpeakerButton } from '@/components/SpeakerButton';

interface ConceptCardProps {
  concept: Concept;
  onPress: () => void;
}

export function ConceptCard({ concept, onPress }: ConceptCardProps) {
  const { colors } = useTheme();

  const hasOptionalSections = concept.whenToUse || concept.whyNeed || concept.codeExample;
  const hasDifferences = concept.differences;

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
    sectionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sectionsIndicators: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionText: {
      fontSize: 10,
      fontWeight: '500',
      marginLeft: 4,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    completenessIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent + '15',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    completenessText: {
      fontSize: 12,
      color: colors.accent,
      fontWeight: '500',
      marginLeft: 4,
    },
    chevron: {
      opacity: 0.7,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 8,
    },
    speakerButton: {
      padding: 6,
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
      


      {hasOptionalSections && (
        <View style={styles.sectionsContainer}>
          <View style={styles.sectionsIndicators}>
            {concept.whenToUse && (
              <View style={styles.sectionIndicator}>
                <Clock size={12} color={colors.accent} />
                <Text style={[styles.sectionText, { color: colors.accent }]}>When</Text>
              </View>
            )}
            {concept.whyNeed && (
              <View style={styles.sectionIndicator}>
                <AlertCircle size={12} color={colors.warning} />
                <Text style={[styles.sectionText, { color: colors.warning }]}>Why</Text>
              </View>
            )}
            {concept.codeExample && (
              <View style={styles.sectionIndicator}>
                <Code size={12} color={colors.secondary} />
                <Text style={[styles.sectionText, { color: colors.secondary }]}>Code</Text>
              </View>
            )}
            {concept.differences && (
              <View style={styles.sectionIndicator}>
                <GitCompare size={12} color={colors.warning} />
                <Text style={[styles.sectionText, { color: colors.warning }]}>Diff</Text>
              </View>
            )}
          </View>
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.completenessIndicator}>
          <Lightbulb size={14} color={colors.accent} />
          <Text style={styles.completenessText}>
            {hasOptionalSections && hasDifferences ? 'Complete' : hasOptionalSections ? 'Good' : 'Basic'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}