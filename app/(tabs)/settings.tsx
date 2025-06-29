import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert, Platform } from 'react-native';
import { Moon, Sun, Info, Code, Heart, Download, Upload, FileText, Share } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useConcepts } from '@/contexts/ConceptsContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function SettingsScreen() {
  const { colors, theme } = useTheme();
  const { concepts, importConcepts, exportConcepts } = useConcepts();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        conceptsCount: concepts.length,
        concepts: concepts
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `csharp-concepts-backup-${new Date().toISOString().split('T')[0]}.json`;

      if (Platform.OS === 'web') {
        // Web platform - download file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Alert.alert(
          'Export Successful',
          `Successfully exported ${concepts.length} concepts to ${fileName}`
        );
      } else {
        // Mobile platform - use FileSystem and Sharing
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Export C# Concepts'
          });
        } else {
          Alert.alert(
            'Export Successful',
            `File saved to: ${fileUri}`
          );
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        'Export Failed',
        'An error occurred while exporting your concepts. Please try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);

      if (Platform.OS === 'web') {
        // Web platform - file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (event: any) => {
          const file = event.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const content = e.target?.result as string;
              await processImportData(content);
            } catch (error) {
              Alert.alert('Import Failed', 'Invalid file format. Please select a valid backup file.');
            }
          };
          reader.readAsText(file);
        };
        
        input.click();
      } else {
        // Mobile platform - DocumentPicker
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/json',
          copyToCacheDirectory: true
        });

        if (!result.canceled && result.assets[0]) {
          const fileUri = result.assets[0].uri;
          const content = await FileSystem.readAsStringAsync(fileUri);
          await processImportData(content);
        }
      }
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert(
        'Import Failed',
        'An error occurred while importing concepts. Please check the file format and try again.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  const processImportData = async (content: string) => {
    try {
      const importData = JSON.parse(content);
      
      // Validate import data structure
      if (!importData.concepts || !Array.isArray(importData.concepts)) {
        throw new Error('Invalid file format');
      }

      // Validate each concept has required fields
      const requiredFields = ['topicID', 'title', 'definition', 'detailedExplanation', 'keyword'];
      const invalidConcepts = importData.concepts.filter((concept: any) => 
        !requiredFields.every(field => concept.hasOwnProperty(field) && concept[field])
      );

      if (invalidConcepts.length > 0) {
        throw new Error('Some concepts are missing required fields');
      }

      const importCount = importData.concepts.length;
      const existingCount = concepts.length;

      Alert.alert(
        'Import Concepts',
        `Found ${importCount} concepts in the backup file.\n\nThis will replace your current ${existingCount} concepts. This action cannot be undone.\n\nDo you want to continue?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Import',
            style: 'destructive',
            onPress: () => {
              importConcepts(importData.concepts);
              Alert.alert(
                'Import Successful',
                `Successfully imported ${importCount} concepts!`
              );
            }
          }
        ]
      );
    } catch (error) {
      throw new Error('Invalid file format or corrupted data');
    }
  };

  const handleShareApp = async () => {
    const shareMessage = `Check out this amazing C# Concepts app! It helps developers learn and master C# and .NET concepts with detailed explanations and code examples.`;
    
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'C# Concepts App',
            text: shareMessage,
            url: window.location.href
          });
        } catch (error) {
          // Fallback to copying to clipboard
          navigator.clipboard.writeText(shareMessage);
          Alert.alert('Shared!', 'App information copied to clipboard');
        }
      } else {
        navigator.clipboard.writeText(shareMessage);
        Alert.alert('Shared!', 'App information copied to clipboard');
      }
    } else {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync('', {
          message: shareMessage,
          dialogTitle: 'Share C# Concepts App'
        });
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    section: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    exportButton: {
      backgroundColor: colors.accent,
    },
    importButton: {
      backgroundColor: colors.secondary,
    },
    shareButton: {
      backgroundColor: colors.warning,
    },
    actionButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
    },
    disabledButton: {
      opacity: 0.6,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statsText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
    infoSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      textAlign: 'center',
    },
    madeWithLove: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    loveText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginHorizontal: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your learning experience</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Appearance</Text>
        </View>
        <View style={[styles.settingItem, styles.lastItem]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
            {theme === 'dark' ? (
              <Moon size={16} color={colors.primary} />
            ) : (
              <Sun size={16} color={colors.primary} />
            )}
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Theme</Text>
            <Text style={styles.settingDescription}>
              {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
            </Text>
          </View>
          <ThemeToggle />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Data Management</Text>
        </View>
        <View style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: colors.accent + '15' }]}>
            <Download size={16} color={colors.accent} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Export Concepts</Text>
            <Text style={styles.settingDescription}>
              Backup all your concepts to a JSON file
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <FileText size={12} color={colors.primary} />
            <Text style={styles.statsText}>{concepts.length} concepts</Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Pressable
              style={[
                styles.actionButton,
                styles.exportButton,
                isExporting && styles.disabledButton
              ]}
              onPress={handleExport}
              disabled={isExporting || concepts.length === 0}
            >
              <Download size={12} color="white" />
              <Text style={styles.actionButtonText}>
                {isExporting ? 'Exporting...' : 'Export'}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={[styles.settingItem, styles.lastItem]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.secondary + '15' }]}>
            <Upload size={16} color={colors.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Import Concepts</Text>
            <Text style={styles.settingDescription}>
              Restore concepts from a backup file
            </Text>
          </View>
          <Pressable
            style={[
              styles.actionButton,
              styles.importButton,
              isImporting && styles.disabledButton
            ]}
            onPress={handleImport}
            disabled={isImporting}
          >
            <Upload size={12} color="white" />
            <Text style={styles.actionButtonText}>
              {isImporting ? 'Importing...' : 'Import'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        <View style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: colors.accent + '15' }]}>
            <Code size={16} color={colors.accent} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>C# Concepts App</Text>
            <Text style={styles.settingDescription}>Version 1.0.0</Text>
          </View>
        </View>
        <View style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: colors.secondary + '15' }]}>
            <Info size={16} color={colors.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Purpose</Text>
            <Text style={styles.settingDescription}>
              Learn and master C# and .NET concepts
            </Text>
          </View>
        </View>
        <View style={[styles.settingItem, styles.lastItem]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.warning + '15' }]}>
            <Share size={16} color={colors.warning} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Share App</Text>
            <Text style={styles.settingDescription}>
              Tell others about this app
            </Text>
          </View>
          <Pressable
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShareApp}
          >
            <Share size={12} color="white" />
            <Text style={styles.actionButtonText}>Share</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            This app helps developers learn and reference C# and .NET concepts with detailed explanations, code examples, and practical guidance. Export your concepts to backup your learning progress or import concepts from other sources.
          </Text>
          <View style={styles.madeWithLove}>
            <Text style={styles.loveText}>Made with</Text>
            <Heart size={16} color={colors.error} fill={colors.error} />
            <Text style={styles.loveText}>for developers</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}