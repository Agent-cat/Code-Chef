import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ContestAttendance = ({ contests }) => {
    const { contestCode } = useParams();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const studentsResponse = await axios.get('http://localhost:3000/api/students', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const students = studentsResponse.data.students;

                const attendanceData = await Promise.all(
                    students.map(async (student) => {
                        try {
                            const response = await axios.get(`https://codechef-api.vercel.app/handle/${student.codechefId}`);
                            const hasAttempted = response.data.ratingData?.some(
                                contest => contest.code.slice(0, -1) === contestCode
                            ) || false;

                            return {
                                ...student,
                                status: hasAttempted ? 'Present' : 'Absent'
                            };
                        } catch (err) {
                            return {
                                ...student,
                                status: 'Error'
                            };
                        }
                    })
                );

                setAttendance(attendanceData);
            } catch (err) {
                setError('Failed to fetch attendance data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [contestCode]);

    const filteredAttendance = attendance
        .filter(student => {
            if (filter === 'present') return student.status === 'Present';
            if (filter === 'absent') return student.status === 'Absent';
            return true;
        })
        .filter(student => 
            student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.codechefId.toLowerCase().includes(searchQuery.toLowerCase())
        );

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
        <div className="min-h-screen p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => window.history.back()} 
                    className="mb-4 px-4 py-2 flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Contest Attendance - {contestCode}</h1>

                <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg
                            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg ${
                                filter === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('present')}
                            className={`px-4 py-2 rounded-lg ${
                                filter === 'present'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Present
                        </button>
                        <button
                            onClick={() => setFilter('absent')}
                            className={`px-4 py-2 rounded-lg ${
                                filter === 'absent'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Absent
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CodeChef ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAttendance.map((student) => (
                                <tr key={student._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.studentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.studentId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.codechefId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-sm ${student.status === 'Present'
                                            ? 'bg-green-100 text-green-800'
                                            : student.status === 'Absent'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContestAttendance; 