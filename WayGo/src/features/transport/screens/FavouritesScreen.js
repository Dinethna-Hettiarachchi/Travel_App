import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BusStopCard from '../components/BusStopCard';
import { useThemeColors } from '../../../hooks/useThemeColors';
import globalStyles, { spacing, typography } from '../../../styles/globalStyles';
import { loadFavorites, toggleFavoriteStop, setSelectedStop } from '../redux/transportSlice';

const FavouritesScreen = ({ navigation }) => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.transport);

  useEffect(() => {
    if (!favorites.length) {
      dispatch(loadFavorites());
    }
  }, [dispatch, favorites.length]);

  const handlePress = (stop) => {
    dispatch(setSelectedStop(stop));
    navigation.navigate('Home', {
      screen: 'BusStopDetails',
      params: {
        atcocode: stop.atcocode,
        name: stop.name,
      },
    });
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={[typography.subtitle, { color: colors.textSecondary }]}>No favourites yet. Save a bus stop to see it here.</Text>
    </View>
  );

  return (
    <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
      <Text style={[typography.h1, { color: colors.textPrimary }]}>Favourites</Text>
      <Text style={[typography.subtitle, styles.subtitle, { color: colors.textSecondary }]}>Quick access to your saved bus stops.</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.atcocode}
        renderItem={({ item }) => (
          <BusStopCard
            stop={item}
            onPress={handlePress}
            onFavoriteToggle={(stopToToggle) => dispatch(toggleFavoriteStop(stopToToggle))}
            isFavorite
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    marginBottom: spacing.lg,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
});

export default FavouritesScreen;

