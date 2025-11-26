import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import globalStyles, { spacing, typography } from '../../../styles/globalStyles';
import { useThemeColors } from '../../../hooks/useThemeColors';
import CustomButton from '../../../components/CustomButton';
import { performLogout } from '../../auth/redux/authSlice';
import { toggleTheme } from '../../../store/themeSlice';

const ProfileScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const { width } = useWindowDimensions();

  return (
    <View style={[globalStyles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { width: width - spacing.lg * 2, backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={[styles.avatar, { backgroundColor: colors.background }]}>
          <Feather name="user" size={28} color={colors.primary} />
        </View>
        <View style={styles.details}>
          <Text style={[typography.h2, { color: colors.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
            {user?.username || 'Traveler'}
          </Text>
          <Text style={[typography.subtitle, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
            {user?.email || 'No email on file'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Text style={[typography.h2, { color: colors.textPrimary }]}>Preferences</Text>
        <CustomButton
          title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
          onPress={() => dispatch(toggleTheme())}
          style={[styles.button, { backgroundColor: colors.secondary }]}
        />
        <CustomButton title="Logout" onPress={() => dispatch(performLogout())} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 18,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    marginLeft: spacing.md,
    flex: 1,
  },
  actions: {
    gap: spacing.md,
  },
  button: {
  },
});

export default ProfileScreen;

