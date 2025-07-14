import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SpeakerButton } from './SpeakerButton';
import { useTheme } from '@/contexts/ThemeContext';

interface TextWithSpeakerProps {
  children: React.ReactNode;
  text: string;
  style?: any;
  textStyle?: any;
  speakerSize?: number;
  showSpeaker?: boolean;
}

export function TextWithSpeaker({ 
  children, 
  text, 
  style, 
  textStyle,
  speakerSize = 16,
  showSpeaker = true
}: TextWithSpeakerProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    textContainer: {
      flex: 1,
      marginRight: showSpeaker ? 8 : 0,
    },
    speakerContainer: {
      marginTop: 2,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        {children}
      </View>
      {showSpeaker && (
        <View style={styles.speakerContainer}>
          <SpeakerButton 
            text={text} 
            size={speakerSize}
          />
        </View>
      )}
    </View>
  );
}