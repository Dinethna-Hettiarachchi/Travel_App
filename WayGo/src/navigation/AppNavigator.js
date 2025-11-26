/**
 * App Navigator - Main Navigation Structure
 *
 * Implements the navigation requirements for Assignment 2:
 * - Stack Navigation (for screen hierarchies)
 * - Bottom Tab Navigation (Home, Favourites, Profile)
 * - Conditional rendering (Auth screens vs Main app)
 * - Session persistence (restore logged-in state)
 *
 * Navigation Flow:
 * 1. App loads -> Check for saved auth data
 * 2. If authenticated -> Show TabNavigator (Home/Favourites/Profile)
 * 3. If not authenticated -> Show AuthNavigator (Login/Register)
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../features/transport/screens/HomeScreen';
import BusStopDetailsScreen from '../features/transport/screens/BusStopDetailsScreen';
import FavouritesScreen from '../features/transport/screens/FavouritesScreen';
import ProfileScreen from '../features/transport/screens/ProfileScreen';
import SearchScreen from '../features/transport/screens/SearchScreen';
import { restoreSession, logout } from '../features/auth/redux/authSlice';
import { getAuthData } from '../utils/storage';
import colors from '../constants/colors';
import ErrorBoundary from '../components/ErrorBoundary';
import { hydrateTheme } from '../store/themeSlice';
import { loadFavorites } from '../features/transport/redux/transportSlice';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

/**
 * Home Stack Navigator
 * Handles the home tab's screen stack (Home -> Search -> Details)
 * Includes search icon in header for quick access
 */
const HomeStackScreen = () => (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Home',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              style={{ marginRight: 16, padding: 8 }}
              accessibilityLabel="Search bus stops"
              accessibilityRole="button"
            >
              <Feather name="search" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search Bus Stops' }}
      />
      <HomeStack.Screen
        name="BusStopDetails"
        component={BusStopDetailsScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Bus Stop',
        })}
      />
    </HomeStack.Navigator>
);

const TabNavigator = ({ username }) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 64 + Math.max(insets.bottom - 8, 0);

  return (
    <ErrorBoundary>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom, 10),
            height: tabBarHeight,
          },
          tabBarIcon: ({ color, size }) => {
            const iconMap = {
              Home: 'home',
              Favourites: 'star',
              Profile: 'user',
            };
            return <Feather name={iconMap[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Favourites" component={FavouritesScreen} options={{ title: 'Favourites' }} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: username ? `${username}` : 'Profile',
          }}
        />
      </Tab.Navigator>
    </ErrorBoundary>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, isReady: isThemeReady } = useSelector((state) => state.theme);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const saved = await getAuthData();
      if (saved?.token) {
        dispatch(restoreSession(saved));
      } else {
        dispatch(logout());
      }
      await dispatch(loadFavorites());
      await dispatch(hydrateTheme());
      setBootstrapped(true);
    };

    bootstrap();
  }, [dispatch]);

  if (!bootstrapped || !isThemeReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App">
            {() => <TabNavigator username={user?.username} />}
          </RootStack.Screen>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;

