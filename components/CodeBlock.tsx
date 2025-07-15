import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, SafeAreaView } from 'react-native';
import { Maximize2, X, Copy, Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';

interface CodeBlockProps {
  code: string;
  language?: string;
  style?: any;
}

export function CodeBlock({ code, language = 'csharp', style }: CodeBlockProps) {
  const { colors, theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // C# Keywords and syntax patterns
  const csharpKeywords = [
    'public', 'private', 'protected', 'internal', 'static', 'readonly', 'const',
    'class', 'interface', 'struct', 'enum', 'namespace', 'using',
    'if', 'else', 'switch', 'case', 'default', 'for', 'foreach', 'while', 'do',
    'try', 'catch', 'finally', 'throw', 'return', 'break', 'continue',
    'new', 'this', 'base', 'null', 'true', 'false',
    'string', 'int', 'bool', 'double', 'float', 'decimal', 'char', 'byte',
    'void', 'var', 'object', 'dynamic', 'async', 'await', 'Task',
    'get', 'set', 'value', 'override', 'virtual', 'abstract', 'sealed'
  ];

  const csharpTypes = [
    'String', 'Int32', 'Boolean', 'Double', 'Float', 'Decimal', 'Char', 'Byte',
    'List', 'Dictionary', 'Array', 'IEnumerable', 'IQueryable', 'Task',
    'HttpClient', 'DbContext', 'IEmailService', 'User', 'Order'
  ];

  // Color scheme based on theme
  const codeTheme = theme === 'dark' ? {
    background: '#1e1e1e',
    text: '#d4d4d4',
    keyword: '#569cd6',
    string: '#ce9178',
    comment: '#6a9955',
    type: '#4ec9b0',
    number: '#b5cea8',
    operator: '#d4d4d4',
    punctuation: '#d4d4d4',
    method: '#dcdcaa',
    property: '#9cdcfe',
    lineNumber: '#858585'
  } : {
    background: '#f8f8f8',
    text: '#383a42',
    keyword: '#a626a4',
    string: '#50a14f',
    comment: '#a0a1a7',
    type: '#c18401',
    number: '#986801',
    operator: '#383a42',
    punctuation: '#383a42',
    method: '#4078f2',
    property: '#e45649',
    lineNumber: '#9d9d9f'
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const highlightCode = (code: string) => {
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      const tokens: any[] = [];
      let currentIndex = 0;
      
      // Process each character in the line
      while (currentIndex < line.length) {
        const remainingLine = line.substring(currentIndex);
        
        // Skip whitespace
        if (remainingLine.match(/^\s+/)) {
          const whitespace = remainingLine.match(/^\s+/)![0];
          tokens.push({ type: 'whitespace', content: whitespace });
          currentIndex += whitespace.length;
          continue;
        }
        
        // Comments
        if (remainingLine.startsWith('//')) {
          tokens.push({ type: 'comment', content: remainingLine });
          break;
        }
        
        // Multi-line comments
        if (remainingLine.startsWith('/*')) {
          const endIndex = remainingLine.indexOf('*/');
          if (endIndex !== -1) {
            const comment = remainingLine.substring(0, endIndex + 2);
            tokens.push({ type: 'comment', content: comment });
            currentIndex += comment.length;
            continue;
          }
        }
        
        // Strings
        if (remainingLine.startsWith('"')) {
          const stringMatch = remainingLine.match(/^"([^"\\]|\\.)*"/);
          if (stringMatch) {
            tokens.push({ type: 'string', content: stringMatch[0] });
            currentIndex += stringMatch[0].length;
            continue;
          }
        }
        
        // Numbers
        if (remainingLine.match(/^\d+(\.\d+)?/)) {
          const numberMatch = remainingLine.match(/^\d+(\.\d+)?/)![0];
          tokens.push({ type: 'number', content: numberMatch });
          currentIndex += numberMatch.length;
          continue;
        }
        
        // Keywords and identifiers
        if (remainingLine.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
          const identifier = remainingLine.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)![0];
          
          if (csharpKeywords.includes(identifier)) {
            tokens.push({ type: 'keyword', content: identifier });
          } else if (csharpTypes.includes(identifier)) {
            tokens.push({ type: 'type', content: identifier });
          } else if (remainingLine.substring(identifier.length).match(/^\s*\(/)) {
            tokens.push({ type: 'method', content: identifier });
          } else if (identifier.match(/^[A-Z]/)) {
            tokens.push({ type: 'type', content: identifier });
          } else {
            tokens.push({ type: 'property', content: identifier });
          }
          
          currentIndex += identifier.length;
          continue;
        }
        
        // Operators and punctuation
        const char = remainingLine[0];
        if ('{}()[];,.=+-*/<>!&|'.includes(char)) {
          tokens.push({ type: 'operator', content: char });
        } else {
          tokens.push({ type: 'text', content: char });
        }
        
        currentIndex++;
      }
      
      return { lineNumber: lineIndex + 1, tokens };
    });
  };

  const highlightedLines = highlightCode(code);

  const getTokenColor = (type: string) => {
    switch (type) {
      case 'keyword': return codeTheme.keyword;
      case 'string': return codeTheme.string;
      case 'comment': return codeTheme.comment;
      case 'type': return codeTheme.type;
      case 'number': return codeTheme.number;
      case 'method': return codeTheme.method;
      case 'property': return codeTheme.property;
      case 'operator': return codeTheme.operator;
      default: return codeTheme.text;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: codeTheme.background,
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: isFullscreen ? undefined : 500,
    },
    fullscreenContainer: {
      backgroundColor: codeTheme.background,
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '30',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageTag: {
      backgroundColor: codeTheme.keyword + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    languageText: {
      fontSize: 12,
      fontWeight: '600',
      color: codeTheme.keyword,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
      marginLeft: 8,
      backgroundColor: colors.border + '30',
    },
    fullscreenButton: {
      backgroundColor: codeTheme.keyword + '20',
    },
    copyButton: {
      backgroundColor: codeTheme.type + '20',
    },
    copiedButton: {
      backgroundColor: codeTheme.string + '20',
    },
    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginLeft: 6,
    },
    redDot: {
      backgroundColor: '#ff5f56',
    },
    yellowDot: {
      backgroundColor: '#ffbd2e',
    },
    greenDot: {
      backgroundColor: '#27ca3f',
    },
    scrollView: {
      maxHeight: isFullscreen ? undefined : 400,
    },
    fullscreenScrollView: {
      flex: 1,
    },
    codeContent: {
      width: '100%',
    },
    line: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: 20,
      marginBottom: 2,
      width: '100%',
    },
    lineNumber: {
      width: 40,
      fontSize: 12,
      fontFamily: 'monospace',
      color: codeTheme.lineNumber,
      textAlign: 'right',
      marginRight: 12,
      paddingTop: 1,
      flexShrink: 0,
    },
    lineContent: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    token: {
      fontSize: 14,
      fontFamily: 'monospace',
      lineHeight: 20,
      flexWrap: 'wrap',
    },
    fullscreenModal: {
      flex: 1,
      backgroundColor: codeTheme.background,
    },
    fullscreenHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '30',
    },
    fullscreenTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: codeTheme.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.error + '20',
    },
  });

  const CodeContent = () => (
    <ScrollView 
      style={isFullscreen ? styles.fullscreenScrollView : styles.scrollView}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
    >
      <View style={styles.codeContent}>
        {highlightedLines.map((line, index) => (
          <View key={index} style={styles.line}>
            <Text style={styles.lineNumber}>{line.lineNumber}</Text>
            <View style={styles.lineContent}>
              {line.tokens.map((token, tokenIndex) => (
                <Text
                  key={tokenIndex}
                  style={[
                    styles.token,
                    { color: getTokenColor(token.type) }
                  ]}
                >
                  {token.content}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  if (isFullscreen) {
    return (
      <Modal
        visible={isFullscreen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsFullscreen(false)}
      >
        <SafeAreaView style={styles.fullscreenModal}>
          <View style={styles.fullscreenHeader}>
            <Text style={styles.fullscreenTitle}>Code Example - {language.toUpperCase()}</Text>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setIsFullscreen(false)}
            >
              <X size={20} color={colors.error} />
            </Pressable>
          </View>
          <View style={styles.fullscreenContainer}>
            <CodeContent />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.languageTag}>
            <Text style={styles.languageText}>C#</Text>
          </View>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.redDot]} />
            <View style={[styles.dot, styles.yellowDot]} />
            <View style={[styles.dot, styles.greenDot]} />
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <Pressable 
            style={[styles.actionButton, isCopied ? styles.copiedButton : styles.copyButton]}
            onPress={handleCopy}
          >
            {isCopied ? (
              <Check size={16} color={codeTheme.string} />
            ) : (
              <Copy size={16} color={codeTheme.type} />
            )}
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, styles.fullscreenButton]}
            onPress={() => setIsFullscreen(true)}
          >
            <Maximize2 size={16} color={codeTheme.keyword} />
          </Pressable>
        </View>
      </View>
      
      <CodeContent />
    </View>
  );
}