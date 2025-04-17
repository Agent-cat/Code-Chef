import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeforcesProfile from '../components/profiles/CodeforcesProfile';
import CodechefProfile from '../components/profiles/CodechefProfile';
import LeetcodeProfile from '../components/profiles/LeetcodeProfile';

const CodingProfile = ({ student }) => {
    const [activeTab, setActiveTab] = useState('leetcode');

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 sm:gap-4 bg-white p-4 rounded-lg shadow-sm">
                <button
                    onClick={() => setActiveTab('leetcode')}
                    className={`px-6 py-2.5 rounded-full transition-all duration-200 font-medium ${
                        activeTab === 'leetcode' 
                            ? 'bg-black text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    LeetCode
                </button>
                <button
                    onClick={() => setActiveTab('codechef')}
                    className={`px-6 py-2.5 rounded-full transition-all duration-200 font-medium ${
                        activeTab === 'codechef' 
                            ? 'bg-black text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    CodeChef
                </button>
                <button
                    onClick={() => setActiveTab('codeforces')}
                    className={`px-6 py-2.5 rounded-full transition-all duration-200 font-medium ${
                        activeTab === 'codeforces' 
                            ? 'bg-black text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    CodeForces
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                {activeTab === 'leetcode' && <LeetcodeProfile leetcodeId={student.leetcodeId} />}
                {activeTab === 'codechef' && <CodechefProfile codechefId={student.codechefId} />}
                {activeTab === 'codeforces' && <CodeforcesProfile codeforcesId={student.codeforcesId} />}
            </div>
        </div>
    );
};

const ProjectProfile = () => {
    return (
        <div >
            
        </div>
    );
};

const StudentProfile = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [activeSection, setActiveSection] = useState('coding');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setStudent(data.student);
            } catch (error) {
                console.error('Error fetching student:', error);
            }
            setLoading(false);
        };

        fetchStudent();
    }, [studentId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">
                    <svg className="animate-spin h-8 w-8 mr-3 inline-block text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Student not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-sm transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{student.studentName}</h1>
                            <p className="text-gray-500">Student ID: {student.studentId}</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <div className="inline-flex rounded-lg shadow-sm">
                                <button
                                    onClick={() => setActiveSection('coding')}
                                    className={`px-6 py-2.5 rounded-l-lg font-medium transition-all duration-200 ${
                                        activeSection === 'coding'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Coding Profile
                                </button>
                                <button
                                    onClick={() => setActiveSection('projects')}
                                    className={`px-6 py-2.5 rounded-r-lg font-medium transition-all duration-200 ${
                                        activeSection === 'projects'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Project Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {activeSection === 'coding' && <CodingProfile student={student} />}
                    {activeSection === 'projects' && <ProjectProfile student={student} />}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile; 