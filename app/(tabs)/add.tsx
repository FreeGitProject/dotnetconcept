import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Save, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts } from '@/contexts/ConceptsContext';
import { router } from 'expo-router';

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
    },
    fieldContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    requiredIndicator: {
      color: colors.error,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      minHeight: 50,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    codeInput: {
      minHeight: 150,
      fontFamily: 'monospace',
      fontSize: 14,
    },
    errorInput: {
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
    helpText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 4,
      fontStyle: 'italic',
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
            <Text style={styles.label}>
              Title <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.title && styles.errorInput]}
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="Enter concept title"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Definition <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.definition && styles.errorInput]}
              value={formData.definition}
              onChangeText={(value) => updateField('definition', value)}
              placeholder="Provide a concise definition"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
            {errors.definition && <Text style={styles.errorText}>{errors.definition}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Detailed Explanation <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.detailedExplanation && styles.errorInput]}
              value={formData.detailedExplanation}
              onChangeText={(value) => updateField('detailedExplanation', value)}
              placeholder="Provide a detailed explanation of the concept"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
            {errors.detailedExplanation && <Text style={styles.errorText}>{errors.detailedExplanation}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>When to Use</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.whenToUse}
              onChangeText={(value) => updateField('whenToUse', value)}
              placeholder="Describe when this concept should be used"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Why Need It</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.whyNeed}
              onChangeText={(value) => updateField('whyNeed', value)}
              placeholder="Explain why this concept is important"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Code Example</Text>
            <TextInput
              style={[styles.input, styles.codeInput]}
              value={formData.codeExample}
              onChangeText={(value) => updateField('codeExample', value)}
              placeholder="Provide a code example demonstrating the concept"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
            <Text style={styles.helpText}>
              Use proper indentation and formatting for better readability
            </Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Keywords <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.keyword && styles.errorInput]}
              value={formData.keyword}
              onChangeText={(value) => updateField('keyword', value)}
              placeholder="Enter comma-separated keywords"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.keyword && <Text style={styles.errorText}>{errors.keyword}</Text>}
            <Text style={styles.helpText}>
              Separate multiple keywords with commas (e.g., "DI, IoC, Services")
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}