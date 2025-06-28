import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Pressable 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Code, Lightbulb, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts } from '@/contexts/ConceptsContext';

export default function ConceptDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { concepts } = useConcepts();
  
  const concept = concepts.find(c => c.topicID.toString() === id);

  if (!concept) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Concept not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backButton: {
      marginRight: 16,
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    titleSection: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    keywords: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      backgroundColor: colors.primary + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionIcon: {
      marginRight: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    sectionContent: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    codeSection: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    codeText: {
      fontFamily: 'monospace',
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      fontSize: 18,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {concept.title}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{concept.title}</Text>
            <Text style={styles.keywords}>{concept.keyword}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lightbulb size={20} color={colors.primary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Definition</Text>
            </View>
            <Text style={styles.sectionContent}>{concept.definition}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertCircle size={20} color={colors.secondary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Detailed Explanation</Text>
            </View>
            <Text style={styles.sectionContent}>{concept.detailedExplanation}</Text>
          </View>

          {concept.whenToUse && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color={colors.accent} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>When to Use</Text>
              </View>
              <Text style={styles.sectionContent}>{concept.whenToUse}</Text>
            </View>
          )}

          {concept.whyNeed && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={20} color={colors.warning} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Why You Need It</Text>
              </View>
              <Text style={styles.sectionContent}>{concept.whyNeed}</Text>
            </View>
          )}

          {concept.codeExample && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Code size={20} color={colors.accent} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Code Example</Text>
              </View>
              <View style={styles.codeSection}>
                <Text style={styles.codeText}>{concept.codeExample}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}