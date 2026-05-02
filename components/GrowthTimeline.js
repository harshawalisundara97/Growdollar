import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function GrowthTimeline({ plant }) {
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    color: '#333',
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
    backgroundColor: '#E0E0E0',
    zIndex: 0,
  },
  lineCompleted: {
    backgroundColor: '#4CAF50',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  circleCurrent: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  stageLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
    minHeight: 30,
  },
  stageLabelCompleted: {
    color: '#333',
    fontWeight: '600',
  },
  timeLabel: {
    fontSize: 9,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },
  currentBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

