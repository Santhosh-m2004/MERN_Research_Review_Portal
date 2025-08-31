import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentList from '../Documents/DocumentList';
import Alert from '../Common/Alert';
import Loader from '../Common/Loader';

const StudentDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const { user } = useAuth();
  const api = useApi();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [documentsRes, assignmentRes] = await Promise.all([
        api.get('/documents'),
        api.get('/assignments')
      ]);

      if (documentsRes.success) {
        setDocuments(documentsRes.data);
      }

      if (assignmentRes.success && assignmentRes.data.length > 0) {
        const teacherRes = await api.get(`/users/${assignmentRes.data[0].teacher_id}`);
        if (teacherRes.success) {
          setTeacher(teacherRes.data);
        }
      }
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      setError('');
      setMessage('');
      
      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('paper_name', formData.paper_name);
      uploadData.append('description', formData.description);
      uploadData.append('document_submission', formData.document_submission);
      
      const response = await api.postFormData('/documents', uploadData);
      
      if (response.success) {
        setMessage('Document uploaded successfully');
        setDocuments(prev => [response.data, ...prev]);
        return true;
      }
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (document) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const response = await api.delete(`/documents/${document._id}`);
      
      if (response.success) {
        setMessage('Document deleted successfully');
        setDocuments(prev => prev.filter(d => d._id !== document._id));
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
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome, {user?.full_name}</span>
      </div>
      
      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      {/* Assigned Teacher */}
      {teacher ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Assigned Teacher</h2>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <i className="fas fa-user-tie text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">{teacher.full_name}</h3>
              <p className="text-sm text-gray-600">{teacher.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-8">
            <i className="fas fa-user-tie text-gray-300 text-4xl mb-3"></i>
            <h3 className="text-lg font-medium text-gray-600">No teacher assigned yet</h3>
            <p className="text-sm text-gray-500">The administrator will assign a teacher to you soon.</p>
          </div>
        </div>
      )}
      
      {/* Upload New Document */}
      <DocumentUpload 
        onSubmit={handleUpload} 
        loading={uploading}
        defaultName={user?.full_name}
      />
      
      {/* Your Submitted Documents */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Submitted Documents</h2>
        <DocumentList 
          documents={documents}
          onView={handleViewDocument}
          onDelete={handleDeleteDocument}
          userRole={user?.role}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;