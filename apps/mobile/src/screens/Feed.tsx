import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useMemo } from 'react';
import { theme } from '../theme';

const previewItems = [
  {
    id: '1',
    title: 'Gig Radar synced',
    summary: 'Eight new venues added to your feed from Supabase Realtime.',
  },
  {
    id: '2',
    title: 'Meme Studio drafts',
    summary: 'You have 3 drafts ready to drop when the beat hits.',
  },
];

export function FeedScreen(): JSX.Element {
  const data = useMemo(() => previewItems, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Live community feed
      </Text>
      <Text style={styles.subtitle}>Realtime updates will render here once Supabase channels are connected.</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSummary}>{item.summary}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing(3),
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: 28,
    color: theme.colors.text,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 16,
    marginBottom: theme.spacing(2),
  },
  list: {
    paddingBottom: theme.spacing(2),
  },
  separator: {
    height: theme.spacing(2),
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing(3),
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(135, 59, 191, 0.3)',
  },
  cardTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing(0.5),
  },
  cardSummary: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 20,
  },
});
