import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export function AdminScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Console</Text>
      <Text style={styles.body}>
        Moderate community drops, review flagged cues, and roll out feature toggles. Hook this screen into Supabase row level
        security for fine-grained control.
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
