import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-md">
            <i className="fas fa-file-alt text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-blue-800">Research Portal</h1>
        </Link>

        <nav className="hidden md:flex space-x-1">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${isActive('/dashboard')}`}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
              </Link>
              
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${isActive('/admin')}`}
                >
                  <i className="fas fa-cog mr-2"></i>Admin
                </Link>
              )}
              
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${isActive('/profile')}`}
              >
                <i className="fas fa-user mr-2"></i>Profile
              </Link>
              
              <Link
                to="/notifications"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${isActive('/notifications')}`}
              >
                <i className="fas fa-bell mr-2"></i>Notifications
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-gray-700">
                Hello, <span className="font-semibold">{user?.full_name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </>
          ) : null}
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;