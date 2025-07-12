import { useEffect } from 'react';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ConceptsProvider } from '@/contexts/ConceptsContext';
import { GlobalSearch } from '@/components/GlobalSearch';
import { GlobalSearchButton } from '@/components/GlobalSearchButton';

export default function RootLayout() {
  useFrameworkReady();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <ThemeProvider>
      <ConceptsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        
        <GlobalSearchButton onPress={() => setIsSearchVisible(true)} />
        <GlobalSearch 
          visible={isSearchVisible} 
          onClose={() => setIsSearchVisible(false)} 
        />
      </ConceptsProvider>
    </ThemeProvider>
  );
}