import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { usePlants } from '../context/PlantContext';
import PlantVisualization from '../components/PlantVisualization';
import GrowthTimeline from '../components/GrowthTimeline';
import PhotoGallery from '../components/PhotoGallery';
import LocationMap from '../components/LocationMap';
import PlantHealthMetrics from '../components/PlantHealthMetrics';
import EnvironmentalImpact from '../components/EnvironmentalImpact';

const { width } = Dimensions.get('window');

export default function PlantDetailScreen({ route, navigation }) {
  const { plant: initialPlant } = route.params || {};
  const { plants, deletePlant, updatePlantHealth, addPlantPhoto } = usePlants();
  const [plant, setPlant] = useState(initialPlant || null);
  const plantId = initialPlant?.id;

  useEffect(() => {
    if (!plantId) return;
    const updatedPlant = plants.find((p) => p.id === plantId);
    if (updatedPlant) {
      setPlant(updatedPlant);
    } else {
      navigation.goBack();
    }
  }, [plants, plantId, navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete ${plant.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePlant(plant.id),
        },
      ]
    );
  };

  const getGrowthPercentage = () => {
    return Math.min(((plant.growthStage ?? 0) / 10) * 100, 100);
  };

  const getGrowthStageName = () => {
    const stages = [
      'Seed',
      'Sprout',
      'Young Plant',
      'Growing',
      'Budding',
      'Flowering',
      'Maturing',
      'Full Bloom',
      'Mature',
      'Fully Grown',
      'Masterpiece',
    ];
    return stages[Math.min(plant.growthStage ?? 0, 10)];
  };

  const getHoursSincePurchase = () => {
    const elapsed = Date.now() - plant.purchasedAt;
    return (elapsed / (1000 * 60 * 60)).toFixed(1);
  };

  const getTimeToNextStage = () => {
    const nextStage = plant.growthStage + 1;
    if (nextStage > 10) return 'Fully grown!';
    const hoursNeeded = nextStage * 2;
    const elapsed = Date.now() - plant.purchasedAt;
    const hoursElapsed = elapsed / (1000 * 60 * 60);
    const hoursRemaining = hoursNeeded - hoursElapsed;
    if (hoursRemaining <= 0) return 'Growing now...';
    return `${hoursRemaining.toFixed(1)} hours`;
  };

  if (!plant) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.plantContainer}>
        <PlantVisualization
          plantType={plant.type}
          growthStage={plant.growthStage}
          color={plant.color}
          size={width * 0.7}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantType}>{plant.type}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Growth Stage</Text>
            <Text style={styles.statValue}>{getGrowthStageName()}</Text>
            <Text style={styles.statSubtext}>Stage {plant.growthStage}/10</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>{getGrowthPercentage().toFixed(0)}%</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${getGrowthPercentage()}%` }]}
              />
            </View>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>⏱ Time Growing:</Text>
          <Text style={styles.timeValue}>{getHoursSincePurchase()} hours</Text>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>🌱 Next Stage:</Text>
          <Text style={styles.timeValue}>{getTimeToNextStage()}</Text>
        </View>

        <GrowthTimeline plant={plant} />

        <PlantHealthMetrics
          plant={plant}
          onUpdateHealth={updatePlantHealth}
        />

        <EnvironmentalImpact plant={plant} />

        <PhotoGallery
          plant={plant}
          onAddPhoto={addPlantPhoto}
        />

        <LocationMap plant={plant} />

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Plant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  plantContainer: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoContainer: {
    padding: 20,
  },
  plantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  plantType: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statSubtext: {
    fontSize: 10,
    color: '#999',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  timeLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

