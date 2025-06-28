import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts, Concept } from '@/contexts/ConceptsContext';
import { SearchBar } from '@/components/SearchBar';
import { ConceptCard } from '@/components/ConceptCard';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { concepts, searchConcepts } = useConcepts();
  const [filteredConcepts, setFilteredConcepts] = useState<Concept[]>(concepts);

  const handleSearch = useCallback((query: string) => {
    const results = searchConcepts(query);
    setFilteredConcepts(results);
  }, [searchConcepts]);

  const handleConceptPress = (concept: Concept) => {
    router.push({
      pathname: '/concept/[id]',
      params: { id: concept.topicID.toString() }
    });
  };

  const renderConcept = ({ item }: { item: Concept }) => (
    <ConceptCard 
      concept={item} 
      onPress={() => handleConceptPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No concepts found
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Try adjusting your search terms or add a new concept
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 100,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingTop: 80,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>C# Concepts</Text>
        <Text style={styles.subtitle}>
          {filteredConcepts.length} concepts available
        </Text>
      </View>
      
      <SearchBar onSearch={handleSearch} />
      
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={filteredConcepts}
        renderItem={renderConcept}
        keyExtractor={(item) => item.topicID.toString()}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}