import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SectionTitle, workspaceUiStyles } from '@/features/workspace/components/workspace-ui';
import { useCompleteReminderMutation } from '@/features/workspace/workspace-query';
import type { Reminder } from '@/lib/types';

function formatReminderDate(value: string) {
  const date = new Date(value);

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ReminderList({
  emptyCopy,
  reminders,
  token,
  title,
}: {
  emptyCopy: string;
  reminders: Reminder[];
  title: string;
  token: string;
}) {
  const completeReminderMutation = useCompleteReminderMutation(token);
  const router = useRouter();

  return (
    <View style={styles.panel}>
      <SectionTitle eyebrow="Reminders" title={title} />
      {reminders.length ? (
        reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderCard}>
            <View style={styles.reminderTopRow}>
              <View style={styles.reminderMetaBlock}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={workspaceUiStyles.detailCopy}>{formatReminderDate(reminder.scheduledAt)}</Text>
              </View>
              {reminder.status === 'pending' ? (
                <Pressable
                  disabled={completeReminderMutation.isPending}
                  onPress={() => completeReminderMutation.mutate({ reminderId: reminder.id })}
                  style={[
                    styles.completeButton,
                    completeReminderMutation.isPending ? styles.buttonDisabled : null,
                  ]}
                >
                  <Text style={styles.completeButtonText}>Complete</Text>
                </Pressable>
              ) : (
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>{reminder.status}</Text>
                </View>
              )}
            </View>
            <View style={styles.tagRow}>
              <Text style={styles.tagPill}>{reminder.type.replace(/_/g, ' ')}</Text>
            </View>
            {reminder.note ? <Text style={workspaceUiStyles.detailCopy}>{reminder.note}</Text> : null}
            <Pressable onPress={() => router.push({ pathname: '/reminders/[id]', params: { id: reminder.id } } as never)} style={styles.detailsButton}><Text style={styles.detailsButtonText}>View or edit</Text></Pressable>
          </View>
        ))
      ) : (
        <Text style={workspaceUiStyles.detailCopy}>{emptyCopy}</Text>
      )}
      {completeReminderMutation.error ? (
        <Text style={styles.errorText}>{completeReminderMutation.error.message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 14,
  },
  reminderCard: {
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    gap: 10,
  },
  reminderTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  reminderMetaBlock: {
    flex: 1,
    gap: 4,
  },
  reminderTitle: {
    color: '#fef8ef',
    fontSize: 16,
    fontWeight: '800',
  },
  completeButton: {
    borderRadius: 14,
    minHeight: 40,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffcf88',
  },
  completeButtonText: {
    color: '#17325d',
    fontSize: 13,
    fontWeight: '800',
  },
  statusPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(159,202,239,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillText: {
    color: '#9fcaef',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#ffcf88',
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: '#ffd1d1',
    fontSize: 13,
    lineHeight: 20,
  },
  detailsButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)' },
  detailsButtonText: { color: '#fef8ef', fontSize: 13, fontWeight: '800' },
});
