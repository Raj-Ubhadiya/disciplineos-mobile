import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionHeading}>{title}</Text>
    </View>
  );
}

export function GlassCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export const workspaceUiStyles = StyleSheet.create({
  compactItem: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    gap: 4,
  },
  compactTitle: {
    color: '#fef8ef',
    fontSize: 16,
    fontWeight: '700',
  },
  compactMeta: {
    color: '#b8cae3',
    fontSize: 13,
  },
  detailCopy: {
    color: '#e6f0ff',
    fontSize: 15,
    lineHeight: 23,
  },
  goalCard: {
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    gap: 6,
  },
  goalTitle: {
    color: '#fef8ef',
    fontSize: 17,
    fontWeight: '800',
  },
  goalMeta: {
    color: '#c2d2e6',
    fontSize: 14,
    lineHeight: 21,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  partnerName: {
    color: '#fef8ef',
    fontSize: 15,
    fontWeight: '700',
  },
  partnerStatus: {
    color: '#9fcaef',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

const styles = StyleSheet.create({
  sectionTitleWrap: {
    gap: 6,
  },
  sectionEyebrow: {
    color: '#9fcaef',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionHeading: {
    color: '#fef8ef',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 24,
  },
  metricCard: {
    borderRadius: 22,
    backgroundColor: '#e6eefb',
    padding: 16,
    gap: 4,
  },
  metricValue: {
    color: '#102244',
    fontSize: 26,
    fontWeight: '900',
  },
  metricLabel: {
    color: '#56657b',
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 18,
    gap: 14,
  },
});
