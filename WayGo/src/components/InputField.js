import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

/**
 * Controlled text input with label and helper text slots.
 */
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType = 'default',
  error,
  onBlur,
}) => {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onBlur={onBlur}
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary,
            backgroundColor: colors.card,
          },
        ]}
        placeholderTextColor={colors.muted}
      />
      {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default InputField;

