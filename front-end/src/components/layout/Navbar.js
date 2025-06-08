import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/actions/authActions';
import { getUnreadNotificationsCount } from '../../store/actions/notificationActions';
import { getUnreadMessagesCount } from '../../store/actions/messageActions';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { unreadCount: unreadNotifications } = useSelector(state => state.notifications);
  const { unreadCount: unreadMessages } = useSelector(state => state.messages);
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUnreadNotificationsCount());
      dispatch(getUnreadMessagesCount());
      
      // Poll for new notifications and messages every minute
      const interval = setInterval(() => {
        dispatch(getUnreadNotificationsCount());
        dispatch(getUnreadMessagesCount());
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, dispatch]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const authLinks = (
    <>
      <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
        Dashboard
      </Link>
      
      {user && user.role === 'sponsor' && (
        <>
          <Link to="/sponsorships" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            My Sponsorships
          </Link>
          <Link to="/receivers" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Find Receivers
          </Link>
        </>
      )}
      
      {user && user.role === 'receiver' && (
        <Link to="/sponsorships" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          My Sponsorships
        </Link>
      )}
      
      {user && user.role === 'admin' && (
        <>
          <Link to="/admin/users" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Manage Users
          </Link>
          <Link to="/admin/sponsorships" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            All Sponsorships
          </Link>
          <Link to="/admin/reports" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Reports
          </Link>
        </>
      )}
      
      <Link to="/messages" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium relative">
        Messages
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadMessages}
          </span>
        )}
      </Link>
      
      <Link to="/notifications" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium relative">
        Notifications
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadNotifications}
          </span>
        )}
      </Link>
      
      <Link to="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
        Profile
      </Link>
      
      <button
        onClick={handleLogout}
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Logout
      </button>
    </>
  );
  
  const guestLinks = (
    <>
      <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
        Login
      </Link>
      <Link to="/register" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
        Register
      </Link>
    </>
  );
  
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                Sponsor Bridge
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                {isAuthenticated ? authLinks : guestLinks}
              </div>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                
                {user && user.role === 'sponsor' && (
                  <>
                    <Link to="/sponsorships" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      My Sponsorships
                    </Link>
                    <Link to="/receivers" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      Find Receivers
                    </Link>
                  </>
                )}
                
                {user && user.role === 'receiver' && (
                  <Link to="/sponsorships" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    My Sponsorships
                  </Link>
                )}
                
                {user && user.role === 'admin' && (
                  <>
                    <Link to="/admin/users" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      Manage Users
                    </Link>
                    <Link to="/admin/sponsorships" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      All Sponsorships
                    </Link>
                    <Link to="/admin/reports" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                      Reports
                    </Link>
                  </>
                )}
                
                <Link to="/messages" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium relative">
                  Messages
                  {unreadMessages > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                
                <Link to="/notifications" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium relative">
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                
                <Link to="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;