import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ImpactScreen from '../screens/ImpactScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AiScanScreen from '../screens/AiScanScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🌱',
  Impact: '🌍',
  Scan: '🔬',
  Profile: '👤',
};

function ScanButton({ onPress, theme }) {
  return (
    <Pressable onPress={onPress} style={styles.scanButtonWrap}>
      <View style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.scanIcon}>{TAB_ICONS.Scan}</Text>
      </View>
    </Pressable>
  );
}

function TabIcon({ label, focused, theme }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {TAB_ICONS[label]}
    </Text>
  );
}

function TabLabel({ label, focused, theme }) {
  return (
    <Text
      style={{
        fontSize: 11,
        color: focused ? theme.colors.primary : theme.colors.textMuted,
        fontWeight: focused ? '600' : '400',
      }}
    >
      {label}
    </Text>
  );
}

export default function AppTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.textInverse,
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} theme={theme} />
        ),
        tabBarLabel: ({ focused }) => (
          <TabLabel label={route.name} focused={focused} theme={theme} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Impact" component={ImpactScreen} options={{ title: 'Your Impact' }} />
      <Tab.Screen
        name="Scan"
        component={AiScanScreen}
        options={{
          title: 'AI Plant Scan',
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props) => <ScanButton {...props} theme={theme} />,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scanButtonWrap: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scanIcon: {
    fontSize: 26,
  },
});
