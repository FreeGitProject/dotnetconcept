import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Moon, Sun, Info, Code, Heart } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SettingsScreen() {
  const { colors, theme } = useTheme();

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
        <View style={[styles.settingItem, styles.lastItem]}>
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
      </View>

      <View style={styles.section}>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            This app helps developers learn and reference C# and .NET concepts with detailed explanations, code examples, and practical guidance.
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