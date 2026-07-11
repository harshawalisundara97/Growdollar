import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { useAuth } from './AuthContext';

const PlantContext = createContext();

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};

const CARBON_PER_STAGE = {
  Tree: 2.5,
  Sunflower: 0.1,
  Rose: 0.15,
  Cactus: 0.2,
  Tulip: 0.1,
  'Cherry Blossom': 1.0,
};

const computeEnvironmentalImpact = (type, growthStage) => {
  const baseCarbon = CARBON_PER_STAGE[type] || 0.1;
  const carbonOffset = (baseCarbon * growthStage) / 10;
  return {
    carbonOffset: parseFloat(carbonOffset.toFixed(2)),
    oxygenProduced: parseFloat((carbonOffset * 0.73).toFixed(2)),
    treesEquivalent: parseFloat((carbonOffset / 22).toFixed(4)),
  };
};

// --- row <-> app-shape mapping -------------------------------------------

const rowToPlant = (row) => ({
  id: row.id,
  type: row.type,
  color: row.color,
  name: row.name,
  purchasedAt: new Date(row.purchased_at).getTime(),
  growthStage: row.growth_stage,
  growthHistory: row.growth_history || [],
  healthMetrics: row.health_metrics || {},
  environmentalImpact: row.environmental_impact || {},
  location: row.location || null,
  photos: row.photos || [],
  aiInsights: row.ai_insights || [],
});

const plantToRow = (plant, userId) => ({
  id: plant.id,
  user_id: userId,
  type: plant.type,
  color: plant.color,
  name: plant.name,
  purchased_at: new Date(plant.purchasedAt).toISOString(),
  growth_stage: plant.growthStage,
  growth_history: plant.growthHistory,
  health_metrics: plant.healthMetrics,
  environmental_impact: plant.environmentalImpact,
  location: plant.location,
  photos: plant.photos,
  ai_insights: plant.aiInsights || [],
});

