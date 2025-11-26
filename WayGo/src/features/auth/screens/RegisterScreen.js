import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { register } from '../redux/authSlice';
import { registerValidationSchema } from '../../../utils/validators';

const RegisterScreen = () => {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  }, [user, navigation]);

  const handleSubmit = (values) => {
    dispatch(register(values));
  };

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Register to start planning trips</Text>

        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit: submitForm, values, errors, touched }) => (
            <>
              <InputField
                label="Username"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                placeholder="Choose a username"
                error={touched.username && errors.username}
              />

              <InputField
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Create a password"
                secureTextEntry
                error={touched.password && errors.password}
              />

              <InputField
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder="Repeat your password"
                secureTextEntry
                error={touched.confirmPassword && errors.confirmPassword}
              />

              {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

              <CustomButton title="Register" onPress={submitForm} loading={loading} />
            </>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.link, { color: colors.primary }]}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  error: {
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    marginRight: 6,
  },
  link: {
    fontWeight: '600',
  },
});

export default RegisterScreen;

