import React from 'react';

const DocumentList = ({ documents, onView, onDelete, onFeedback, userRole }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'revised':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {userRole === 'teacher' && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paper Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted On
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((document) => (
            <tr key={document.id}>
              {userRole === 'teacher' && (
                <td className="px-6 py-4 whitespace-nowrap">
                  {document.student_name}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {document.paper_name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {document.description || 'No description'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(document.uploaded_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    document.status
                  )}`}
                >
                  {document.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onView(document)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <i className="fas fa-eye mr-1"></i> View
                </button>
                {userRole === 'teacher' && (
                  <button
                    onClick={() => onFeedback(document)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    <i className="fas fa-comment mr-1"></i> Feedback
                  </button>
                )}
                <button
                  onClick={() => onDelete(document)}
                  className="text-red-600 hover:text-red-900"
                >
                  <i className="fas fa-trash mr-1"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {documents.length === 0 && (
        <div className="text-center py-8 bg-white">
          <i className="fas fa-file-alt text-gray-300 text-4xl mb-3"></i>
          <h3 className="text-lg font-medium text-gray-600">No documents found</h3>
          <p className="text-sm text-gray-500">No documents have been submitted yet.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;