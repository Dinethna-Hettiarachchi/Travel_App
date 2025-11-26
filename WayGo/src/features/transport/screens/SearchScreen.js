import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { setSelectedStop } from '../redux/transportSlice';
import BusStopCard from '../components/BusStopCard';
import globalStyles, { spacing, typography } from '../../../styles/globalStyles';

const SearchScreen = () => {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { busStops, favorites } = useSelector((state) => state.transport);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStops = busStops.filter(
    (stop) =>
      stop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.atcocode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePressStop = (stop) => {
    dispatch(setSelectedStop(stop));
    navigation.navigate('BusStopDetails', {
      atcocode: stop.atcocode,
      name: stop.name,
    });
  };

  return (
    <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search bus stops..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="search" size={48} color={colors.muted} />
          <Text style={[typography.subtitle, styles.emptyText, { color: colors.textSecondary }]}>
            Enter a bus stop name or code to search
          </Text>
        </View>
      ) : filteredStops.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="alert-circle" size={48} color={colors.muted} />
          <Text style={[typography.subtitle, styles.emptyText, { color: colors.textSecondary }]}>No results found</Text>
          <Text style={[typography.body, styles.emptySubtext, { color: colors.muted }]}>
            Try searching with a different term
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStops}
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
          ListHeaderComponent={
            <Text style={[typography.body, styles.resultCount, { color: colors.textSecondary }]}>
              {filteredStops.length} result{filteredStops.length !== 1 ? 's' : ''} found
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  resultCount: {
    marginBottom: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default SearchScreen;


