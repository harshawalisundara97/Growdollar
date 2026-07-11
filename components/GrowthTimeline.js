import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function GrowthTimeline({ plant }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const stages = [
    'Seed',
    'Sprout',
    'Young',
    'Growing',
    'Budding',
    'Flowering',
    'Maturing',
    'Full Bloom',
    'Mature',
    'Fully Grown',
    'Masterpiece',
  ];

  const growthHistory = plant.growthHistory || [{ stage: 0, timestamp: plant.purchasedAt }];
  const currentStage = plant.growthStage || 0;

  const getTimeLabel = (timestamp) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const hoursAgo = (now - new Date(timestamp).getTime()) / (1000 * 60 * 60);
    
    if (hoursAgo < 1) return 'Just now';
    if (hoursAgo < 24) return `${Math.floor(hoursAgo)}h ago`;
    if (hoursAgo < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Growth Timeline</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.timelineContainer}>
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStage;
            const isCurrent = index === currentStage;
            const milestone = growthHistory.find(m => m.stage === index);
            
            return (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLine}>
                  {index < stages.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        isCompleted && styles.lineCompleted,
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.circle,
                      isCompleted && styles.circleCompleted,
                      isCurrent && styles.circleCurrent,
                    ]}
                  >
                    {isCompleted && (
                      <View style={styles.innerCircle} />
                    )}
                  </View>
                </View>
                <Text
                  style={[
                    styles.stageLabel,
                    isCompleted && styles.stageLabelCompleted,
                  ]}
                  numberOfLines={2}
                >
                  {stage}
                </Text>
                {milestone && (
                  <Text style={styles.timeLabel}>
                    {getTimeLabel(milestone.timestamp)}
                  </Text>
                )}
                {isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
  },
  scrollView: {
    marginHorizontal: -15,
  },
  timelineContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    minWidth: width - 30,
  },
  timelineItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  timelineLine: {
    alignItems: 'center',
    marginBottom: 8,
  },
  line: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 60,
    height: 3,
    backgroundColor: theme.colors.border,
    zIndex: 0,
  },
  lineCompleted: {
    backgroundColor: theme.colors.primary,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.border,
    borderWidth: 3,
    borderColor: theme.colors.surface,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  circleCurrent: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textInverse,
  },
  stageLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 5,
    minHeight: 30,
  },
  stageLabelCompleted: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  timeLabel: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  currentBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  currentBadgeText: {
    color: theme.colors.textInverse,
    fontSize: 8,
    fontWeight: 'bold',
  },
});

