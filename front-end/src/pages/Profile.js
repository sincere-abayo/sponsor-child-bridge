import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getProfile, updateProfile, uploadProfileImage } from '../store/actions/profileActions';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { setAlert } from '../store/actions/alertActions';
import { FaCamera, FaUser, FaIdCard, FaPhone, FaMapMarkerAlt, FaBuilding, FaGraduationCap, FaUserFriends } from 'react-icons/fa';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, loading } = useSelector(state => state.profile);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  console.log('Profile component rendered with user:', user, 'profile:', profile);
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Log file details for debugging
      console.log('Selected file:', file.name, file.type, file.size);
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
const handleImageUpload = async () => {
  if (imageFile) {
    // Validate file type
    if (!imageFile.type.match(/^image\/(jpeg|png|gif|jpg)$/)) {
      dispatch(setAlert('Only image files (JPEG, PNG, GIF) are allowed', 'error'));
      return;
    }
    
    // Validate file size
    if (imageFile.size > 5 * 1024 * 1024) {
      dispatch(setAlert('File size should not exceed 5MB', 'error'));
      return;
    }
    
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    try {
      await dispatch(uploadProfileImage(formData));
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadLoading(false);
    }
  }
};

  
  
  
  const initialValues = {
    // Common fields
    phone_number: profile?.phone_number || '',
    bio: profile?.bio || '',
    
    // Sponsor specific fields
    organization: profile?.organization || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || '',
    preferred_contact_method: profile?.preferred_contact_method || 'email',
    
    // Receiver specific fields
    date_of_birth: profile?.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
    guardian_name: profile?.guardian_name || '',
    guardian_contact: profile?.guardian_contact || '',
    school_name: profile?.school_name || '',
    grade: profile?.grade || '',
    interests: profile?.interests || '',
    needs: profile?.needs || ''
  };
  
  const validationSchema = Yup.object({
    phone_number: Yup.string().required('Phone number is required'),
    bio: Yup.string().max(500, 'Bio should not exceed 500 characters'),
    
    // Conditional validation based on user role
    ...(user?.role === 'sponsor' && {
      organization: Yup.string(),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      country: Yup.string().required('Country is required'),
      preferred_contact_method: Yup.string().required('Preferred contact method is required')
    }),
    
    ...(user?.role === 'receiver' && {
      date_of_birth: Yup.date().required('Date of birth is required').max(new Date(), 'Date of birth cannot be in the future'),
      guardian_name: Yup.string().required('Guardian name is required'),
      guardian_contact: Yup.string().required('Guardian contact is required'),
      school_name: Yup.string().required('School name is required'),
      grade: Yup.string().required('Grade is required'),
      interests: Yup.string(),
      needs: Yup.string()
    })
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(updateProfile(values))
      .then(() => {
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };
  
  if (loading && !profile) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="mt-1 text-blue-100">
              Manage your personal information and account settings
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'personal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'account'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account Settings
          </button>
          {user?.role === 'receiver' && (
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'education'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('education')}
            >
              Education & Needs
            </button>
          )}
        </nav>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
              {!user?.role === 'admin' &&(
          <Card title="Profile Picture" titleIcon={<FaUser className="mr-2 text-blue-500" />}>
            <div className="flex flex-col items-center">
                <div className="w-32 h-32 mb-4 relative">
                <img
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow"
                  src={imagePreview || profile?.profile_image || 'https://via.placeholder.com/128'}
                  alt="Profile"
                />
                <label
                  htmlFor="profile_image"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition duration-200"
                >
                  <FaCamera className="h-4 w-4" />
                </label>
              </div>
              
              <div className="flex flex-col w-full">
                <input
                  type="file"
                  id="profile_image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                
                <p className="text-sm text-gray-500 text-center mb-4">
                  Click on the camera icon to upload a new profile picture.<br />
                  Maximum file size: 5MB
                </p>
                
                {imageFile && (
                  <Button
                    type="button"
                    variant="success"
                    onClick={handleImageUpload}
                    disabled={uploadLoading}
                    className="mt-2"
                  >
                    {uploadLoading ? <Spinner size="sm" className="mr-2" /> : null}
                    Upload Image
                  </Button>
                )}
              </div>
            </div>
          </Card>
              ) }
          
          <Card title="Account Information" titleIcon={<FaIdCard className="mr-2 text-blue-500" />} className="mt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Name:</span>
                <span className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Role:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Member Since:</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                {activeTab === 'personal' && (
                  <Card title="Personal Information" titleIcon={<FaUser className="mr-2 text-blue-500" />}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Phone Number"
                          name="phone_number"
                          placeholder="Enter your phone number"
                          value={values.phone_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.phone_number}
                          touched={touched.phone_number}
                          icon={<FaPhone className="text-gray-400" />}
                          required
                        />
                        
                        {user?.role === 'sponsor' && (
                          <Input
                            label="Organization (Optional)"
                            name="organization"
                            placeholder="Enter your organization name"
                            value={values.organization}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.organization}
                            touched={touched.organization}
                            icon={<FaBuilding className="text-gray-400" />}
                          />
                        )}
                      </div>
                      
                      <Textarea
                        label="Bio"
                        name="bio"
                        placeholder="Tell us about yourself"
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.bio}
                        touched={touched.bio}
                        rows={4}
                        helpText={`${values.bio.length}/500 characters`}
                      />
                      
                      {user?.role === 'sponsor' && (
                        <>
                          <Input
                            label="Address"
                            name="address"
                            placeholder="Enter your address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.address}
                            touched={touched.address}
                            icon={<FaMapMarkerAlt className="text-gray-400" />}
                            required
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="City"
                              name="city"
                              placeholder="Enter your city"
                              value={values.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.city}
                              touched={touched.city}
                              required
                            />
                            
                            <Input
                              label="Country"
                              name="country"
                              placeholder="Enter your country"
                              value={values.country}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.country}
                              touched={touched.country}
                              required
                            />
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preferred Contact Method
                            </label>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center">
                                <input
                                  id="contact-email"
                                  name="preferred_contact_method"
                                  type="radio"
                                  value="email"
                                  checked={values.preferred_contact_method === 'email'}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="contact-email" className="ml-3 block text-sm text-gray-700">
                                  Email
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="contact-phone"
                                  name="preferred_contact_method"
                                  type="radio"
                                  value="phone"
                                  checked={values.preferred_contact_method === 'phone'}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="contact-phone" className="ml-3 block text-sm text-gray-700">
                                  Phone
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="contact-both"
                                  name="preferred_contact_method"
                                  type="radio"
                                  value="both"
                                  checked={values.preferred_contact_method === 'both'}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="contact-both" className="ml-3 block text-sm text-gray-700">
                                  Both Email and Phone
                                </label>
                              </div>
                            </div>
                            {errors.preferred_contact_method && touched.preferred_contact_method && (
                              <p className="mt-1 text-sm text-red-600">{errors.preferred_contact_method}</p>
                            )}
                          </div>
                        </>
                      )}
                      
                      {user?.role === 'receiver' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Date of Birth"
                              name="date_of_birth"
                              type="date"
                              value={values.date_of_birth}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.date_of_birth}
                              touched={touched.date_of_birth}
                              required
                            />
                            
                            <Input
                              label="Guardian Name"
                              name="guardian_name"
                              placeholder="Enter guardian's name"
                              value={values.guardian_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.guardian_name}
                              touched={touched.guardian_name}
                              icon={<FaUserFriends className="text-gray-400" />}
                              required
                            />
                          </div>
                          
                          <Input
                            label="Guardian Contact"
                            name="guardian_contact"
                            placeholder="Enter guardian's contact"
                            value={values.guardian_contact}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.guardian_contact}
                            touched={touched.guardian_contact}
                            icon={<FaPhone className="text-gray-400" />}
                            required
                          />
                        </>
                      )}
                    </div>
                  </Card>
                )}
                
                {activeTab === 'account' && (
                  <Card title="Account Settings" titleIcon={<FaIdCard className="mr-2 text-blue-500" />}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Manage how you receive email notifications
                        </p>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="notifications-sponsorships"
                                name="notifications_sponsorships"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="notifications-sponsorships" className="font-medium text-gray-700">
                                Sponsorship updates
                              </label>
                              <p className="text-gray-500">
                                Get notified when a sponsorship is created, updated, or completed.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="notifications-messages"
                                name="notifications_messages"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="notifications-messages" className="font-medium text-gray-700">
                                Messages
                              </label>
                              <p className="text-gray-500">
                                Get notified when you receive a new message.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="notifications-marketing"
                                name="notifications_marketing"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="notifications-marketing" className="font-medium text-gray-700">
                                Marketing
                              </label>
                              <p className="text-gray-500">
                                Receive emails about new features, success stories, and platform updates.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Manage your privacy preferences
                        </p>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="privacy-profile"
                                name="privacy_profile"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="privacy-profile" className="font-medium text-gray-700">
                                Public profile
                              </label>
                              <p className="text-gray-500">
                                Allow your profile to be visible to other users on the platform.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="privacy-contact"
                                name="privacy_contact"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="privacy-contact" className="font-medium text-gray-700">
                                Show contact information
                              </label>
                              <p className="text-gray-500">
                                Allow your contact information to be visible to connected users.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Security</h3>
                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="light"
                            onClick={() => window.location.href = '/change-password'}
                          >
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {activeTab === 'education' && user?.role === 'receiver' && (
                  <Card title="Education & Needs" titleIcon={<FaGraduationCap className="mr-2 text-blue-500" />}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="School Name"
                          name="school_name"
                          placeholder="Enter school name"
                          value={values.school_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.school_name}
                          touched={touched.school_name}
                          icon={<FaGraduationCap className="text-gray-400" />}
                          required
                        />
                        
                        <Input
                          label="Grade/Class"
                          name="grade"
                          placeholder="Enter grade or class"
                          value={values.grade}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.grade}
                          touched={touched.grade}
                          required
                        />
                      </div>
                      
                      <Textarea
                        label="Interests"
                        name="interests"
                        placeholder="What are your interests, hobbies, or activities you enjoy?"
                        value={values.interests}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.interests}
                        touched={touched.interests}
                        rows={3}
                      />
                      
                      <Textarea
                        label="Needs"
                        name="needs"
                        placeholder="Describe what kind of support you need (educational materials, school fees, etc.)"
                        value={values.needs}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.needs}
                        touched={touched.needs}
                        rows={3}
                      />
                    </div>
                  </Card>
                )}
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || loading}
                    className="w-full"
                  >
                    {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