export const PlantProvider = ({ children }) => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const plantsRef = useRef(plants);
  plantsRef.current = plants;

  const updateEnvironmentalImpact = (plant) =>
    computeEnvironmentalImpact(plant.type, plant.growthStage);

  const recomputeGrowth = (plant, now = Date.now()) => {
    const elapsed = now - (plant.purchasedAt || now);
    const hoursElapsed = elapsed / (1000 * 60 * 60);
    const newGrowthStage = Math.min(Math.floor(hoursElapsed / 2), 10);

    const growthHistory = [...(plant.growthHistory || [{ stage: 0, timestamp: plant.purchasedAt }])];
    const lastStage = growthHistory[growthHistory.length - 1]?.stage ?? 0;
    if (newGrowthStage > lastStage) {
      growthHistory.push({ stage: newGrowthStage, timestamp: now });
    }

    return {
      ...plant,
      growthStage: newGrowthStage,
      growthHistory,
      environmentalImpact: computeEnvironmentalImpact(plant.type, newGrowthStage),
      changed: newGrowthStage !== plant.growthStage,
    };
  };

  const persistPlant = async (plant) => {
    if (!isSupabaseConfigured || !user) return;
    const { changed, ...row } = plantToRow(plant, user.uid);
    const { error } = await supabase.from('plants').update(row).eq('id', plant.id);
    if (error) console.error('Error saving plant:', error);
  };

  // Load plants for the signed-in user
  useEffect(() => {
    if (!user) {
      setPlants([]);
      setIsLoading(false);
      return;
    }
    loadPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const loadPlants = async () => {
    if (!isSupabaseConfigured || !user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const now = Date.now();
      const loaded = (data || []).map(rowToPlant).map((plant) => recomputeGrowth(plant, now));

      setPlants(loaded.map(({ changed, ...plant }) => plant));

      // persist any growth-stage catch-up from time elapsed while offline
      await Promise.all(
        loaded.filter((p) => p.changed).map(({ changed, ...plant }) => persistPlant(plant))
      );
    } catch (error) {
      console.error('Error loading plants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update plant growth every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const recomputed = plantsRef.current.map((plant) => recomputeGrowth(plant, now));
      const toPersist = recomputed.filter((p) => p.changed);
      setPlants(recomputed.map(({ changed, ...plant }) => plant));
      toPersist.forEach(({ changed, ...plant }) => persistPlant(plant));
    }, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const updatePlantGrowth = () => {
    const now = Date.now();
    const recomputed = plantsRef.current.map((plant) => recomputeGrowth(plant, now));
    const toPersist = recomputed.filter((p) => p.changed);
    setPlants(recomputed.map(({ changed, ...plant }) => plant));
    toPersist.forEach(({ changed, ...plant }) => persistPlant(plant));
  };

  const addPlant = async (plantType, color, location = null) => {
    const newPlant = {
      id: undefined,
      type: plantType,
      color,
      purchasedAt: Date.now(),
      growthStage: 0,
      name: `${plantType} #${plants.length + 1}`,
      location: location || null,
      photos: [],
      aiInsights: [],
      healthMetrics: {
        water: 100,
        sunlight: 100,
        care: 100,
        lastWatered: Date.now(),
        lastSunlight: Date.now(),
        lastCared: Date.now(),
      },
      environmentalImpact: { carbonOffset: 0, oxygenProduced: 0, treesEquivalent: 0.01 },
      growthHistory: [{ stage: 0, timestamp: Date.now() }],
    };

    if (!isSupabaseConfigured || !user) {
      const localPlant = { ...newPlant, id: Date.now().toString() };
      setPlants((prev) => [...prev, localPlant]);
      return localPlant;
    }

    try {
      const { id, ...row } = plantToRow(newPlant, user.uid);
      const { data, error } = await supabase.from('plants').insert(row).select().single();
      if (error) throw error;
      const inserted = rowToPlant(data);
      setPlants((prev) => [...prev, inserted]);
      return inserted;
    } catch (error) {
      console.error('Failed to persist new plant:', error);
      const localPlant = { ...newPlant, id: Date.now().toString() };
      setPlants((prev) => [...prev, localPlant]);
      return localPlant;
    }
  };

  const METRIC_TIMESTAMP_KEYS = { water: 'lastWatered', sunlight: 'lastSunlight', care: 'lastCared' };

  const updatePlantHealth = async (plantId, metric, value) => {
    const timestampKey = METRIC_TIMESTAMP_KEYS[metric];
    let updatedPlant;
    const updatedPlants = plants.map((plant) => {
      if (plant.id === plantId) {
        updatedPlant = {
          ...plant,
          healthMetrics: {
            ...plant.healthMetrics,
            [metric]: Math.min(100, Math.max(0, value)),
            [timestampKey]: Date.now(),
          },
        };
        return updatedPlant;
      }
      return plant;
    });
    setPlants(updatedPlants);
    if (updatedPlant) await persistPlant(updatedPlant);
  };

  const addPlantPhoto = async (plantId, photoUri) => {
    let updatedPlant;
    const updatedPlants = plants.map((plant) => {
      if (plant.id === plantId) {
        const newPhoto = { uri: photoUri, timestamp: Date.now(), growthStage: plant.growthStage };
        updatedPlant = { ...plant, photos: [...(plant.photos || []), newPhoto] };
        return updatedPlant;
      }
      return plant;
    });
    setPlants(updatedPlants);
    if (updatedPlant) await persistPlant(updatedPlant);
  };

  const deletePlant = async (plantId) => {
    const updatedPlants = plants.filter((plant) => plant.id !== plantId);
    setPlants(updatedPlants);
    if (isSupabaseConfigured && user) {
      const { error } = await supabase.from('plants').delete().eq('id', plantId);
      if (error) console.error('Error deleting plant:', error);
    }
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

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};
