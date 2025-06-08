import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { register } from '../../store/actions/authActions';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MainLayout from '../../components/layout/MainLayout';
import Spinner from '../../components/common/Spinner';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };
  
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('First name is required'),
    lastName: Yup.string()
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string()
      .required('Please select a role')
  });
  
  const handleSubmit = (values) => {
    const userData = {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role
    };
    
    dispatch(register(userData, navigate));
  };
  
  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card
            title="Create an Account"
            subtitle="Fill in your details to create your account"
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.firstName}
                      touched={touched.firstName}
                      required
                    />
                    
                    <Input
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.lastName}
                      touched={touched.lastName}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                    required
                  />
                  
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    required
                    helpText="Password must be at least 8 characters"
                  />
                  
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    required
                  />
                  
                  <Select
                    label="I am registering as a"
                    name="role"
                    options={[
                      { value: 'sponsor', label: 'Sponsor' },
                      { value: 'receiver', label: 'Receiver' }
                    ]}
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.role}
                    touched={touched.role}
                    required
                  />
                  
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    className="mt-4"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Register
                  </Button>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}
                </Form>
              )}
            </Formik>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
