import { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, AccessibilityInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { RootStackParamList } from '../navigation/types';

export function LandingScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigate = useCallback(
    (route: keyof RootStackParamList) => {
      navigation.navigate(route);
      AccessibilityInfo.announceForAccessibility?.(`Navigated to ${route}`);
    },
    [navigation],
  );

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.card}>
        <Text style={styles.kicker}>TheCueRoom</Text>
        <Text style={styles.title}>Command every cue from a single creative cockpit.</Text>
        <Text style={styles.subtitle}>
          Mobilize playlists, gigs, and meme drops instantly. Seamless Supabase auth keeps collaborators in sync across web and
          mobile.
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go to login screen"
            onPress={() => handleNavigate('Login')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryButtonText}>Magic Link Login</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore the feed"
            onPress={() => handleNavigate('Feed')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryButtonText}>Explore Feed</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing(2),
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing(4),
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(209, 255, 61, 0.2)',
    gap: theme.spacing(2),
    maxWidth: 420,
  },
  kicker: {
    fontFamily: theme.fonts.mono,
    color: theme.colors.lime,
    letterSpacing: 4,
    textTransform: 'uppercase',
    fontSize: 14,
  },
  title: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: theme.colors.lime,
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
  },
  primaryButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#0B0B0B',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(209, 255, 61, 0.4)',
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(3),
    borderRadius: 999,
  },
  secondaryButtonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.lime,
  },
  pressed: {
    opacity: 0.85,
  },
});
