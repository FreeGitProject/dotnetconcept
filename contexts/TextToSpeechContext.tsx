import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TextToSpeechContextType {
  isEnabled: boolean;
  isSpeaking: boolean;
  currentText: string;
  toggleTTS: () => void;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  rate: number;
  pitch: number;
}

const TextToSpeechContext = createContext<TextToSpeechContextType | undefined>(undefined);

interface TextToSpeechProviderProps {
  children: ReactNode;
}

const TTS_SETTINGS_KEY = '@tts_settings';

export function TextToSpeechProvider({ children }: TextToSpeechProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [rate, setRateState] = useState(0.8);
  const [pitch, setPitchState] = useState(1.0);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(TTS_SETTINGS_KEY);
      if (settings) {
        const { enabled, speechRate, speechPitch } = JSON.parse(settings);
        setIsEnabled(enabled || false);
        setRateState(speechRate || 0.8);
        setPitchState(speechPitch || 1.0);
      }
    } catch (error) {
      console.error('Error loading TTS settings:', error);
    }
  };

  const saveSettings = async (enabled: boolean, speechRate: number, speechPitch: number) => {
    try {
      await AsyncStorage.setItem(TTS_SETTINGS_KEY, JSON.stringify({
        enabled,
        speechRate,
        speechPitch
      }));
    } catch (error) {
      console.error('Error saving TTS settings:', error);
    }
  };

  const toggleTTS = async () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    await saveSettings(newEnabled, rate, pitch);
    
    if (!newEnabled && isSpeaking) {
      stop();
    }
  };

  const speak = async (text: string) => {
    if (!isEnabled || !text.trim()) return;

    try {
      // Stop any current speech
      await Speech.stop();
      
      // Clean text for better speech
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`(.*?)`/g, '$1') // Remove code markdown
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\n+/g, '. ') // Replace line breaks with pauses
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      if (!cleanText) return;

      setCurrentText(cleanText);
      setIsSpeaking(true);

      const options: Speech.SpeechOptions = {
        rate,
        pitch,
        language: 'en-US',
        onStart: () => setIsSpeaking(true),
        onDone: () => {
          setIsSpeaking(false);
          setCurrentText('');
        },
        onStopped: () => {
          setIsSpeaking(false);
          setCurrentText('');
        },
        onError: () => {
          setIsSpeaking(false);
          setCurrentText('');
        }
      };

      await Speech.speak(cleanText, options);
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
      setCurrentText('');
    }
  };

  const stop = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
      setCurrentText('');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const pause = async () => {
    if (Platform.OS === 'ios') {
      try {
        await Speech.pause();
      } catch (error) {
        console.error('Error pausing speech:', error);
      }
    }
  };

  const resume = async () => {
    if (Platform.OS === 'ios') {
      try {
        await Speech.resume();
      } catch (error) {
        console.error('Error resuming speech:', error);
      }
    }
  };

  const setRate = async (newRate: number) => {
    setRateState(newRate);
    await saveSettings(isEnabled, newRate, pitch);
  };

  const setPitch = async (newPitch: number) => {
    setPitchState(newPitch);
    await saveSettings(isEnabled, rate, newPitch);
  };

  return (
    <TextToSpeechContext.Provider 
      value={{ 
        isEnabled,
        isSpeaking,
        currentText,
        toggleTTS,
        speak,
        stop,
        pause,
        resume,
        setRate,
        setPitch,
        rate,
        pitch
      }}
    >
      {children}
    </TextToSpeechContext.Provider>
  );
}

export function useTextToSpeech() {
  const context = useContext(TextToSpeechContext);
  if (context === undefined) {
    throw new Error('useTextToSpeech must be used within a TextToSpeechProvider');
  }
  return context;
}