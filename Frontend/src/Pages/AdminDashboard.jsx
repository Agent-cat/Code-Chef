import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/counselors`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCounselors(response.data);
      } catch (err) {
        setError('Failed to fetch counselors. Please try again later.');
        console.error('Error fetching counselors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Department Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {counselors.map(counselor => (
            <div 
              key={counselor._id} 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCounselor(counselor)}
            >
              <h2 className="text-xl font-semibold mb-2">{counselor.name}</h2>
              <p className="text-lg text-gray-600">{counselor.counselingStudents.length} Counseling Students</p>
            </div>
          ))}
        </div>

        {selectedCounselor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Counseling Students for {selectedCounselor.name}</h2>
                <button 
                  onClick={() => setSelectedCounselor(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {selectedCounselor.students.map(student => (
                  <div key={student._id} className="py-4">
                    <Link to={`/student-stats/${student.codechefId}`} className="text-lg font-medium text-gray-900 hover:text-blue-600 hover:underline">{student.studentName}</Link>
                    <p className="text-gray-500">Student ID: {student.studentId}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;