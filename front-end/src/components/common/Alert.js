import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeAlert } from '../../store/actions/alertActions';

const Alert = () => {
  const alerts = useSelector(state => state.alert);
  const dispatch = useDispatch();
  
  if (alerts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      {alerts.map(alert => (
        <div 
          key={alert.id} 
          className={`mb-2 p-4 rounded-md shadow-md relative ${
            alert.type === 'error' ? 'bg-red-100 text-red-700' :
            alert.type === 'success' ? 'bg-green-100 text-green-700' :
            alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}
        >
          <button 
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            onClick={() => dispatch(removeAlert(alert.id))}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {alert.msg}
        </div>
      ))}
    </div>
  );
};

export default Alert;