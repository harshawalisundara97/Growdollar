import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function PlantHealthMetrics({ plant, onUpdateHealth }) {
  if (!plant) return null;

  const health = plant.healthMetrics || {
    water: 100,
    sunlight: 100,
    care: 100,
  };

  const getHealthColor = (value) => {
    if (value >= 80) return '#4CAF50';
    if (value >= 50) return '#FF9800';
    return '#F44336';
  };

  const getHealthEmoji = (value) => {
    if (value >= 80) return '😊';
    if (value >= 50) return '😐';
    return '😟';
  };

  const handleCareAction = (metric) => {
    const currentValue = health[metric] || 0;
    if (currentValue >= 100) {
      Alert.alert('Already Full', `${metric.charAt(0).toUpperCase() + metric.slice(1)} is already at maximum!`);
      return;
    }

    const newValue = Math.min(100, currentValue + 30);
    onUpdateHealth(plant.id, metric, newValue);
    
    const messages = {
      water: '💧 Plant watered! Your plant is happier now.',
      sunlight: '☀️ Plant got sunlight! Growth boosted.',
      care: '🌱 Plant cared for! Health improved.',
    };
    
    Alert.alert('Success', messages[metric]);
  };

  const getHoursSince = (timestamp) => {
    if (!timestamp) return 'Never';
    const hours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const HealthBar = ({ label, value, emoji, metric, lastAction }) => (
    <View style={styles.healthCard}>
      <View style={styles.healthHeader}>
        <Text style={styles.healthEmoji}>{emoji}</Text>
        <View style={styles.healthInfo}>
          <Text style={styles.healthLabel}>{label}</Text>
          <Text style={styles.healthTime}>
            Last: {getHoursSince(lastAction)}
          </Text>
        </View>
        <Text
          style={[styles.healthValue, { color: getHealthColor(value) }]}
        >
          {Math.round(value)}%
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${value}%`, backgroundColor: getHealthColor(value) },
          ]}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.careButton,
          value >= 100 && styles.careButtonDisabled,
        ]}
        onPress={() => handleCareAction(metric)}
        disabled={value >= 100}
      >
        <Text style={styles.careButtonText}>
          {metric === 'water' && '💧 Water'}
          {metric === 'sunlight' && '☀️ Give Sunlight'}
          {metric === 'care' && '🌱 Care for Plant'}
        </Text>
      </TouchableOpacity>
    </View>
  );

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

      <HealthBar
        label="Water"
        value={health.water}
        emoji="💧"
        metric="water"
        lastAction={health.lastWatered}
      />
      <HealthBar
        label="Sunlight"
        value={health.sunlight}
        emoji="☀️"
        metric="sunlight"
        lastAction={health.lastSunlight}
      />
      <HealthBar
        label="Care"
        value={health.care}
        emoji="🌱"
        metric="care"
        lastAction={health.lastCared}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  overallHealth: {
    alignItems: 'center',
  },
  overallEmoji: {
    fontSize: 24,
  },
  overallText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  healthCard: {
    backgroundColor: '#f9f9f9',
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
    color: '#333',
  },
  healthTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  careButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  careButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  careButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tipContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 12,
    color: '#388E3C',
    lineHeight: 18,
  },
});

