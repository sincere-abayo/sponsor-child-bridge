import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../../store/actions/authActions';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MainLayout from '../../components/layout/MainLayout';
import Spinner from '../../components/common/Spinner';

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(state => state.auth);
  
  const initialValues = {
    password: '',
    confirmPassword: ''
  };
  
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });
  
  const handleSubmit = (values) => {
    dispatch(resetPassword(token, values.password))
      .then(() => {
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      });
  };
  
  return (
    <MainLayout>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card
            title="Reset Password"
            subtitle="Create a new password for your account"
          >
            {success ? (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  Your password has been reset successfully.
                </div>
                <p className="mb-4 text-gray-600">
                  You will be redirected to the login page in a few seconds.
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
                      label="New Password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password}
                      touched={touched.password}
                      required
                      helpText="Password must be at least 8 characters"
                    />
                    
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
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
                      Reset Password
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;