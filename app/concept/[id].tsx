import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  Alert 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Code, Lightbulb, Clock, CircleAlert as AlertCircle, CreditCard as Edit3, Trash2, GitCompare } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts } from '@/contexts/ConceptsContext';
import { RichContentViewer } from '@/components/RichContentViewer';
import { CodeBlock } from '@/components/CodeBlock';
import { TextWithSpeaker } from '@/components/TextWithSpeaker';

export default function ConceptDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { concepts, deleteConcept } = useConcepts();
  
  const concept = concepts.find(c => c.topicID.toString() === id);

  const handleEdit = () => {
    router.push(`/concept/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Concept',
      `Are you sure you want to delete "${concept?.title}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (concept) {
              deleteConcept(concept.topicID);
              router.back();
            }
          }
        }
      ]
    );
  };



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
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
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.error,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 4,
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
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
        
        <View style={styles.headerActions}>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={16} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
          
          <Pressable style={styles.editButton} onPress={handleEdit}>
            <Edit3 size={16} color="white" />
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        </View>
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
            <TextWithSpeaker text={concept.definition}>
              <RichContentViewer content={concept.definition} />
            </TextWithSpeaker>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertCircle size={20} color={colors.secondary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Detailed Explanation</Text>
            </View>
            <TextWithSpeaker text={concept.detailedExplanation}>
              <RichContentViewer content={concept.detailedExplanation} />
            </TextWithSpeaker>
          </View>

          {concept.whenToUse && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color={colors.accent} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>When to Use</Text>
              </View>
              <TextWithSpeaker text={concept.whenToUse}>
                <RichContentViewer content={concept.whenToUse} />
              </TextWithSpeaker>
            </View>
          )}

          {concept.whyNeed && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={20} color={colors.warning} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Why You Need It</Text>
              </View>
              <TextWithSpeaker text={concept.whyNeed}>
                <RichContentViewer content={concept.whyNeed} />
              </TextWithSpeaker>
            </View>
          )}

          {concept.codeExample && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Code size={20} color={colors.accent} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Code Example</Text>
              </View>
              <CodeBlock code={concept.codeExample} language="csharp" />
            </View>
          )}

          {concept.differences && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <GitCompare size={20} color={colors.secondary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Key Differences</Text>
              </View>
              <TextWithSpeaker text={concept.differences}>
                <RichContentViewer content={concept.differences} />
              </TextWithSpeaker>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}