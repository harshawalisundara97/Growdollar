import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlantContext = createContext();

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to calculate environmental impact
  const updateEnvironmentalImpact = (plant) => {
    // Calculate based on growth stage and plant type
    const carbonPerStage = {
      'Tree': 2.5,
      'Sunflower': 0.1,
      'Rose': 0.15,
      'Cactus': 0.2,
      'Tulip': 0.1,
      'Cherry Blossom': 1.0,
    };
    const baseCarbon = carbonPerStage[plant.type] || 0.1;
    const carbonOffset = (baseCarbon * plant.growthStage) / 10;
    const oxygenProduced = carbonOffset * 0.73; // Rough conversion
    const treesEquivalent = carbonOffset / 22; // Average tree absorbs 22kg CO2/year

    return {
      carbonOffset: parseFloat(carbonOffset.toFixed(2)),
      oxygenProduced: parseFloat(oxygenProduced.toFixed(2)),
      treesEquivalent: parseFloat(treesEquivalent.toFixed(4)),
    };
  };

  // Load plants from storage
  useEffect(() => {
    loadPlants();
  }, []);

  // Update plant growth every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setPlants(prevPlants => {
        const now = Date.now();
        const updatedPlants = prevPlants.map(plant => {
          const elapsed = now - (plant.purchasedAt || now);
          const hoursElapsed = elapsed / (1000 * 60 * 60);
          const newGrowthStage = Math.min(Math.floor(hoursElapsed / 2), 10);

          const growthHistory = plant.growthHistory || [{ stage: 0, timestamp: plant.purchasedAt }];
          const lastStage = growthHistory[growthHistory.length - 1]?.stage || 0;
          if (newGrowthStage > lastStage) {
            growthHistory.push({ stage: newGrowthStage, timestamp: now });
          }

          const carbonPerStage = {
            'Tree': 2.5, 'Sunflower': 0.1, 'Rose': 0.15,
            'Cactus': 0.2, 'Tulip': 0.1, 'Cherry Blossom': 1.0,
          };
          const baseCarbon = carbonPerStage[plant.type] || 0.1;
          const carbonOffset = (baseCarbon * newGrowthStage) / 10;
          const environmentalImpact = {
            carbonOffset: parseFloat(carbonOffset.toFixed(2)),
            oxygenProduced: parseFloat((carbonOffset * 0.73).toFixed(2)),
            treesEquivalent: parseFloat((carbonOffset / 22).toFixed(4)),
          };

          const hoursSinceWater = (now - (plant.healthMetrics?.lastWatered || plant.purchasedAt)) / (1000 * 60 * 60);
          const hoursSinceSunlight = (now - (plant.healthMetrics?.lastSunlight || plant.purchasedAt)) / (1000 * 60 * 60);
          const hoursSinceCare = (now - (plant.healthMetrics?.lastCared || plant.purchasedAt)) / (1000 * 60 * 60);

          return {
            ...plant,
            growthStage: newGrowthStage,
            growthHistory,
            environmentalImpact,
            healthMetrics: {
              water: Math.max(0, (plant.healthMetrics?.water || 100) - hoursSinceWater * 2),
              sunlight: Math.max(0, (plant.healthMetrics?.sunlight || 100) - hoursSinceSunlight * 1.5),
              care: Math.max(0, (plant.healthMetrics?.care || 100) - hoursSinceCare * 1),
              lastWatered: plant.healthMetrics?.lastWatered || plant.purchasedAt,
              lastSunlight: plant.healthMetrics?.lastSunlight || plant.purchasedAt,
              lastCared: plant.healthMetrics?.lastCared || plant.purchasedAt,
            },
          };
        });
        savePlants(updatedPlants);
        return updatedPlants;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadPlants = async () => {
    try {
      const storedPlants = await AsyncStorage.getItem('plants');
      if (storedPlants) {
        const parsedPlants = JSON.parse(storedPlants);
        // Update growth based on time elapsed and ensure all new fields exist
        const updatedPlants = parsedPlants.map(plant => {
          const now = Date.now();
          const purchasedAt = plant.purchasedAt || now;
          const elapsed = now - purchasedAt;
          const hoursElapsed = elapsed / (1000 * 60 * 60);
          const growthStage = Math.min(Math.floor(hoursElapsed / 2), 10);

          // Ensure backward compatibility with old plant data
          const plantWithDefaults = {
            ...plant,
            purchasedAt,
            location: plant.location || null,
            photos: plant.photos || [],
            healthMetrics: plant.healthMetrics || {
              water: 100,
              sunlight: 100,
              care: 100,
              lastWatered: purchasedAt,
              lastSunlight: purchasedAt,
              lastCared: purchasedAt,
            },
            environmentalImpact: plant.environmentalImpact || {
              carbonOffset: 0,
              oxygenProduced: 0,
              treesEquivalent: 0.01,
            },
            growthHistory: plant.growthHistory || [{ stage: 0, timestamp: purchasedAt }],
          };

          // Update environmental impact
          const environmentalImpact = updateEnvironmentalImpact({ ...plantWithDefaults, growthStage });

          return {
            ...plantWithDefaults,
            growthStage,
            environmentalImpact,
          };
        });
        setPlants(updatedPlants);
        savePlants(updatedPlants);
      }
    } catch (error) {
      console.error('Error loading plants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePlants = async (plantsToSave) => {
    try {
      await AsyncStorage.setItem('plants', JSON.stringify(plantsToSave));
    } catch (error) {
      console.error('Error saving plants:', error);
    }
  };

  const updatePlantGrowth = () => {
    const updatedPlants = plants.map(plant => {
      const now = Date.now();
      const elapsed = now - plant.purchasedAt;
      const hoursElapsed = elapsed / (1000 * 60 * 60);
      const newGrowthStage = Math.min(Math.floor(hoursElapsed / 2), 10);
      
      // Add to growth history if stage changed
      const growthHistory = plant.growthHistory || [{ stage: 0, timestamp: plant.purchasedAt }];
      const lastStage = growthHistory[growthHistory.length - 1]?.stage || 0;
      
      if (newGrowthStage > lastStage) {
        growthHistory.push({ stage: newGrowthStage, timestamp: now });
      }

      // Update environmental impact based on growth
      const environmentalImpact = updateEnvironmentalImpact({ ...plant, growthStage: newGrowthStage });

      // Update health metrics (decrease over time if not cared for)
      const hoursSinceWater = (now - (plant.healthMetrics?.lastWatered || plant.purchasedAt)) / (1000 * 60 * 60);
      const hoursSinceSunlight = (now - (plant.healthMetrics?.lastSunlight || plant.purchasedAt)) / (1000 * 60 * 60);
      const hoursSinceCare = (now - (plant.healthMetrics?.lastCared || plant.purchasedAt)) / (1000 * 60 * 60);

      const newWater = Math.max(0, (plant.healthMetrics?.water || 100) - hoursSinceWater * 2);
      const newSunlight = Math.max(0, (plant.healthMetrics?.sunlight || 100) - hoursSinceSunlight * 1.5);
      const newCare = Math.max(0, (plant.healthMetrics?.care || 100) - hoursSinceCare * 1);

      return {
        ...plant,
        growthStage: newGrowthStage,
        growthHistory,
        environmentalImpact,
        healthMetrics: {
          water: newWater,
          sunlight: newSunlight,
          care: newCare,
          lastWatered: plant.healthMetrics?.lastWatered || plant.purchasedAt,
          lastSunlight: plant.healthMetrics?.lastSunlight || plant.purchasedAt,
          lastCared: plant.healthMetrics?.lastCared || plant.purchasedAt,
        },
      };
    });
    setPlants(updatedPlants);
    savePlants(updatedPlants);
  };

  const addPlant = async (plantType, color, location = null) => {
    const newPlant = {
      id: Date.now().toString(),
      type: plantType,
      color: color,
      purchasedAt: Date.now(),
      growthStage: 0,
      name: `${plantType} #${plants.length + 1}`,
      location: location || null, // { latitude, longitude, address }
      photos: [], // Array of { uri, timestamp, growthStage }
      healthMetrics: {
        water: 100,
        sunlight: 100,
        care: 100,
        lastWatered: Date.now(),
        lastSunlight: Date.now(),
        lastCared: Date.now(),
      },
      environmentalImpact: {
        carbonOffset: 0, // kg CO2
        oxygenProduced: 0, // kg
        treesEquivalent: 0.01, // fraction of a tree
      },
      growthHistory: [{ stage: 0, timestamp: Date.now() }], // Timeline data
    };
    const updatedPlants = [...plants, newPlant];
    setPlants(updatedPlants);
    try {
      await savePlants(updatedPlants);
    } catch (error) {
      console.error('Failed to persist new plant:', error);
    }
    return newPlant;
  };

  const updatePlantHealth = async (plantId, metric, value) => {
    const updatedPlants = plants.map(plant => {
      if (plant.id === plantId) {
        return {
          ...plant,
          healthMetrics: {
            ...plant.healthMetrics,
            [metric]: Math.min(100, Math.max(0, value)),
            [`last${metric.charAt(0).toUpperCase() + metric.slice(1)}`]: Date.now(),
          },
        };
      }
      return plant;
    });
    setPlants(updatedPlants);
    await savePlants(updatedPlants);
  };

  const addPlantPhoto = async (plantId, photoUri) => {
    const updatedPlants = plants.map(plant => {
      if (plant.id === plantId) {
        const newPhoto = {
          uri: photoUri,
          timestamp: Date.now(),
          growthStage: plant.growthStage,
        };
        return {
          ...plant,
          photos: [...(plant.photos || []), newPhoto],
        };
      }
      return plant;
    });
    setPlants(updatedPlants);
    await savePlants(updatedPlants);
  };

  const deletePlant = async (plantId) => {
    const updatedPlants = plants.filter(plant => plant.id !== plantId);
    setPlants(updatedPlants);
    await savePlants(updatedPlants);
  };

  const value = {
    plants,
    isLoading,
    addPlant,
    deletePlant,
    updatePlantGrowth,
    updatePlantHealth,
    addPlantPhoto,
    updateEnvironmentalImpact,
  };

  return (
    <PlantContext.Provider value={value}>
      {children}
    </PlantContext.Provider>
  );
};

