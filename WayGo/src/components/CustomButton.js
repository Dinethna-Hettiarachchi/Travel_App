import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

/**
 * Basic button wrapper so screens can share a consistent look.
 */
const CustomButton = ({ title, onPress, disabled, loading, style, textStyle }) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: colors.primary },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnPrimary} />
      ) : (
        <Text style={[styles.label, { color: colors.textOnPrimary }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CustomButton;

