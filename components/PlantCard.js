import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import PlantVisualization from './PlantVisualization';
import { useTheme } from '../context/ThemeContext';

export default function PlantCard({ plant, navigation, animIndex = 0 }) {
  const [barWidth, setBarWidth] = useState(0);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const entryY = useSharedValue(30);
  const entryOp = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const barFill = useSharedValue(0);

  useEffect(() => {
    const delay = animIndex * 70;
    entryY.value = withDelay(delay, withSpring(0, { damping: 14, stiffness: 120 }));
    entryOp.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);

  useEffect(() => {
    if (barWidth > 0) {
      const target = barWidth * Math.min((plant.growthStage ?? 0) / 10, 1);
      barFill.value = withDelay(
        animIndex * 70 + 200,
        withTiming(target, { duration: 600 })
      );
    }
  }, [barWidth]);

  const entryStyle = useAnimatedStyle(() => ({
    opacity: entryOp.value,
    transform: [{ translateY: entryY.value }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const barFillStyle = useAnimatedStyle(() => ({
    width: barFill.value,
  }));

  const getGrowthStageName = () => {
    const stages = [
      'Seed', 'Sprout', 'Young', 'Growing', 'Budding',
      'Flowering', 'Maturing', 'Full Bloom', 'Mature', 'Fully Grown', 'Masterpiece',
    ];
    return stages[Math.min(plant.growthStage ?? 0, 10)];
  };

  return (
    <Animated.View style={[entryStyle, pressStyle]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PlantDetail', { plant })}
        onPressIn={() => {
          pressScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        activeOpacity={1}
      >
        <View style={styles.plantVisual}>
          <PlantVisualization
            plantType={plant.type}
            growthStage={plant.growthStage}
            color={plant.color}
            size={100}
          />
        </View>
        <Text style={styles.plantName} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={styles.growthStage}>{getGrowthStageName()}</Text>
        <View
          style={styles.progressBar}
          onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View style={[styles.progressFill, barFillStyle]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10,
  },
  plantVisual: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  growthStage: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
});
