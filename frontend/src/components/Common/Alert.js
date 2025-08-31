import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const alertClasses = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700'
  };

  const iconClasses = {
    info: 'fas fa-info-circle text-blue-500',
    success: 'fas fa-check-circle text-green-500',
    warning: 'fas fa-exclamation-triangle text-yellow-500',
    error: 'fas fa-exclamation-circle text-red-500'
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded-md ${alertClasses[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className={`${iconClasses[type]} mr-3 mt-1`}></i>
        </div>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;