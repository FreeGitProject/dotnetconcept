import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Pressable,
  SafeAreaView,
  Keyboard,
  Platform
} from 'react-native';
import { Search, X, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts, Concept } from '@/contexts/ConceptsContext';
import { router } from 'expo-router';

interface GlobalSearchProps {
  visible: boolean;
  onClose: () => void;
}

export function GlobalSearch({ visible, onClose }: GlobalSearchProps) {
  const { colors } = useTheme();
  const { searchConcepts } = useConcepts();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Concept[]>([]);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when modal closes
      setQuery('');
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchConcepts(query);
      setResults(searchResults.slice(0, 10)); // Limit to 10 results for performance
    } else {
      setResults([]);
    }
  }, [query, searchConcepts]);

  const handleSelectConcept = (concept: Concept) => {
    onClose();
    router.push({
      pathname: '/concept/[id]',
      params: { id: concept.topicID.toString() }
    });
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const renderResult = ({ item }: { item: Concept }) => (
    <Pressable
      style={({ pressed }) => [
        styles.resultItem,
        pressed && { backgroundColor: colors.border }
      ]}
      onPress={() => handleSelectConcept(item)}
    >
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.resultKeywords, { color: colors.primary }]} numberOfLines={1}>
          {item.keyword}
        </Text>
        <Text style={[styles.resultDefinition, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.definition}
        </Text>
      </View>
      <ArrowRight size={16} color={colors.textSecondary} />
    </Pressable>
  );

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-start',
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 16,
      maxHeight: '80%',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 18,
      color: colors.text,
      paddingVertical: 8,
    },
    closeButton: {
      padding: 8,
      marginLeft: 8,
    },
    resultsContainer: {
      maxHeight: 400,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultContent: {
      flex: 1,
      marginRight: 12,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    resultKeywords: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 4,
    },
    resultDefinition: {
      fontSize: 14,
      lineHeight: 18,
    },
    emptyState: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    noResults: {
      padding: 24,
      alignItems: 'center',
    },
    noResultsText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Search size={20} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Search concepts..."
              placeholderTextColor={colors.textSecondary}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {query.trim() === '' ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Start typing to search through all your C# concepts
              </Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              style={styles.resultsContainer}
              data={results}
              renderItem={renderResult}
              keyExtractor={(item) => item.topicID.toString()}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                No concepts found for "{query}"
              </Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}