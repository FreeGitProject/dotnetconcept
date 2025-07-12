import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Save, ArrowLeft, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts, Concept } from '@/contexts/ConceptsContext';
import { useLocalSearchParams, router } from 'expo-router';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function EditConceptScreen() {
  const { colors } = useTheme();
  const { concepts, updateConcept } = useConcepts();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const concept = concepts.find(c => c.topicID.toString() === id);
  
  const [formData, setFormData] = useState({
    title: '',
    definition: '',
    detailedExplanation: '',
    whenToUse: '',
    whyNeed: '',
    codeExample: '',
    keyword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
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
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
      padding: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 4,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 4,
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    fieldContainer: {
      marginBottom: 20,
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
  useEffect(() => {
    if (concept) {
      setFormData({
        title: concept.title,
        definition: concept.definition,
        detailedExplanation: concept.detailedExplanation,
        whenToUse: concept.whenToUse || '',
        whyNeed: concept.whyNeed || '',
        codeExample: concept.codeExample || '',
        keyword: concept.keyword,
      });
    }
  }, [concept]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.definition.trim()) newErrors.definition = 'Definition is required';
    if (!formData.detailedExplanation.trim()) newErrors.detailedExplanation = 'Detailed explanation is required';
    if (!formData.keyword.trim()) newErrors.keyword = 'Keywords are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const updatedConcept: Concept = {
      ...concept,
      ...formData,
    };

    updateConcept(updatedConcept);
    
    Alert.alert(
      'Success',
      'Concept updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        {
          text: 'Keep Editing',
          style: 'cancel'
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };



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
          <Text style={styles.title}>Edit Concept</Text>
        </View>
        
        <View style={styles.headerActions}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <X size={16} color={colors.text} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Save size={16} color="white" />
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.fieldContainer}>
            <RichTextEditor
              label="Title"
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="Enter concept title"
              error={errors.title}
              multiline={false}
              minHeight={50}
            />
          </View>

          <View style={styles.fieldContainer}>
            <RichTextEditor
              label="Definition"
              value={formData.definition}
              onChangeText={(value) => updateField('definition', value)}
              placeholder="Provide a concise definition"
              error={errors.definition}
              minHeight={100}
            />
          </View>

          <View style={styles.fieldContainer}>
            <RichTextEditor
              label="Detailed Explanation"
              value={formData.detailedExplanation}
              onChangeText={(value) => updateField('detailedExplanation', value)}
              placeholder="Provide a detailed explanation of the concept"
              error={errors.detailedExplanation}
              minHeight={150}
            />
          </View>

          <View style={styles.fieldContainer}>
            <RichTextEditor
              label="When to Use"
              value={formData.whenToUse}
              onChangeText={(value) => updateField('whenToUse', value)}
              placeholder="Describe when this concept should be used"
              minHeight={100}
            />
          </View>

          <View style={styles.fieldContainer}>
            <RichTextEditor
              label="Why Need It"
              value={formData.whyNeed}
              onChangeText={(value) => updateField('whyNeed', value)}
              placeholder="Explain why this concept is important"
              minHeight={100}
            />
          </View>

          <View style={styles.fieldContainer}>
            <RichTextEditor
              label="Code Example"
              value={formData.codeExample}
              onChangeText={(value) => updateField('codeExample', value)}
              placeholder="Provide a code example demonstrating the concept"
              minHeight={200}
              isCodeEditor={true}
            />
          </View>

          <View style={styles.fieldContainer}>
            <RichTextEditor
              label="Keywords"
              value={formData.keyword}
              onChangeText={(value) => updateField('keyword', value)}
              placeholder="Enter comma-separated keywords"
              error={errors.keyword}
              multiline={false}
              minHeight={50}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}