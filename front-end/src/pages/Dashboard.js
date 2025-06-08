import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile } from '../store/actions/profileActions';
import { getSponshorships } from '../store/actions/sponsorshipActions';
import { FaUserCircle, FaChartLine, FaUsers, FaMoneyBillWave, FaClipboardList, FaBell, FaEnvelope } from 'react-icons/fa';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { format } from 'date-fns';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, loading: profileLoading } = useSelector(state => state.profile);
  const { sponsorships, loading: sponsorshipsLoading } = useSelector(state => state.sponsorships);
  const { unreadCount: unreadMessagesCount } = useSelector(state => state.messages);
  const { unreadCount: unreadNotificationsCount } = useSelector(state => state.notifications);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    dispatch(getProfile());
    dispatch(getSponshorships());
  }, [dispatch]);
  
  if (profileLoading || sponsorshipsLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Calculate total amount for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthSponsorships = sponsorships?.filter(s => {
    const date = new Date(s.created_at);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }) || [];
  
  const currentMonthAmount = currentMonthSponsorships.reduce((total, s) => total + (s.amount || 0), 0);
  
  // Get recent activity (combine sponsorships, sorted by date)
  const recentActivity = [...(sponsorships || [])].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  ).slice(0, 5);
  
  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.first_name}!</h1>
            <p className="mt-1 text-blue-100">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link to="/messages">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-700">
                <FaEnvelope className="mr-2" />
                Messages
                {unreadMessagesCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-700">
                <FaBell className="mr-2" />
                Alerts
                {unreadNotificationsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sponsorships'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('sponsorships')}
          >
            Sponsorships
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </nav>
      </div>
      
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-4">
                  <FaUsers className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Sponsorships</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {sponsorships?.filter(s => s.status === 'active').length || 0}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/sponsorships" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all sponsorships →
                </Link>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white mr-4">
                  <FaMoneyBillWave className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${sponsorships?.reduce((total, s) => total + (s.amount || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-green-600 text-sm font-medium">
                  ${currentMonthAmount.toFixed(2)} this month
                </p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white mr-4">
                  <FaClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {sponsorships?.filter(s => s.status === 'pending').length || 0}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/requests" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  Manage requests →
                </Link>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Sponsorships */}
            <div className="lg:col-span-2">
              <Card
                title="Recent Sponsorships"
                titleClass="text-xl font-bold text-gray-800 flex items-center"
                titleIcon={<FaChartLine className="mr-2 text-blue-500" />}
                footer={
                  <Link to="/sponsorships">
                    <Button variant="link" className="w-full text-center">
                      View All Sponsorships
                    </Button>
                  </Link>
                }
              >
                {sponsorships && sponsorships.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {user?.role === 'sponsor' ? 'Receiver' : 'Sponsor'}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sponsorships.slice(0, 5).map((sponsorship) => (
                          <tr key={sponsorship.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={
                                      user?.role === 'sponsor'
                                        ? sponsorship.receiver_image || 'https://via.placeholder.com/40'
                                        : sponsorship.sponsor_image || 'https://via.placeholder.com/40'
                                    }
                                    alt="Profile"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user?.role === 'sponsor'
                                      ? `${sponsorship.receiver_first_name} ${sponsorship.receiver_last_name}`
                                      : `${sponsorship.sponsor_first_name} ${sponsorship.sponsor_last_name}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${sponsorship.amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${sponsorship.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  sponsorship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}`}
                              >
                                {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(sponsorship.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <FaUsers className="h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No sponsorships found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new sponsorship.</p>
                    {user?.role === 'sponsor' && (
                      <div className="mt-6">
                        <Link to="/receivers">
                          <Button variant="primary">
                            Find Receivers
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
            
            {/* Profile Overview */}
            <div>
              <Card
                title="Profile Overview"
                titleClass="text-xl font-bold text-gray-800 flex items-center"
                titleIcon={<FaUserCircle className="mr-2 text-blue-500" />}
                footer={
                  <Link to="/profile">
                    <Button variant="link" className="w-full text-center">
                      Edit Profile
                    </Button>
                  </Link>
                }
              >
                {profile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4 relative">
                      <img
                        className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                        src={profile.profile_image || 'https://via.placeholder.com/96'}
                        alt="Profile"
                      />
                      <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize mb-4">{user?.role}</p>
                    
                    <div className="w-full mt-2 space-y-3">
                      {user?.role === 'sponsor' && (
                        <>
                          {profile.organization && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-500">Organization:</span>
                              <span className="text-sm font-medium text-gray-900">{profile.organization}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Phone:</span>
                            <span className="text-sm font-medium text-gray-900">{profile.phone_number}</span>
                          </div>
                        </>
                      )}
                      
                      {user?.role === 'receiver' && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">School:</span>
                            <span className="text-sm font-medium text-gray-900">{profile.school_name}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Grade:</span>
                            <span className="text-sm font-medium text-gray-900">{profile.grade}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500">Member since:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {user?.created_at ? format(new Date(user.created_at), 'MMM yyyy') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <FaUserCircle className="h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Profile not complete</h3>
                    <p className="mt-1 text-sm text-gray-500">Complete your profile to get the most out of the platform.</p>
                    <div className="mt-6">
                      <Link to="/profile">
                        <Button variant="primary">
                          Complete Your Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
              
              {/* Recent Activity */}
              <Card
                title="Recent Activity"
                titleClass="text-xl font-bold text-gray-800 flex items-center mt-6"
                titleIcon={<FaBell className="mr-2 text-blue-500" />}
              >
                {recentActivity.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {recentActivity.map((activity, activityIdx) => (
                        <li key={activity.id}>
                          <div className="relative pb-8">
                            {activityIdx !== recentActivity.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  activity.status === 'active' ? 'bg-green-500' : 
                                  activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}>
                                  <FaUsers className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {activity.status === 'active' 
                                      ? 'Sponsorship activated' 
                                      : activity.status === 'pending' 
                                        ? 'Sponsorship requested' 
                                        : 'Sponsorship ended'} with{' '}
                                    <span className="font-medium text-gray-900">
                                      {user?.role === 'sponsor'
                                        ? `${activity.receiver_first_name} ${activity.receiver_last_name}`
                                        : `${activity.sponsor_first_name} ${activity.sponsor_last_name}`}
                                    </span>
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {format(new Date(activity.created_at), 'MMM d')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No recent activity</p>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'sponsorships' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">All Sponsorships</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage all your sponsorship relationships
            </p>
          </div>
          
          {sponsorships && sponsorships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {user?.role === 'sponsor' ? 'Receiver' : 'Sponsor'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sponsorships.map((sponsorship) => (
                    <tr key={sponsorship.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                user?.role === 'sponsor'
                                  ? sponsorship.receiver_image || 'https://via.placeholder.com/40'
                                  : sponsorship.sponsor_image || 'https://via.placeholder.com/40'
                              }
                              alt="Profile"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.role === 'sponsor'
                                ? `${sponsorship.receiver_first_name} ${sponsorship.receiver_last_name}`
                                : `${sponsorship.sponsor_first_name} ${sponsorship.sponsor_last_name}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${sponsorship.amount}</div>
                        <div className="text-sm text-gray-500">{sponsorship.frequency || 'Monthly'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${sponsorship.status === 'active' ? 'bg-green-100 text-green-800' : 
                            sponsorship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {sponsorship.status.charAt(0).toUpperCase() + sponsorship.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(sponsorship.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/sponsorships/${sponsorship.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </Link>
                        {sponsorship.status === 'pending' && user?.role === 'sponsor' && (
                          <button className="text-green-600 hover:text-green-900 mr-4">
                            Approve
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FaUsers className="h-full w-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sponsorships found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new sponsorship.</p>
              {user?.role === 'sponsor' && (
                <div className="mt-6">
                  <Link to="/receivers">
                    <Button variant="primary">
                      Find Receivers
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and application settings
            </p>
          </div>
          
          {profile ? (
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                  <div className="w-32 h-32 relative mb-4">
                    <img
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow"
                      src={profile.profile_image || 'https://via.placeholder.com/128'}
                      alt="Profile"
                    />
                    <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white">
                      <FaUserCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                  
                  <div className="mt-6">
                    <Link to="/profile/edit">
                      <Button variant="primary" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-8 md:border-l md:border-gray-200">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user?.first_name} {user?.last_name}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                    </div>
                    
                    {user?.role === 'sponsor' && (
                      <>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Organization</dt>
                          <dd className="mt-1 text-sm text-gray-900">{profile.organization || 'Not specified'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                          <dd className="mt-1 text-sm text-gray-900">{profile.phone_number || 'Not specified'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Address</dt>
                          <dd className="mt-1 text-sm text-gray-900">{profile.address || 'Not specified'}</dd>
                        </div>
                      </>
                    )}
                    
                    {user?.role === 'receiver' && (
                      <>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Date of birth</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {profile.date_of_birth ? format(new Date(profile.date_of_birth), 'MMMM d, yyyy') : 'Not specified'}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">School</dt>
                          <dd className="mt-1 text-sm text-gray-900">{profile.school_name || 'Not specified'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Grade</dt>
                          <dd className="mt-1 text-sm text-gray-900">{profile.grade || 'Not specified'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Guardian name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{profile.guardian_name || 'Not specified'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Guardian contact</dt>
                          <dd className="mt-1 text-sm text-gray-900">{profile.guardian_contact || 'Not specified'}</dd>
                        </div>
                      </>
                    )}
                    
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">About</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile.bio || 'No bio information provided.'}
                      </dd>
                    </div>
                  </dl>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Email notifications</h4>
                          <p className="text-sm text-gray-500">Receive email about sponsorship activity</p>
                        </div>
                        <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">SMS notifications</h4>
                          <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                        </div>
                        <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FaUserCircle className="h-full w-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Profile not complete</h3>
              <p className="mt-1 text-sm text-gray-500">Complete your profile to get the most out of the platform.</p>
              <div className="mt-6">
                <Link to="/profile">
                  <Button variant="primary">
                    Complete Your Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

