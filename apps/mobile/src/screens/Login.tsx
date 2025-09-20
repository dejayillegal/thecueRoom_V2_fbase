import { useState, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';

export function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Enter a valid email address to receive your magic link.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: 'thecueroom://login',
        },
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Magic link sent',
        "Check your inbox and open the link on this device to jump back into TheCueRoom.",
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Login failed', message);
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
      accessibilityLabel="Magic link login form"
    >
      <View style={styles.card}>
        <Text style={styles.title}>Magic link login</Text>
        <Text style={styles.subtitle}>
          {"Enter your email and we'll send a one-time link powered by Supabase Auth. Use the same address across web and mobile to keep your cues in sync."}
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          accessibilityLabel="Email address"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting }}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [styles.button, (pressed || isSubmitting) && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Sending magic link…' : 'Send magic link'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing(4),
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(209, 255, 61, 0.25)',
    gap: theme.spacing(2),
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(2),
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
    borderWidth: 1,
    borderColor: 'rgba(209, 255, 61, 0.2)',
  },
  button: {
    borderRadius: 999,
    backgroundColor: theme.colors.lime,
    paddingVertical: theme.spacing(1.5),
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#0B0B0B',
  },
});
