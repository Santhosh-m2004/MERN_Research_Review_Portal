import React, { useState } from 'react';

const AssignmentForm = ({ teachers, students, onSubmit }) => {
  const [formData, setFormData] = useState({
    teacher_id: '',
    student_id: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
        <select
          name="teacher_id"
          value={formData.teacher_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a Teacher</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.full_name} ({teacher.username})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
        <select
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a Student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.full_name} ({student.username})
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <i className="fas fa-link mr-2"></i> Assign Teacher
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;