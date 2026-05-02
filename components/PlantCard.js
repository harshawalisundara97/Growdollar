import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PlantVisualization from './PlantVisualization';

export default function PlantCard({ plant, navigation }) {
  const getGrowthStageName = () => {
    const stages = [
      'Seed', 'Sprout', 'Young', 'Growing', 'Budding',
      'Flowering', 'Maturing', 'Full Bloom', 'Mature', 'Fully Grown', 'Masterpiece',
    ];
    return stages[Math.min(plant.growthStage ?? 0, 10)];
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PlantDetail', { plant })}
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
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min((plant.growthStage / 10) * 100, 100)}%` },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  growthStage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
});

