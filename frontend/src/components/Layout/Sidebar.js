import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-auto`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Navigation</h2>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/dashboard')}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-tachometer-alt mr-3"></i>
                Dashboard
              </Link>
            </li>
            
            {user?.role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/admin')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-cog mr-3"></i>
                  Admin Panel
                </Link>
              </li>
            )}
            
            <li>
              <Link
                to="/profile"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/profile')}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-user mr-3"></i>
                Profile
              </Link>
            </li>
            
            <li>
              <Link
                to="/notifications"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/notifications')}`}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-bell mr-3"></i>
                Notifications
                <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">3</span>
              </Link>
            </li>
            
            {user?.role === 'student' && (
              <li>
                <Link
                  to="/documents"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/documents')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-file-upload mr-3"></i>
                  My Documents
                </Link>
              </li>
            )}
            
            {user?.role === 'teacher' && (
              <li>
                <Link
                  to="/reviews"
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive('/reviews')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-check-circle mr-3"></i>
                  Reviews
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;