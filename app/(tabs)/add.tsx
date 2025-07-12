import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Save, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts } from '@/contexts/ConceptsContext';
import { router } from 'expo-router';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function AddConceptScreen() {
  const { colors } = useTheme();
  const { addConcept } = useConcepts();
  
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

    addConcept(formData);
    
    Alert.alert(
      'Success',
      'Concept added successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              title: '',
              definition: '',
              detailedExplanation: '',
              whenToUse: '',
              whyNeed: '',
              codeExample: '',
              keyword: '',
            });
            router.push('/(tabs)');
          }
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
      paddingBottom: 120, // Extra space for floating search button
    },
    fieldContainer: {
      marginBottom: 20,
    },
  });

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
          <Text style={styles.title}>Add New Concept</Text>
        </View>
        
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Save size={16} color="white" />
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
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