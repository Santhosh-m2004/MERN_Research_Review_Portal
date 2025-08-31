import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import NotificationList from '../components/Notifications/NotificationList';
import Alert from '../components/Common/Alert';
import Loader from '../components/Common/Loader';

const Notifications = () => {
  const { user } = useAuth();
  const api = useApi();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notifications?page=${page}&limit=10`);
      
      if (response.success) {
        setNotifications(response.data);
        setTotalPages(response.pagination.pages);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (error) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification) => {
    try {
      const response = await api.put(`/notifications/${notification._id}/read`);
      
      if (response.success) {
        // Update the notification in the list
        setNotifications(prev => prev.map(n => 
          n._id === notification._id ? { ...n, read: true } : n
        ));
      } else {
        setError('Failed to mark notification as read');
      }
    } catch (error) {
      setError('Failed to mark notification as read');
    }
  };

  const handleDelete = async (notification) => {
    try {
      const response = await api.delete(`/notifications/${notification._id}`);
      
      if (response.success) {
        setMessage('Notification deleted successfully');
        // Remove the notification from the list
        setNotifications(prev => prev.filter(n => n._id !== notification._id));
      } else {
        setError('Failed to delete notification');
      }
    } catch (error) {
      setError('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // This would require a new endpoint in the backend
      // For now, we'll mark each notification individually
      const unreadNotifications = notifications.filter(n => !n.read);
      
      for (const notification of unreadNotifications) {
        await handleMarkAsRead(notification);
      }
      
      setMessage('All notifications marked as read');
    } catch (error) {
      setError('Failed to mark all notifications as read');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-600">Your recent notifications</p>
          </div>

          <div className="p-6">
            {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                {notifications.length} notification(s)
              </span>
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Mark All as Read
              </button>
            </div>
            
            <NotificationList 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded-md ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;