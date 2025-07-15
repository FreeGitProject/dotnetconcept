import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTextToSpeech } from '@/contexts/TextToSpeechContext';

interface SpeakerButtonProps {
  text: string;
  size?: number;
  style?: any;
  showWhenDisabled?: boolean;
}

export function SpeakerButton({ 
  text, 
  size = 20, 
  style,
  showWhenDisabled = false 
}: SpeakerButtonProps) {
  const { colors } = useTheme();
  const { isEnabled, isSpeaking, currentText, speak, stop } = useTextToSpeech();

  if (!isEnabled && !showWhenDisabled) {
    return null;
  }

  const isCurrentlyPlaying = isSpeaking && currentText === text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1').replace(/#{1,6}\s/g, '').replace(/\n+/g, '. ').replace(/\s+/g, ' ').trim();

  const handlePress = () => {
    if (isCurrentlyPlaying) {
      stop();
    } else {
      speak(text);
    }
  };

  const getIcon = () => {
    if (!isEnabled) {
      return <VolumeX size={size} color={colors.textSecondary} />;
    }
    
    if (isCurrentlyPlaying) {
      return <Pause size={size} color={colors.primary} />;
    }
    
    return <Volume2 size={size} color={colors.primary} />;
  };

  const styles = StyleSheet.create({
    button: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isEnabled ? colors.primary + '15' : colors.border + '30',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isEnabled ? 1 : 0.5,
    },
    activeButton: {
      backgroundColor: colors.primary + '25',
      transform: [{ scale: 0.95 }],
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.activeButton,
        style
      ]}
      onPress={handlePress}
      disabled={!isEnabled && !showWhenDisabled}
    >
      {getIcon()}
    </Pressable>
  );
}