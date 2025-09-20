import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function PostComposerScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Composer</Text>
      <Text style={styles.body}>
        Draft cross-platform drops, queue Supabase storage uploads, and fine-tune release timing without leaving the app.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing(3),
    gap: theme.spacing(2),
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    color: theme.colors.text,
  },
  body: {
    fontFamily: theme.fonts.body,
    fontSize: 16,
    color: theme.colors.muted,
    lineHeight: 22,
  },
});
