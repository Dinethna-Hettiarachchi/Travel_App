import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import LiveBusCard from '../components/LiveBusCard';
import { useThemeColors } from '../../../hooks/useThemeColors';
import globalStyles, { spacing, typography } from '../../../styles/globalStyles';
import { fetchBusStopDetails, toggleFavoriteStop } from '../redux/transportSlice';
import CustomButton from '../../../components/CustomButton';

const BusStopDetailsScreen = ({ route }) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const { liveDepartures, loading, error, selectedStop, favorites } = useSelector((state) => state.transport);
  const stop = selectedStop || route.params;
  const isFavorite = favorites.some((item) => item.atcocode === stop.atcocode);

  useEffect(() => {
    dispatch(fetchBusStopDetails(stop.atcocode));
  }, [dispatch, stop.atcocode]);

  const toggleFavorite = () => {
    dispatch(
      toggleFavoriteStop({
        atcocode: stop.atcocode,
        name: stop.name,
        distance: stop.distance || 0,
      })
    );
  };

  return (
    <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="map-pin" size={28} color={colors.primary} />
          <Text style={[typography.h1, styles.title, { color: colors.textPrimary }]}>{stop.name}</Text>
        </View>
        <Text style={[typography.subtitle, { color: colors.textSecondary }]}>{stop.locality || 'London Area'}</Text>
        <CustomButton
          title={isFavorite ? 'Remove favourite' : 'Save to favourites'}
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.subtitle, { color: colors.textSecondary }]}>Fetching live departures...</Text>
        </View>
      ) : error ? (
        <View style={styles.error}>
          <Feather name="alert-triangle" size={24} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={liveDepartures}
          keyExtractor={(item, index) => `${item.line}-${index}`}
          renderItem={({ item }) => <LiveBusCard bus={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[typography.subtitle, { color: colors.textSecondary }]}>No live departures right now. Please check back soon.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
  favoriteButton: {
    marginTop: spacing.md,
  },
  loader: {
    ...globalStyles.centered,
    gap: spacing.sm,
  },
  error: {
    ...globalStyles.centered,
    gap: spacing.sm,
  },
  errorText: {
  },
  list: {
    paddingBottom: spacing.xl,
  },
});

export default BusStopDetailsScreen;

