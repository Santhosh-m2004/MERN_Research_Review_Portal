import React from 'react';

const NotificationList = ({ notifications, onMarkAsRead, onDelete }) => {
  const getCategoryClass = (category) => {
    switch (category) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border-l-4 rounded-md ${
            notification.read ? 'bg-white' : 'bg-gray-50'
          } ${
            notification.category === 'info' ? 'border-blue-400' :
            notification.category === 'success' ? 'border-green-400' :
            notification.category === 'warning' ? 'border-yellow-400' :
            notification.category === 'error' ? 'border-red-400' : 'border-gray-400'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryClass(
                    notification.category
                  )}`}
                >
                  {notification.category}
                </span>
                {!notification.read && (
                  <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-700">{notification.message}</p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex space-x-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Mark as read"
                >
                  <i className="fas fa-check-circle"></i>
                </button>
              )}
              <button
                onClick={() => onDelete(notification)}
                className="text-gray-400 hover:text-red-600"
                title="Delete notification"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <div className="text-center py-8">
          <i className="fas fa-bell-slash text-gray-300 text-4xl mb-3"></i>
          <h3 className="text-lg font-medium text-gray-600">No notifications</h3>
          <p className="text-sm text-gray-500">You don't have any notifications at this time.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;