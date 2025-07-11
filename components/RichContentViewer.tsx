import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface RichContentViewerProps {
  content: string;
  style?: any;
}

export function RichContentViewer({ content, style }: RichContentViewerProps) {
  const { colors } = useTheme();

  const parseContent = (text: string) => {
    if (!text) return [];

    const elements: any[] = [];
    let currentIndex = 0;

    // Split by line breaks first
    const lines = text.split('\n');
    
    lines.forEach((line, lineIndex) => {
      if (line.trim() === '') {
        elements.push({ type: 'break', key: `break-${lineIndex}` });
        return;
      }

      // Check for different line types
      if (line.startsWith('> ')) {
        // Quote
        elements.push({
          type: 'quote',
          content: line.substring(2),
          key: `quote-${lineIndex}`
        });
      } else if (line.startsWith('- ')) {
        // Bullet list
        elements.push({
          type: 'bullet',
          content: line.substring(2),
          key: `bullet-${lineIndex}`
        });
      } else if (line.match(/^\d+\. /)) {
        // Numbered list
        const match = line.match(/^(\d+)\. (.*)$/);
        if (match) {
          elements.push({
            type: 'numbered',
            number: match[1],
            content: match[2],
            key: `numbered-${lineIndex}`
          });
        }
      } else if (line.startsWith('```')) {
        // Code block marker - skip for now
        return;
      } else {
        // Regular text with inline formatting
        elements.push({
          type: 'text',
          content: line,
          key: `text-${lineIndex}`
        });
      }
    });

    return elements;
  };

  const renderInlineFormatting = (text: string) => {
    const parts: any[] = [];
    let currentText = text;
    let key = 0;

    // Process bold text **text**
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${key}__`;
      parts.push({ type: 'bold', content, placeholder });
      key++;
      return placeholder;
    });

    // Process italic text *text*
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${key}__`;
      parts.push({ type: 'italic', content, placeholder });
      key++;
      return placeholder;
    });

    // Process inline code `text`
    currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
      const placeholder = `__CODE_${key}__`;
      parts.push({ type: 'code', content, placeholder });
      key++;
      return placeholder;
    });

    // Split by placeholders and render
    const segments = currentText.split(/(__[A-Z]+_\d+__)/);
    
    return segments.map((segment, index) => {
      const part = parts.find(p => p.placeholder === segment);
      if (part) {
        switch (part.type) {
          case 'bold':
            return (
              <Text key={index} style={styles.bold}>
                {part.content}
              </Text>
            );
          case 'italic':
            return (
              <Text key={index} style={styles.italic}>
                {part.content}
              </Text>
            );
          case 'code':
            return (
              <Text key={index} style={[styles.inlineCode, { backgroundColor: colors.border }]}>
                {part.content}
              </Text>
            );
          default:
            return segment;
        }
      }
      return segment;
    });
  };

  const elements = parseContent(content);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 8,
    },
    bold: {
      fontWeight: '700',
    },
    italic: {
      fontStyle: 'italic',
    },
    inlineCode: {
      fontFamily: 'monospace',
      fontSize: 14,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    quote: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 8,
      paddingLeft: 16,
      borderLeftWidth: 3,
      borderLeftColor: colors.border,
      fontStyle: 'italic',
    },
    bulletItem: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 4,
      paddingLeft: 16,
    },
    numberedItem: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 4,
      paddingLeft: 16,
    },
    break: {
      height: 8,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {elements.map((element) => {
        switch (element.type) {
          case 'text':
            return (
              <Text key={element.key} style={styles.text}>
                {renderInlineFormatting(element.content)}
              </Text>
            );
          case 'quote':
            return (
              <Text key={element.key} style={styles.quote}>
                {renderInlineFormatting(element.content)}
              </Text>
            );
          case 'bullet':
            return (
              <Text key={element.key} style={styles.bulletItem}>
                • {renderInlineFormatting(element.content)}
              </Text>
            );
          case 'numbered':
            return (
              <Text key={element.key} style={styles.numberedItem}>
                {element.number}. {renderInlineFormatting(element.content)}
              </Text>
            );
          case 'break':
            return <View key={element.key} style={styles.break} />;
          default:
            return null;
        }
      })}
    </View>
  );
}