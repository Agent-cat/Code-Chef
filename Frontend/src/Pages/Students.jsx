import React, { useState, useEffect } from 'react';
import StudentModal from '../components/StudentModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Link } from 'react-router-dom';
import RoleBasedComponent from '../components/RoleBasedComponent';
import ImportStudentsModal from '../components/ImportStudentsModal';

const StudentForm = ({ onSubmit, initialData, formData, setFormData }) => (
    <form onSubmit={onSubmit} className='space-y-4 w-full'>
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>CodeChef ID</label>
            <input
                type='text'
                value={formData.codechefId}
                onChange={(e) => setFormData({ ...formData, codechefId: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                required
            />
        </div>
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Leetcode ID</label>
            <input
                type='text'
                value={formData.leetcodeId}
                onChange={(e) => setFormData({ ...formData, leetcodeId: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                required
            />
        </div>
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>CodeForces ID</label>
            <input
                type='text'
                value={formData.codeforcesId}
                onChange={(e) => setFormData({ ...formData, codeforcesId: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                required
            />
        </div>
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Student ID</label>
            <input
                type='text'
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                required
            />
        </div>
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Student Name</label>
            <input
                type='text'
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                required
            />
        </div>
        <div className="flex justify-end space-x-3 mt-4">
            <button
                type='submit'
                className='bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200'
            >
                {initialData ? 'Update Student' : 'Add Student'}
            </button>
        </div>
    </form>
);

const Students = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [formData, setFormData] = useState({
        codechefId: '',
        leetcodeId: '',
        codeforcesId: '',
        studentId: '',
        studentName: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    
    useEffect(() => {
        fetchStudents();
    }, []);

    
    useEffect(() => {
        const filtered = students.filter(student => 
            student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.codechefId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchQuery, students]);

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setStudents(data.students);
            setFilteredStudents(data.students); 
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            codechefId: '',
            leetcodeId: '',
            codeforcesId: '',
            studentId: '',
            studentName: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/students/add-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setSuccess('Student added successfully');
            resetForm();
            fetchStudents();
            setIsAddModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/students/${selectedStudent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setSuccess('Student updated successfully');
            resetForm();
            fetchStudents();
            setIsEditModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/students/${selectedStudent._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete student');
            fetchStudents();
            setSuccess('Student deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const openAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const openEditModal = (student) => {
        setSelectedStudent(student);
        setFormData({
            codechefId: student.codechefId,
            leetcodeId: student.leetcodeId,
            codeforcesId: student.codeforcesId,
            studentId: student.studentId,
            studentName: student.studentName
        });
        setIsEditModalOpen(true);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleBatchImport = async (students) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/students/batch-import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ students })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setSuccess(`Successfully imported ${data.imported} students. ${data.duplicates || 0} duplicates skipped.`);
            fetchStudents();
            setIsImportModalOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Students</h1>
                    
                    <div className="flex space-x-3">
                        <button 
                            onClick={() => setIsImportModalOpen(true)}
                            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Import
                        </button>
                        <button 
                            onClick={openAddModal}
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            Add Student
                        </button>
                    </div>
                </div>
                
                {/* Special actions only visible to HOD and Dean */}
                {/* <RoleBasedComponent allowedRoles={["HOD", "Dean"]}>
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Administrative Actions</h2>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Export All Student Data
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                Generate Performance Report
                            </button>
                        </div>
                    </div>
                </RoleBasedComponent> */}
                
               
                <RoleBasedComponent allowedRoles={["Dean"]}>
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Dean Actions</h2>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                Reassign Students
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Bulk Delete
                            </button>
                        </div>
                    </div>
                </RoleBasedComponent>
                
                
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name, student ID, or CodeChef ID..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {(success || error) && (
                    <div className={`p-4 rounded-md mb-4 ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {success || error}
                    </div>
                )}

               
                <div className="sm:hidden space-y-4">
                    {filteredStudents.map((student) => (
                        <div key={student._id} className="bg-white p-4 rounded-lg shadow">
                            <Link
                                to={`/student/${student._id}`}
                                className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline block mb-2"
                            >
                                {student.studentName}
                            </Link>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>Student ID: {student.studentId}</p>
                                <p>CodeChef ID: {student.codechefId}</p>
                            </div>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => openEditModal(student)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
               
                <div className='hidden sm:block bg-white rounded-lg shadow-md overflow-x-auto'>
                    <table className='min-w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Student Name</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Student ID</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>CodeChef ID</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Leetcode ID</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>CodeForces ID</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {filteredStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-gray-50">
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <Link
                                            to={`/student/${student._id}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {student.studentName}
                                        </Link>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{student.studentId}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{student.codechefId}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{student.leetcodeId}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{student.codeforcesId}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => openEditModal(student)}
                                                className='text-blue-600 hover:text-blue-800'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className='text-red-600 hover:text-red-800'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Student Modal */}
                <StudentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title="Add New Student"
                >
                    <StudentForm
                        onSubmit={handleSubmit}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </StudentModal>

                {/* Edit Student Modal */}
                <StudentModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Edit Student"
                >
                    <StudentForm
                        onSubmit={handleEdit}
                        initialData={selectedStudent}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </StudentModal>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    message="Are you sure you want to delete this student?"
                />

                {/* Import Students Modal */}
                <ImportStudentsModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleBatchImport}
                />
            </div>
        </div>
    );
};

export default Students;