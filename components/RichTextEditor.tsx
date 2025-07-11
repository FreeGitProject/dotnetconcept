import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable,
  Modal,
  Alert
} from 'react-native';
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Quote,
  Eye,
  EyeOff,
  Type,
  Palette
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  error?: string;
  multiline?: boolean;
  isCodeEditor?: boolean;
}

export function RichTextEditor({
  value,
  onChangeText,
  placeholder = "Enter text...",
  minHeight = 100,
  label,
  error,
  multiline = true,
  isCodeEditor = false
}: RichTextEditorProps) {
  const { colors } = useTheme();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const textInputRef = useRef<TextInput>(null);

  const insertText = (before: string, after: string = '') => {
    const beforeText = value.substring(0, selectionStart);
    const selectedText = value.substring(selectionStart, selectionEnd);
    const afterText = value.substring(selectionEnd);
    
    const newText = beforeText + before + selectedText + after + afterText;
    onChangeText(newText);
    
    // Focus back to input
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const formatBold = () => insertText('**', '**');
  const formatItalic = () => insertText('*', '*');
  const formatCode = () => insertText('`', '`');
  const formatCodeBlock = () => insertText('\n```\n', '\n```\n');
  const formatQuote = () => insertText('\n> ', '');
  const formatBulletList = () => insertText('\n- ', '');
  const formatNumberedList = () => insertText('\n1. ', '');

  const renderPreview = (text: string) => {
    // Simple markdown-like preview
    let preview = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background-color: #f0f0f0; padding: 2px 4px; border-radius: 3px;">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote style="border-left: 3px solid #ccc; margin: 10px 0; padding-left: 10px; color: #666;">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br/>');

    return preview;
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    requiredIndicator: {
      color: colors.error,
    },
    toggleButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggleButton: {
      padding: 6,
      borderRadius: 6,
      marginLeft: 8,
    },
    activeToggle: {
      backgroundColor: colors.primary + '20',
    },
    editorContainer: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: error ? colors.error : colors.border,
      borderRadius: 12,
      overflow: 'hidden',
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexWrap: 'wrap',
    },
    toolbarButton: {
      padding: 8,
      borderRadius: 6,
      marginRight: 4,
      marginBottom: 4,
    },
    toolbarButtonActive: {
      backgroundColor: colors.primary + '20',
    },
    separator: {
      width: 1,
      height: 20,
      backgroundColor: colors.border,
      marginHorizontal: 8,
    },
    input: {
      padding: 16,
      fontSize: 16,
      color: colors.text,
      minHeight: minHeight,
      textAlignVertical: 'top',
    },
    codeInput: {
      fontFamily: 'monospace',
      fontSize: 14,
      backgroundColor: colors.background,
    },
    previewContainer: {
      padding: 16,
      minHeight: minHeight,
    },
    previewText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
    helpText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 4,
      fontStyle: 'italic',
    },
    formatModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formatModalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      margin: 20,
      maxWidth: 300,
    },
    formatModalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    formatOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    formatOptionText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    formatExample: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 12,
      marginTop: 2,
    },
  });

  const ToolbarButton = ({ onPress, icon: Icon, active = false }: any) => (
    <Pressable
      style={[styles.toolbarButton, active && styles.toolbarButtonActive]}
      onPress={onPress}
    >
      <Icon size={18} color={active ? colors.primary : colors.textSecondary} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {error && <Text style={styles.requiredIndicator}> *</Text>}
          </Text>
          <View style={styles.toggleButtons}>
            <Pressable
              style={[styles.toggleButton, showFormatting && styles.activeToggle]}
              onPress={() => setShowFormatting(!showFormatting)}
            >
              <Palette size={16} color={showFormatting ? colors.primary : colors.textSecondary} />
            </Pressable>
            <Pressable
              style={[styles.toggleButton, isPreviewMode && styles.activeToggle]}
              onPress={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? (
                <EyeOff size={16} color={colors.primary} />
              ) : (
                <Eye size={16} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.editorContainer}>
        {showFormatting && !isCodeEditor && (
          <View style={styles.toolbar}>
            <ToolbarButton onPress={formatBold} icon={Bold} />
            <ToolbarButton onPress={formatItalic} icon={Italic} />
            <ToolbarButton onPress={formatCode} icon={Code} />
            <View style={styles.separator} />
            <ToolbarButton onPress={formatBulletList} icon={List} />
            <ToolbarButton onPress={formatNumberedList} icon={ListOrdered} />
            <ToolbarButton onPress={formatQuote} icon={Quote} />
            <View style={styles.separator} />
            <ToolbarButton onPress={formatCodeBlock} icon={Type} />
          </View>
        )}

        {isPreviewMode ? (
          <ScrollView style={styles.previewContainer}>
            <Text style={styles.previewText}>
              {value || 'Nothing to preview...'}
            </Text>
          </ScrollView>
        ) : (
          <TextInput
            ref={textInputRef}
            style={[
              styles.input,
              isCodeEditor && styles.codeInput,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            multiline={multiline}
            onSelectionChange={(event) => {
              setSelectionStart(event.nativeEvent.selection.start);
              setSelectionEnd(event.nativeEvent.selection.end);
            }}
            autoCorrect={!isCodeEditor}
            autoCapitalize={isCodeEditor ? 'none' : 'sentences'}
            spellCheck={!isCodeEditor}
          />
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {!isCodeEditor && (
        <Text style={styles.helpText}>
          Use **bold**, *italic*, `code`, `&gt;` quotes, - lists. Toggle preview to see formatting.
        </Text>
      )}

      <Modal
        visible={showFormatting && false} // Disabled for now, toolbar is inline
        transparent
        animationType="fade"
        onRequestClose={() => setShowFormatting(false)}
      >
        <View style={styles.formatModal}>
          <View style={styles.formatModalContent}>
            <Text style={styles.formatModalTitle}>Formatting Options</Text>
            
            <Pressable style={styles.formatOption} onPress={formatBold}>
              <Bold size={20} color={colors.primary} />
              <View>
                <Text style={styles.formatOptionText}>Bold</Text>
                <Text style={styles.formatExample}>**text**</Text>
              </View>
            </Pressable>

            <Pressable style={styles.formatOption} onPress={formatItalic}>
              <Italic size={20} color={colors.primary} />
              <View>
                <Text style={styles.formatOptionText}>Italic</Text>
                <Text style={styles.formatExample}>*text*</Text>
              </View>
            </Pressable>

            <Pressable style={styles.formatOption} onPress={formatCode}>
              <Code size={20} color={colors.primary} />
              <View>
                <Text style={styles.formatOptionText}>Inline Code</Text>
                <Text style={styles.formatExample}>`code`</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}