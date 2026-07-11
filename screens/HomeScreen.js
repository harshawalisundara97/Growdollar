import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlants } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PlantCard from '../components/PlantCard';

export default function HomeScreen({ navigation }) {
  const { plants, isLoading } = usePlants();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const fabPulse = useSharedValue(1);
  const emptyAnim = useSharedValue(0);

  useEffect(() => {
    fabPulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    if (!isLoading && plants.length === 0) {
      emptyAnim.value = withSpring(1, { damping: 12, stiffness: 80 });
    }
  }, [isLoading, plants.length]);

  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabPulse.value }],
  }));

  const emptyAnimStyle = useAnimatedStyle(() => ({
    opacity: emptyAnim.value,
    transform: [{ translateY: (1 - emptyAnim.value) * 30 }],
  }));

  const handleFabPress = () => {
    fabPulse.value = withSpring(0.85, { damping: 5 }, () => {
      fabPulse.value = withRepeat(
        withSequence(withTiming(1.1, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        false
      );
    });
    navigation.navigate('Purchase');
  };

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Logout Failed', 'Please try again.');
            }
          },
        },
      ]
    );
  }, [logout]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      ),
      headerTitle: user?.name
        ? `Welcome, ${user.name.split(' ')[0]}! 🌱`
        : 'My Plants 🌱',
      headerBackground: () => (
        <LinearGradient
          colors={theme.mode === 'dark' ? [theme.colors.primaryDark, theme.colors.primary] : ['#388E3C', '#4CAF50']}
          start={[0, 0]}
          end={[1, 0]}
          style={StyleSheet.absoluteFill}
        />
      ),
    });
  }, [user, navigation, handleLogout, theme]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {plants.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, emptyAnimStyle]}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyText}>No plants yet!</Text>
          <Text style={styles.emptySubtext}>Start growing your garden</Text>
          <Pressable
            style={styles.buyButton}
            onPress={() => navigation.navigate('Purchase')}
          >
            <Text style={styles.buyButtonText}>Buy Your First Plant ($1)</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <>
          <FlatList
            data={plants}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <PlantCard plant={item} navigation={navigation} animIndex={index} />
            )}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
          <Animated.View style={[styles.fabWrapper, fabAnimStyle]}>
            <TouchableOpacity
              style={styles.fab}
              onPress={handleFabPress}
            >
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 30,
  },
  buyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buyButtonText: {
    color: theme.colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fabWrapper: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: theme.colors.textInverse,
    fontSize: 30,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginRight: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButtonText: {
    color: theme.colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
});
