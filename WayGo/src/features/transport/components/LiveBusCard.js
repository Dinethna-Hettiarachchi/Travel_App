import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { cardStyles, spacing, typography } from '../../../styles/globalStyles';

// Fixed: Added null safety checks for bus status - v2
const LiveBusCard = ({ bus }) => {
  const colors = useThemeColors();

  // Safe status color with null check
  const getStatusColor = (statusValue) => {
    if (!statusValue || typeof statusValue !== 'string') {
      return colors.secondary;
    }
    const lower = statusValue.toLowerCase();
    if (lower.includes('delay') || lower.includes('cancelled')) {
      return colors.error;
    }
    if (lower.includes('on time')) {
      return colors.success;
    }
    return colors.secondary;
  };

  // Safe status icon with null check
  const getStatusIcon = (statusValue) => {
    if (!statusValue || typeof statusValue !== 'string') {
      return 'info';
    }
    const lower = statusValue.toLowerCase();
    if (lower.includes('delay') || lower.includes('cancelled')) {
      return 'alert-triangle';
    }
    if (lower.includes('on time')) {
      return 'check-circle';
    }
    return 'info';
  };

  // Handle complex nested status object from API
  let statusValue = bus?.status;

  // Deep extraction of status from nested objects
  if (statusValue && typeof statusValue === 'object') {
    // Try to extract string from nested structure
    if (statusValue.cancellation) {
      if (typeof statusValue.cancellation === 'object') {
        statusValue = statusValue.cancellation.reason || statusValue.cancellation.value || 'On Time';
      } else {
        statusValue = statusValue.cancellation;
      }
    } else if (statusValue.value) {
      statusValue = statusValue.value;
    } else if (statusValue.reason) {
      statusValue = statusValue.reason;
    } else {
      statusValue = 'On Time';
    }
  }

  // Ensure it's a string
  if (typeof statusValue !== 'string') {
    statusValue = 'On Time';
  }

  const color = getStatusColor(statusValue);
  const statusText = statusValue || 'On Time';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={styles.busLineWrapper}>
        <View style={[styles.busIcon, { backgroundColor: `${colors.primary}15` }]}>
          <Feather name="navigation" size={18} color={colors.primary} />
        </View>
        <View style={[styles.busLineNumber, { backgroundColor: colors.primary }]}>
          <Text style={[styles.lineText, { color: colors.textOnPrimary }]}>Line</Text>
          <Text style={[styles.lineNumber, { color: colors.textOnPrimary }]}>{bus?.line || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.destinationRow}>
          <Feather name="map-pin" size={14} color={colors.textSecondary} />
          <Text style={[styles.destination, { color: colors.textPrimary }]} numberOfLines={2}>
            {bus?.destination || 'Unknown Destination'}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={[styles.timeContainer, { backgroundColor: `${colors.primary}10` }]}>
            <Feather name="clock" size={14} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.primary }]}>{bus?.expected || 'Due'}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: `${color}15` }]}>
            <Feather name={getStatusIcon(statusValue)} size={12} color={color} />
            <Text style={[styles.statusText, { color }]}>{statusText}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...cardStyles.base,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  busLineWrapper: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  busIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs - 2,
  },
  busLineNumber: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 44,
  },
  lineText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  lineNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: 6,
  },
  destination: {
    ...typography.h2,
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default LiveBusCard;
