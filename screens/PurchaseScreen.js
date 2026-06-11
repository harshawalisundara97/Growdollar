import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import * as Location from 'expo-location';
import { usePlants } from '../context/PlantContext';

const PLANT_TYPES = [
  { id: 1, name: 'Sunflower', emoji: '🌻', color: '#FFD700' },
  { id: 2, name: 'Rose', emoji: '🌹', color: '#FF1493' },
  { id: 3, name: 'Tree', emoji: '🌳', color: '#228B22' },
  { id: 4, name: 'Cactus', emoji: '🌵', color: '#90EE90' },
  { id: 5, name: 'Tulip', emoji: '🌷', color: '#FF69B4' },
  { id: 6, name: 'Cherry Blossom', emoji: '🌸', color: '#FFB6C1' },
];

function PurchasePlantCard({ plant, isSelected, scaleValue, entryValue, onSelect }) {
  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: entryValue.value,
    transform: [
      { translateY: (1 - entryValue.value) * 20 },
      { scale: scaleValue.value },
    ],
  }));

  return (
    <Animated.View style={[styles.plantCard, isSelected && styles.plantCardSelected, cardAnimStyle]}>
      <Pressable
        style={styles.plantCardInner}
        onPress={() => onSelect(plant)}
      >
        <Text style={styles.plantEmoji}>{plant.emoji}</Text>
        <Text style={styles.plantName}>{plant.name}</Text>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>✓</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function PurchaseScreen({ navigation }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addPlant } = usePlants();
  const isMounted = useRef(true);

  // 6 scale + entry shared values (one per plant card — hooks must be at top level)
  const scale0 = useSharedValue(1); const entry0 = useSharedValue(0);
  const scale1 = useSharedValue(1); const entry1 = useSharedValue(0);
  const scale2 = useSharedValue(1); const entry2 = useSharedValue(0);
  const scale3 = useSharedValue(1); const entry3 = useSharedValue(0);
  const scale4 = useSharedValue(1); const entry4 = useSharedValue(0);
  const scale5 = useSharedValue(1); const entry5 = useSharedValue(0);

  const cardScales = [scale0, scale1, scale2, scale3, scale4, scale5];
  const cardEntries = [entry0, entry1, entry2, entry3, entry4, entry5];

  const btnScale = useSharedValue(1);
  const btnAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    PLANT_TYPES.forEach((_, i) => {
      cardEntries[i].value = withDelay(i * 60, withTiming(1, { duration: 300 }));
    });
  }, []);

  const handleSelectPlant = (plant) => {
    const newIndex = PLANT_TYPES.findIndex(p => p.id === plant.id);
    if (selectedPlant) {
      const prevIndex = PLANT_TYPES.findIndex(p => p.id === selectedPlant.id);
      if (prevIndex >= 0) cardScales[prevIndex].value = withSpring(1, { damping: 15, stiffness: 200 });
    }
    if (newIndex >= 0) cardScales[newIndex].value = withSpring(1.05, { damping: 10, stiffness: 150 });
    setSelectedPlant(plant);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Location permission is needed to track where your plant is planted. You can add it later.',
          [{ text: 'OK' }]
        );
        return null;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      let address = null;
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          address = [addr.street, addr.city, addr.region, addr.country].filter(Boolean).join(', ');
        }
      } catch (error) {
        console.log('Reverse geocoding failed:', error);
      }
      return { latitude, longitude, address: address || 'Location saved' };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlant) {
      Alert.alert('Selection Required', 'Please select a plant to purchase');
      return;
    }
    if (!addPlant) {
      Alert.alert('Error', 'Plant service is not available. Please try again.');
      return;
    }
    setIsProcessing(true);
    try {
      let location = null;
      try {
        location = await getCurrentLocation();
      } catch (locationError) {
        console.log('Location not available, continuing without location:', locationError);
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newPlant = await addPlant(selectedPlant.name, selectedPlant.color, location);
      if (!newPlant) throw new Error('Failed to create plant');
      if (isMounted.current) setIsProcessing(false);
      Alert.alert(
        'Purchase Successful!',
        `Your ${selectedPlant.name} has been planted! Watch it grow!${location ? '\n\nLocation saved successfully.' : '\n\nNote: Location was not saved.'}`,
        [{ text: 'OK', onPress: () => { navigation.navigate('PlantDetail', { plant: newPlant }); } }]
      );
    } catch (error) {
      console.error('Purchase error:', error);
      if (isMounted.current) setIsProcessing(false);
      Alert.alert('Purchase Failed', error.message || 'Failed to purchase plant. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Plant</Text>
        <Text style={styles.headerSubtitle}>Each plant costs $1.00</Text>
      </View>

      <View style={styles.plantGrid}>
        {PLANT_TYPES.map((plant, index) => (
          <PurchasePlantCard
            key={plant.id}
            plant={plant}
            isSelected={selectedPlant?.id === plant.id}
            scaleValue={cardScales[index]}
            entryValue={cardEntries[index]}
            onSelect={handleSelectPlant}
          />
        ))}
      </View>

      <View style={styles.paymentSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.priceValue}>$1.00</Text>
        </View>

        {!selectedPlant && (
          <View style={styles.selectHint}>
            <Text style={styles.selectHintText}>
              👆 Please select a plant above to continue
            </Text>
          </View>
        )}

        <Animated.View style={btnAnimStyle}>
          <Pressable
            style={[
              styles.purchaseButton,
              (!selectedPlant || isProcessing) && styles.purchaseButtonDisabled,
            ]}
            onPress={handlePurchase}
            disabled={!selectedPlant || isProcessing}
            onPressIn={() => {
              if (selectedPlant && !isProcessing)
                btnScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
            }}
            onPressOut={() => {
              btnScale.value = withSpring(1, { damping: 15, stiffness: 200 });
            }}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.purchaseButtonText}>
                {selectedPlant ? 'Purchase Plant' : 'Select a Plant First'}
              </Text>
            )}
          </Pressable>
        </Animated.View>

        <Text style={styles.paymentNote}>
          💳 Payment is simulated for demo. In production, integrate with a payment provider.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  plantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  plantCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: 'hidden',
  },
  plantCardInner: {
    padding: 20,
    alignItems: 'center',
  },
  plantCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  plantEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentSection: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  priceLabel: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  purchaseButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 56,
    justifyContent: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectHint: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  selectHintText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
});
