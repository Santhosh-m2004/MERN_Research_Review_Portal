import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import StatsCard from './StatsCard';
import DocumentList from '../Documents/DocumentList';
import UserList from '../Users/UserList';
import AssignmentForm from '../Assignments/AssignmentForm';
import AssignmentList from '../Assignments/AssignmentList';
import Alert from '../Common/Alert';
import Loader from '../Common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const api = useApi();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes, 
        documentsRes, 
        teachersRes, 
        studentsRes, 
        assignmentsRes,
        usersRes
      ] = await Promise.all([
        api.get('/users/stats'),
        api.get('/documents?limit=5&sort=-uploaded_at'),
        api.get('/users?role=teacher'),
        api.get('/users?role=student'),
        api.get('/assignments'),
        api.get('/users')
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }

      if (documentsRes.success) {
        setRecentDocuments(documentsRes.data);
      }

      if (teachersRes.success) {
        setTeachers(teachersRes.data);
      }

      if (studentsRes.success) {
        setStudents(studentsRes.data);
      }

      if (assignmentsRes.success) {
        // Populate assignment data with user details
        const populatedAssignments = await Promise.all(
          assignmentsRes.data.map(async (assignment) => {
            const [teacherRes, studentRes] = await Promise.all([
              api.get(`/users/${assignment.teacher_id}`),
              api.get(`/users/${assignment.student_id}`)
            ]);
            
            return {
              ...assignment,
              teacher_name: teacherRes.success ? teacherRes.data.full_name : 'Unknown',
              student_name: studentRes.success ? studentRes.data.full_name : 'Unknown'
            };
          })
        );
        
        setAssignments(populatedAssignments);
      }

      if (usersRes.success) {
        setUsers(usersRes.data);
      }
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (formData) => {
    try {
      const response = await api.post('/assignments', formData);
      
      if (response.success) {
        setMessage('Teacher assigned successfully');
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) {
      return;
    }
    
    try {
      const response = await api.delete(`/assignments/${assignmentId}`);
      
      if (response.success) {
        setMessage('Assignment removed successfully');
        setAssignments(prev => prev.filter(a => a._id !== assignmentId));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const response = await api.delete(`/documents/${documentId}`);
      
      if (response.success) {
        setMessage('Document deleted successfully');
        setRecentDocuments(prev => prev.filter(d => d._id !== documentId));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewDocument = (document) => {
    window.open(document.document_submission, '_blank');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome, {user?.full_name}</span>
      </div>
      
      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Users" 
          value={stats.total_users} 
          icon="users" 
          color="blue" 
        />
        <StatsCard 
          title="Administrators" 
          value={stats.total_admins} 
          icon="user-shield" 
          color="purple" 
        />
        <StatsCard 
          title="Teachers" 
          value={stats.total_teachers} 
          icon="chalkboard-teacher" 
          color="green" 
        />
        <StatsCard 
          title="Students" 
          value={stats.total_students} 
          icon="user-graduate" 
          color="indigo" 
        />
        <StatsCard 
          title="Total Documents" 
          value={stats.total_documents} 
          icon="file-alt" 
          color="yellow" 
        />
        <StatsCard 
          title="Reviewed" 
          value={stats.documents_with_feedback} 
          icon="file-check" 
          color="green" 
        />
        <StatsCard 
          title="Pending Review" 
          value={stats.documents_pending_feedback} 
          icon="file-exclamation" 
          color="red" 
        />
      </div>

      {/* User Management */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
        <UserList 
          users={users}
          currentUserId={user?.id}
        />
      </div>

      {/* Assign Teacher to Student */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Assign Teacher to Student</h2>
        <AssignmentForm 
          teachers={teachers} 
          students={students} 
          onSubmit={handleAssignTeacher}
        />
      </div>

      {/* Current Assignments */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Assignments</h2>
        <AssignmentList 
          assignments={assignments}
          onRemove={handleRemoveAssignment}
        />
      </div>

      {/* Recent Document Submissions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Document Submissions</h2>
        <DocumentList 
          documents={recentDocuments}
          onView={handleViewDocument}
          onDelete={handleDeleteDocument}
          userRole={user?.role}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;