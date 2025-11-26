import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import BusStopCard from '../components/BusStopCard';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { fetchBusStops, setSelectedStop } from '../redux/transportSlice';
import CustomButton from '../../../components/CustomButton';
import globalStyles, { spacing, typography } from '../../../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const { busStops, loading, error, favorites } = useSelector((state) => state.transport);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = useCallback(async () => {
    setPermissionDenied(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      setPermissionDenied(true);
      return;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    dispatch(
      fetchBusStops({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const onRefresh = () => {
    requestLocation();
  };

  const handlePressStop = (stop) => {
    dispatch(setSelectedStop(stop));
    navigation.navigate('BusStopDetails', {
      atcocode: stop.atcocode,
      name: stop.name,
    });
  };

  const renderHeader = () => (
    <View>
      <Text style={[typography.h1, { color: colors.textPrimary }]}>Nearby bus stops</Text>
      <Text style={[typography.subtitle, styles.subtitle, { color: colors.textSecondary }]}>
        Powered by TransportAPI UK with graceful fallbacks.
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Feather name="alert-circle" size={28} color={colors.muted} />
      <Text style={[typography.subtitle, { color: colors.textSecondary }]}>
        {permissionDenied
          ? 'Location permission is required to find bus stops.'
          : 'No bus stops available yet. Pull to refresh.'}
      </Text>
      <CustomButton title="Retry" onPress={requestLocation} style={styles.retry} />
    </View>
  );

  return (
    <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
      {renderHeader()}
      <FlatList
        data={busStops}
        keyExtractor={(item) => item.atcocode}
        renderItem={({ item }) => (
          <BusStopCard
            stop={item}
            onPress={handlePressStop}
            onFavoriteToggle={null}
            isFavorite={favorites.some((fav) => fav.atcocode === item.atcocode)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} />}
      />
      {error ? (
        <View style={[styles.errorBanner, { backgroundColor: `${colors.error}15` }]}>
          <Feather name="info" size={16} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingVertical: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  retry: {
    marginTop: spacing.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 12,
    marginVertical: spacing.md,
  },
  errorText: {
    marginLeft: spacing.xs,
  },
});

export default HomeScreen;

