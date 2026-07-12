import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionTitle } from '@/features/workspace/components/workspace-ui';

const actionCards = [
  {
    route: '/goals' as const,
    eyebrow: 'Goal',
    title: 'Manage goals',
    copy: 'Create, review, edit, or remove the outcomes your daily work supports.',
  },
  {
    route: '/actions/focus-session' as const,
    eyebrow: 'Focus',
    title: 'Log a focus session',
    copy: 'Capture a real block of deep work instead of letting the day blur together.',
  },
  {
    route: '/actions/complete-habit' as const,
    eyebrow: 'Habit',
    title: 'Mark a habit complete',
    copy: 'Close one small loop and keep your streak visible on mobile.',
  },
  {
    route: '/actions/new-reminder' as const,
    eyebrow: 'Reminder',
    title: 'Create a reminder',
    copy: 'Set a specific nudge so the right next action shows up before you drift.',
  },
];

export function WorkspaceActions() {
  const router = useRouter();

  return (
    <View style={styles.panel}>
      <SectionTitle eyebrow="Actions" title="Choose one clean mobile flow" />
      {actionCards.map((card) => (
        <Pressable
          key={card.route}
          onPress={() => router.push(card.route as never)}
          style={styles.actionCard}
        >
          <Text style={styles.actionEyebrow}>{card.eyebrow}</Text>
          <Text style={styles.actionTitle}>{card.title}</Text>
          <Text style={styles.actionCopy}>{card.copy}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 28,
    backgroundColor: 'rgba(7,18,37,0.28)',
    padding: 18,
    gap: 14,
  },
  actionCard: {
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    gap: 8,
  },
  actionEyebrow: {
    color: '#ffcf88',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  actionTitle: {
    color: '#fef8ef',
    fontSize: 18,
    fontWeight: '800',
  },
  actionCopy: {
    color: '#c2d2e6',
    fontSize: 14,
    lineHeight: 22,
  },
});
