import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { login } from '../../store/actions/authActions';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MainLayout from '../../components/layout/MainLayout';
import Spinner from '../../components/common/Spinner';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Redirect if already authenticated
    console.log('Checking authentication status', isAuthenticated);

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const initialValues = {
    email: '',
    password: ''
  };
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });
  
  const handleSubmit = (values) => {
    dispatch(login(values.email, values.password, navigate));
  };
  
  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card
            title="Sign In"
            subtitle="Enter your credentials to access your account"
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
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
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    required
                  />
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Sign In
                  </Button>
                </Form>
              )}
            </Formik>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;