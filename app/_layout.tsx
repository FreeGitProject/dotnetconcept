import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ConceptsProvider } from '@/contexts/ConceptsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <ConceptsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ConceptsProvider>
    </ThemeProvider>
  );
}