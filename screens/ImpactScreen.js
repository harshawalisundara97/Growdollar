import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { usePlants } from '../context/PlantContext';
import { useTheme } from '../context/ThemeContext';

export default function ImpactScreen() {
  const { plants, isLoading } = usePlants();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const totals = plants.reduce(
    (acc, plant) => {
      const impact = plant.environmentalImpact || {};
      acc.carbonOffset += impact.carbonOffset || 0;
      acc.oxygenProduced += impact.oxygenProduced || 0;
      acc.treesEquivalent += impact.treesEquivalent || 0;
      return acc;
    },
    { carbonOffset: 0, oxygenProduced: 0, treesEquivalent: 0 }
  );

  const StatCard = ({ icon, label, value, unit }) => (
    <View style={styles.card}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardValue}>
        {value.toFixed(2)} <Text style={styles.cardUnit}>{unit}</Text>
      </Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🌍 Your Impact</Text>
      <Text style={styles.subtitle}>
        Combined contribution across all {plants.length} plant{plants.length === 1 ? '' : 's'}
      </Text>

      <View style={styles.grid}>
        <StatCard icon="🌳" label="Carbon Offset" value={totals.carbonOffset} unit="kg CO₂" />
        <StatCard icon="💨" label="Oxygen Produced" value={totals.oxygenProduced} unit="kg" />
        <StatCard icon="🌲" label="Tree Equivalent" value={totals.treesEquivalent} unit="trees" />
      </View>

      {plants.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyText}>Buy your first plant to start tracking your impact!</Text>
        </View>
      )}

      <View style={styles.factContainer}>
        <Text style={styles.factTitle}>💡 Did You Know?</Text>
        <Text style={styles.factText}>
          A single mature tree absorbs up to 22 kg of CO₂ per year. Every plant
          in your garden is quietly working toward a cleaner planet.
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  grid: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.sm,
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },
  cardLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  factContainer: {
    backgroundColor: theme.colors.surfaceAlt,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  factTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.xs,
  },
  factText: {
    fontSize: 12,
    color: theme.colors.text,
    lineHeight: 18,
  },
});
