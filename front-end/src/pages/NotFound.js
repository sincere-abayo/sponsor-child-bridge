import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">
            Go Home
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;