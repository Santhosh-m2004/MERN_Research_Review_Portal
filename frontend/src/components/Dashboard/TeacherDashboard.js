import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import DocumentList from '../Documents/DocumentList';
import FeedbackForm from '../Documents/FeedbackForm';
import Alert from '../Common/Alert';
import Loader from '../Common/Loader';

const TeacherDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
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
      const [documentsRes, assignmentsRes] = await Promise.all([
        api.get('/documents'),
        api.get('/assignments')
      ]);

      if (documentsRes.success) {
        setDocuments(documentsRes.data);
      }

      if (assignmentsRes.success) {
        // Get student details for each assignment
        const studentDetails = await Promise.all(
          assignmentsRes.data.map(async (assignment) => {
            const studentRes = await api.get(`/users/${assignment.student_id}`);
            return studentRes.success ? studentRes.data : null;
          })
        );
        
        setStudents(studentDetails.filter(student => student !== null));
      }
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (document) => {
    window.open(document.document_submission, '_blank');
  };

  const handleFeedback = (document) => {
    setSelectedDocument(document);
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      const response = await api.put(`/documents/${selectedDocument._id}`, feedbackData);
      
      if (response.success) {
        setMessage('Feedback submitted successfully');
        setShowFeedbackForm(false);
        setSelectedDocument(null);
        
        // Update the document in the list
        setDocuments(prev => prev.map(doc => 
          doc._id === selectedDocument._id ? response.data : doc
        ));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelFeedback = () => {
    setShowFeedbackForm(false);
    setSelectedDocument(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome, {user?.full_name}</span>
      </div>
      
      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      {/* Assigned Students */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Assigned Students</h2>
        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
              <div key={student._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-user-graduate text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{student.full_name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-xs text-gray-500">@{student.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-user-graduate text-gray-300 text-4xl mb-3"></i>
            <h3 className="text-lg font-medium text-gray-600">No students assigned yet</h3>
            <p className="text-sm text-gray-500">The administrator will assign students to you.</p>
          </div>
        )}
      </div>
      
      {/* Documents from Your Students */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents from Your Students</h2>
        <DocumentList 
          documents={documents}
          onView={handleViewDocument}
          onFeedback={handleFeedback}
          userRole={user?.role}
        />
      </div>
      
      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm 
          document={selectedDocument}
          onSubmit={handleSubmitFeedback}
          onCancel={handleCancelFeedback}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;