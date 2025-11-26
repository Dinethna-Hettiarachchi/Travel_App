import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../../components/CustomButton';
import InputField from '../../../components/InputField';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { login } from '../redux/authSlice';
import { loginValidationSchema } from '../../../utils/validators';

const LoginScreen = () => {
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
    dispatch(login(values));
  };

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={styles.iconEmoji}>🚌</Text>
            </View>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>WayGo</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue your journey</Text>
        </View>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit: submitForm, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <InputField
                label="Username"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                placeholder="Enter your username"
                error={touched.username && errors.username}
              />

              <InputField
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Enter your password"
                secureTextEntry
                error={touched.password && errors.password}
              />

              {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

              <CustomButton title="Login" onPress={submitForm} loading={loading} style={styles.loginButton} />

              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              <CustomButton
                title="Demo Login"
                onPress={() => {
                  handleChange('username')('emilys');
                  handleChange('password')('emilyspass');
                  setTimeout(() => submitForm(), 100);
                }}
                style={[styles.demoButton, { backgroundColor: colors.secondary }]}
              />
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>New to WayGo?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.link, { color: colors.primary }]}>Create an account</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  demoButton: {
    marginTop: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  error: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginRight: 6,
    fontSize: 15,
  },
  link: {
    fontWeight: '700',
    fontSize: 15,
  },
});

export default LoginScreen;

