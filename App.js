import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import PurchaseScreen from './screens/PurchaseScreen';
import PlantDetailScreen from './screens/PlantDetailScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AppTabs from './navigation/AppTabs';
import { PlantProvider } from './context/PlantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Purchase"
        component={PurchaseScreen}
        options={{ title: 'Buy a Plant', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="PlantDetail"
        component={PlantDetailScreen}
        options={{ title: 'Plant Details' }}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

const ThemedNavigationContainer = ({ children }) => {
  const { mode, theme } = useTheme();
  const navTheme = mode === 'dark'
    ? {
        ...DarkTheme,
        colors: { ...DarkTheme.colors, primary: theme.colors.primary, background: theme.colors.background, card: theme.colors.surface, text: theme.colors.text, border: theme.colors.border },
      }
    : {
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, primary: theme.colors.primary, background: theme.colors.background, card: theme.colors.surface, text: theme.colors.text, border: theme.colors.border },
      };

  return <NavigationContainer theme={navTheme}>{children}</NavigationContainer>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlantProvider>
          <SafeAreaProvider>
            <ThemedNavigationContainer>
              <RootNavigator />
            </ThemedNavigationContainer>
          </SafeAreaProvider>
        </PlantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
