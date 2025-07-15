import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { concepts as initialConcepts } from '@/data/concepts';

interface Concept {
  topicID: number;
  title: string;
  definition: string;
  detailedExplanation: string;
  whenToUse: string;
  whyNeed: string;
  codeExample: string;
  keyword: string;
  differences: string;
}

interface ConceptsContextType {
  concepts: Concept[];
  addConcept: (concept: Omit<Concept, 'topicID'>) => void;
  updateConcept: (concept: Concept) => void;
  deleteConcept: (topicID: number) => void;
  searchConcepts: (query: string) => Concept[];
  importConcepts: (importedConcepts: Concept[]) => void;
  exportConcepts: () => Concept[];
  isLoading: boolean;
}

const ConceptsContext = createContext<ConceptsContextType | undefined>(undefined);

interface ConceptsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@concepts_storage';

export function ConceptsProvider({ children }: ConceptsProviderProps) {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create search index for faster searching
  const searchIndex = useMemo(() => {
    return concepts.map(concept => ({
      ...concept,
      searchText: [
        concept.title,
        concept.keyword,
        concept.definition,
        concept.detailedExplanation,
        concept.whenToUse,
        concept.whyNeed,
        concept.differences
      ].join(' ').toLowerCase()
    }));
  }, [concepts]);

  // Load concepts from storage on app start
  useEffect(() => {
    loadConcepts();
  }, []);

  const loadConcepts = async () => {
    try {
      setIsLoading(true);
      const storedConcepts = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedConcepts) {
        const parsedConcepts = JSON.parse(storedConcepts);
        setConcepts(parsedConcepts);
      } else {
        // First time app launch - use initial concepts and save them
        setConcepts(initialConcepts);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialConcepts));
      }
    } catch (error) {
      console.error('Error loading concepts:', error);
      // Fallback to initial concepts if storage fails
      setConcepts(initialConcepts);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConcepts = async (newConcepts: Concept[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConcepts));
    } catch (error) {
      console.error('Error saving concepts:', error);
    }
  };

  const addConcept = async (newConcept: Omit<Concept, 'topicID'>) => {
    const topicID = Math.max(...concepts.map(c => c.topicID), 0) + 1;
    const conceptWithId = { ...newConcept, topicID };
    const updatedConcepts = [...concepts, conceptWithId];
    
    setConcepts(updatedConcepts);
    await saveConcepts(updatedConcepts);
  };

  const updateConcept = async (updatedConcept: Concept) => {
    const updatedConcepts = concepts.map(concept => 
      concept.topicID === updatedConcept.topicID ? updatedConcept : concept
    );
    
    setConcepts(updatedConcepts);
    await saveConcepts(updatedConcepts);
  };

  const deleteConcept = async (topicID: number) => {
    const updatedConcepts = concepts.filter(concept => concept.topicID !== topicID);
    
    setConcepts(updatedConcepts);
    await saveConcepts(updatedConcepts);
  };

  const searchConcepts = (query: string): Concept[] => {
    if (!query.trim()) return concepts;
    
    const lowercaseQuery = query.toLowerCase().trim();
    const queryWords = lowercaseQuery.split(/\s+/);
    
    return searchIndex
      .filter(concept => {
        // Check if all query words are found in the search text
        return queryWords.every(word => 
          concept.searchText.includes(word)
        );
      })
      .map(({ searchText, ...concept }) => concept) // Remove searchText from result
      .sort((a, b) => {
        // Prioritize title matches
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        if (aTitle.includes(lowercaseQuery) && !bTitle.includes(lowercaseQuery)) return -1;
        if (!aTitle.includes(lowercaseQuery) && bTitle.includes(lowercaseQuery)) return 1;
        
        // Then prioritize keyword matches
        const aKeyword = a.keyword.toLowerCase();
        const bKeyword = b.keyword.toLowerCase();
        
        if (aKeyword.includes(lowercaseQuery) && !bKeyword.includes(lowercaseQuery)) return -1;
        if (!aKeyword.includes(lowercaseQuery) && bKeyword.includes(lowercaseQuery)) return 1;
        
        return 0;
      });
  };

  const importConcepts = async (importedConcepts: Concept[]) => {
    // Validate and sanitize imported concepts
    const validConcepts = importedConcepts.filter(concept => 
      concept.topicID && 
      concept.title && 
      concept.definition && 
      concept.detailedExplanation && 
      concept.keyword
    );

    // Ensure unique topic IDs
    const maxExistingId = Math.max(...concepts.map(c => c.topicID), 0);
    const conceptsWithUniqueIds = validConcepts.map((concept, index) => ({
      ...concept,
      topicID: concept.topicID > maxExistingId ? concept.topicID : maxExistingId + index + 1
    }));

    setConcepts(conceptsWithUniqueIds);
    await saveConcepts(conceptsWithUniqueIds);
  };

  const exportConcepts = (): Concept[] => {
    return [...concepts];
  };

  return (
    <ConceptsContext.Provider 
      value={{ 
        concepts, 
        addConcept, 
        updateConcept, 
        deleteConcept, 
        searchConcepts,
        importConcepts,
        exportConcepts,
        isLoading
      }}
    >
      {children}
    </ConceptsContext.Provider>
  );
}

export function useConcepts() {
  const context = useContext(ConceptsContext);
  if (context === undefined) {
    throw new Error('useConcepts must be used within a ConceptsProvider');
  }
  return context;
}

export type { Concept };