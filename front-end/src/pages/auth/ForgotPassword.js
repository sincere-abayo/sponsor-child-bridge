import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { forgotPassword } from '../../store/actions/authActions';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MainLayout from '../../components/layout/MainLayout';
import Spinner from '../../components/common/Spinner';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [emailSent, setEmailSent] = useState(false);
  
  const initialValues = {
    email: ''
  };
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });
  
  const handleSubmit = (values) => {
    dispatch(forgotPassword(values.email))
      .then(() => {
        setEmailSent(true);
      });
  };
  
  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card
            title="Forgot Password"
            subtitle="Enter your email address and we'll send you a link to reset your password"
          >
            {emailSent ? (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  Password reset link has been sent to your email address.
                </div>
                <p className="mb-4 text-gray-600">
                  Please check your email and follow the instructions to reset your password.
                </p>
                <Link to="/login">
                  <Button variant="primary" fullWidth>
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
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
                      Send Reset Link
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Back to login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
