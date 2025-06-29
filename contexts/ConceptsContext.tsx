import React, { createContext, useContext, useState, ReactNode } from 'react';
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
}

interface ConceptsContextType {
  concepts: Concept[];
  addConcept: (concept: Omit<Concept, 'topicID'>) => void;
  updateConcept: (concept: Concept) => void;
  deleteConcept: (topicID: number) => void;
  searchConcepts: (query: string) => Concept[];
  importConcepts: (importedConcepts: Concept[]) => void;
  exportConcepts: () => Concept[];
}

const ConceptsContext = createContext<ConceptsContextType | undefined>(undefined);

interface ConceptsProviderProps {
  children: ReactNode;
}

export function ConceptsProvider({ children }: ConceptsProviderProps) {
  const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);

  const addConcept = (newConcept: Omit<Concept, 'topicID'>) => {
    const topicID = Math.max(...concepts.map(c => c.topicID), 0) + 1;
    setConcepts(prev => [...prev, { ...newConcept, topicID }]);
  };

  const updateConcept = (updatedConcept: Concept) => {
    setConcepts(prev => 
      prev.map(concept => 
        concept.topicID === updatedConcept.topicID ? updatedConcept : concept
      )
    );
  };

  const deleteConcept = (topicID: number) => {
    setConcepts(prev => prev.filter(concept => concept.topicID !== topicID));
  };

  const searchConcepts = (query: string): Concept[] => {
    if (!query.trim()) return concepts;
    
    const lowercaseQuery = query.toLowerCase().trim();
    return concepts.filter(concept => 
      concept.title.toLowerCase().includes(lowercaseQuery) ||
      concept.keyword.toLowerCase().includes(lowercaseQuery) ||
      concept.definition.toLowerCase().includes(lowercaseQuery)
    );
  };

  const importConcepts = (importedConcepts: Concept[]) => {
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
        exportConcepts
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