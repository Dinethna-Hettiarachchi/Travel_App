/**
 * Root Layout - Main Entry Point for WayGo Travel App
 *
 * This is the root component that wraps the entire application with necessary providers:
 * - Redux Provider: For global state management
 * - SafeAreaProvider: For handling device safe areas (notches, home indicators)
 * - NavigationIndependentTree: For Expo Router compatibility with React Navigation
 *
 * Assignment: IN3210 Mobile Applications Development - Assignment 2
 * Student: [Your Name & Index Number]
 * App: WayGo - Travel & Transport App (Domain: Last Digit 3,8)
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationIndependentTree } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import store from '../src/store/store';

// Import required for gesture handling (tab navigation, drawers)
import 'react-native-gesture-handler';
// Import required for animations (loading states, transitions)
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationIndependentTree>
          <AppNavigator />
        </NavigationIndependentTree>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </Provider>
  );
}
