import React from 'react';

const AssignmentList = ({ assignments, onRemove }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teacher
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned On
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {assignment.teacher_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{assignment.student_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(assignment.assigned_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {assignment.assigned_by_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onRemove(assignment)}
                  className="text-red-600 hover:text-red-900"
                >
                  <i className="fas fa-unlink mr-1"></i> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {assignments.length === 0 && (
        <div className="text-center py-8 bg-white">
          <i className="fas fa-link text-gray-300 text-4xl mb-3"></i>
          <h3 className="text-lg font-medium text-gray-600">No assignments yet</h3>
          <p className="text-sm text-gray-500">Assign teachers to students using the form above.</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;