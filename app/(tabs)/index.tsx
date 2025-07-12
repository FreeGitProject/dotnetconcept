import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts, Concept } from '@/contexts/ConceptsContext';
import { SearchBar } from '@/components/SearchBar';
import { ConceptCard } from '@/components/ConceptCard';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { concepts, searchConcepts, isLoading } = useConcepts();
  const [filteredConcepts, setFilteredConcepts] = useState<Concept[]>(concepts);
  const [searchQuery, setSearchQuery] = useState('');

  // Update filtered concepts when concepts change
  React.useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchConcepts(searchQuery);
      setFilteredConcepts(results);
    } else {
      setFilteredConcepts(concepts);
    }
  }, [concepts, searchQuery, searchConcepts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
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
        {searchQuery.trim() ? 'No matching concepts found' : 'No concepts available'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery.trim() 
          ? 'Try adjusting your search terms or add a new concept'
          : 'Start by adding your first C# concept'
        }
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
        Loading concepts...
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
    searchInfo: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      marginBottom: 8,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 120, // Extra space for floating search button
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
    loadingState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
    },
    loadingText: {
      fontSize: 16,
      marginTop: 16,
      textAlign: 'center',
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>C# Concepts</Text>
        </View>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>C# Concepts</Text>
        <Text style={styles.subtitle}>
          {concepts.length} concepts available
        </Text>
        {searchQuery.trim() && (
          <Text style={styles.searchInfo}>
            Found {filteredConcepts.length} results for "{searchQuery}"
          </Text>
        )}
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
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
      />
    </SafeAreaView>
  );
}