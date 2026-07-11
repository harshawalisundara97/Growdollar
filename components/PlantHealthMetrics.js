import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

function AnimatedHealthBar({ label, value, emoji, metric, lastAction, animDelay, onCareAction }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [barWidth, setBarWidth] = useState(0);
  const barFill = useSharedValue(0);
  const btnScale = useSharedValue(1);
  const btnFlash = useSharedValue(0);

  useEffect(() => {
    if (barWidth > 0) {
      barFill.value = withDelay(animDelay, withTiming((value / 100) * barWidth, { duration: 700 }));
    }
  }, [barWidth]);

  useEffect(() => {
    if (barWidth > 0) {
      barFill.value = withTiming((value / 100) * barWidth, { duration: 400 });
    }
  }, [value, barWidth]);

  const barFillStyle = useAnimatedStyle(() => ({ width: barFill.value }));

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
    backgroundColor: interpolateColor(btnFlash.value, [0, 1], [theme.colors.primary, theme.colors.primaryLight]),
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  }));

  const getHealthColor = (v) => {
    if (v >= 80) return theme.colors.success;
    if (v >= 50) return theme.colors.warning;
    return theme.colors.danger;
  };

  const getHoursSince = (timestamp) => {
    if (!timestamp) return 'Never';
    const hours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handlePress = () => {
    const currentValue = value || 0;
    if (currentValue >= 100) {
      Alert.alert('Already Full', `${metric.charAt(0).toUpperCase() + metric.slice(1)} is already at maximum!`);
      return;
    }
    btnScale.value = withSequence(
      withTiming(0.93, { duration: 80 }),
      withSpring(1, { damping: 8 })
    );
    btnFlash.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 400 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newValue = Math.min(100, currentValue + 30);
    onCareAction(metric, newValue);
    const messages = {
      water: '💧 Plant watered! Your plant is happier now.',
      sunlight: '☀️ Plant got sunlight! Growth boosted.',
      care: '🌱 Plant cared for! Health improved.',
    };
    Alert.alert('Success', messages[metric]);
  };

  const isDisabled = value >= 100;
  const barColor = getHealthColor(value);

  return (
    <View style={styles.healthCard}>
      <View style={styles.healthHeader}>
        <Text style={styles.healthEmoji}>{emoji}</Text>
        <View style={styles.healthInfo}>
          <Text style={styles.healthLabel}>{label}</Text>
          <Text style={styles.healthTime}>Last: {getHoursSince(lastAction)}</Text>
        </View>
        <Text style={[styles.healthValue, { color: barColor }]}>
          {Math.round(value)}%
        </Text>
      </View>

      <View
        style={styles.progressBarContainer}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[styles.progressBar, { backgroundColor: barColor }, barFillStyle]}
        />
      </View>

      <Animated.View style={[isDisabled && styles.careButtonDisabledWrapper, btnAnimStyle]}>
        <Text
          style={[styles.careButtonText]}
          onPress={isDisabled ? undefined : handlePress}
        >
          {metric === 'water' && '💧 Water'}
          {metric === 'sunlight' && '☀️ Give Sunlight'}
          {metric === 'care' && '🌱 Care for Plant'}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function PlantHealthMetrics({ plant, onUpdateHealth }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  if (!plant) return null;

  const stored = plant.healthMetrics || {};
  const now = Date.now();
  const getDecayed = (base, lastTimestamp, ratePerHour) => {
    const hoursElapsed = (now - (lastTimestamp || plant.purchasedAt || now)) / 3600000;
    return Math.max(0, (base ?? 100) - hoursElapsed * ratePerHour);
  };
  const health = {
    water: getDecayed(stored.water, stored.lastWatered, 2),
    sunlight: getDecayed(stored.sunlight, stored.lastSunlight, 1.5),
    care: getDecayed(stored.care, stored.lastCared, 1),
    lastWatered: stored.lastWatered,
    lastSunlight: stored.lastSunlight,
    lastCared: stored.lastCared,
  };

  const getHealthEmoji = (v) => {
    if (v >= 80) return '😊';
    if (v >= 50) return '😐';
    return '😟';
  };

  const handleCareAction = (metric, newValue) => {
    onUpdateHealth(plant.id, metric, newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Plant Health</Text>
        <View style={styles.overallHealth}>
          <Text style={styles.overallEmoji}>
            {getHealthEmoji((health.water + health.sunlight + health.care) / 3)}
          </Text>
          <Text style={styles.overallText}>Overall Health</Text>
        </View>
      </View>

      <AnimatedHealthBar
        label="Water"
        value={health.water}
        emoji="💧"
        metric="water"
        lastAction={health.lastWatered}
        animDelay={0}
        onCareAction={handleCareAction}
      />
      <AnimatedHealthBar
        label="Sunlight"
        value={health.sunlight}
        emoji="☀️"
        metric="sunlight"
        lastAction={health.lastSunlight}
        animDelay={100}
        onCareAction={handleCareAction}
      />
      <AnimatedHealthBar
        label="Care"
        value={health.care}
        emoji="🌱"
        metric="care"
        lastAction={health.lastCared}
        animDelay={200}
        onCareAction={handleCareAction}
      />

      <View style={styles.tipContainer}>
        <Text style={styles.tipTitle}>💡 Tip</Text>
        <Text style={styles.tipText}>
          Keep your plant healthy by watering, providing sunlight, and caring
          for it regularly. Healthy plants grow faster and produce more oxygen!
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  overallHealth: {
    alignItems: 'center',
  },
  overallEmoji: {
    fontSize: 24,
  },
  overallText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  healthCard: {
    backgroundColor: theme.colors.surfaceAlt,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  healthInfo: {
    flex: 1,
  },
  healthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  healthTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  careButtonDisabledWrapper: {
    opacity: 0.5,
  },
  careButtonText: {
    color: theme.colors.textInverse,
    fontSize: 13,
    fontWeight: '600',
  },
  tipContainer: {
    backgroundColor: theme.colors.surfaceAlt,
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
    marginBottom: 5,
  },
  tipText: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    lineHeight: 18,
  },
});
