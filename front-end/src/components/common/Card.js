import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  ...rest 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...rest}>
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-4 border-t bg-gray-50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;