import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import TeacherDashboard from '../components/Dashboard/TeacherDashboard';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import Loader from '../components/Common/Loader';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    window.location.href = '/login';
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;