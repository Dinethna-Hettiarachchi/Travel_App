import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { cardStyles, spacing, typography } from '../../../styles/globalStyles';

const BusStopCard = ({ stop, onPress, onFavoriteToggle, isFavorite = false }) => {
  const colors = useThemeColors();

  // Format distance display
  const distance = Math.round(stop?.distance);
  const distanceText = distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(1)} km`;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]}
      activeOpacity={0.7}
      onPress={() => onPress?.(stop)}
    >
      <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}15` }]}>
        <Feather name="map-pin" size={26} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[typography.h2, { color: colors.textPrimary, flex: 1, paddingRight: spacing.xs }]} numberOfLines={2} ellipsizeMode="tail">
            {stop?.name}
          </Text>
          {onFavoriteToggle && (
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                {
                  backgroundColor: isFavorite ? `${colors.secondary}20` : `${colors.muted}15`,
                  borderRadius: 8,
                }
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onFavoriteToggle(stop);
              }}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Feather
                name="star"
                size={20}
                color={isFavorite ? colors.secondary : colors.muted}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.distanceBadge, { backgroundColor: `${colors.primary}10` }]}>
            <Feather name="navigation" size={12} color={colors.primary} />
            <Text style={[styles.distanceText, { color: colors.primary }]}>{distanceText} away</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: `${colors.success}10` }]}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.success }]}>Active</Text>
          </View>
        </View>

        {stop?.indicator && (
          <Text style={[styles.indicatorText, { color: colors.muted }]}>Stop {stop.indicator}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...cardStyles.base,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingVertical: spacing.md + 2,
    paddingRight: spacing.md + 4,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  favoriteButton: {
    padding: 6,
    marginLeft: spacing.sm,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  indicatorText: {
    fontSize: 12,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});

export default BusStopCard;

