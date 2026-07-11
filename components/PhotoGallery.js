import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function PhotoGallery({ plant, onAddPhoto }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const photos = plant.photos || [];
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to add plant photos.'
      );
      return false;
    }
    return true;
  };

  const handleAddPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onAddPhoto(plant.id, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your camera to take plant photos.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onAddPhoto(plant.id, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showAddOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: handleTakePhoto },
        { text: 'Gallery', onPress: handleAddPhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getStageName = (stage) => {
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
    return stages[stage] || 'Unknown';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo Updates</Text>
        <TouchableOpacity style={styles.addButton} onPress={showAddOptions}>
          <Text style={styles.addButtonText}>+ Add Photo</Text>
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📷</Text>
          <Text style={styles.emptyText}>No photos yet</Text>
          <Text style={styles.emptySubtext}>
            Document your plant's growth journey
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={showAddOptions}>
            <Text style={styles.emptyButtonText}>Add First Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoCard}
              onPress={() => setSelectedPhoto(photo)}
            >
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={styles.photoInfo}>
                <Text style={styles.photoStage}>
                  Stage {photo.growthStage}: {getStageName(photo.growthStage)}
                </Text>
                <Text style={styles.photoDate}>
                  {formatDate(photo.timestamp)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setSelectedPhoto(null)}
          >
            {selectedPhoto && (
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.modalInfo}>
              <Text style={styles.modalStage}>
                {selectedPhoto && getStageName(selectedPhoto.growthStage)}
              </Text>
              <Text style={styles.modalDate}>
                {selectedPhoto && formatDate(selectedPhoto.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addButtonText: {
    color: theme.colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: theme.colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    marginHorizontal: -15,
  },
  photoCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.border,
  },
  photoInfo: {
    padding: 10,
  },
  photoStage: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  photoDate: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width * 0.9,
    height: width * 0.9,
  },
  modalInfo: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  modalStage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalDate: {
    color: '#fff',
    fontSize: 14,
  },
});

