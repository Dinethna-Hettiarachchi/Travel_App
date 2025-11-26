import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  username: Yup.string().trim().required('Username is required'),
  password: Yup.string().min(4, 'Password is too short').required('Password is required'),
});

export const registerValidationSchema = Yup.object().shape({
  username: Yup.string().trim().min(3, 'Min 3 characters').required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

