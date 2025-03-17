import React, { useState, useEffect } from 'react';
import StudentModal from '../components/StudentModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Link } from 'react-router-dom';

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
            const response = await fetch('http://localhost:3000/api/students', {
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
            studentId: '',
            studentName: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/students/add-student', {
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
            const response = await fetch(`http://localhost:3000/api/students/${selectedStudent._id}`, {
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
            const response = await fetch(`http://localhost:3000/api/students/${selectedStudent._id}`, {
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
            studentId: student.studentId,
            studentName: student.studentName
        });
        setIsEditModalOpen(true);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className='p-4 sm:p-6 max-w-6xl mx-auto'>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className='text-2xl sm:text-3xl font-bold'>Students Management</h1>
                <button
                    onClick={openAddModal}
                    className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                    Add New Student
                </button>
            </div>

            
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

           
            {error && (
                <div className='fixed top-4 right-4 left-4 sm:left-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50'>
                    {error}
                </div>
            )}
            {success && (
                <div className='fixed top-4 right-4 left-4 sm:left-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50'>
                    {success}
                </div>
            )}

            
            <div className="block sm:hidden space-y-4">
                {filteredStudents.map((student) => (
                    <div key={student._id} className="bg-white rounded-lg shadow-md p-4">
                        <div className="space-y-2">
                            <div>
                                <label className="text-xs text-gray-500">Student Name</label>
                                <p className="font-medium">{student.studentName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Student ID</label>
                                <p className="font-medium">{student.studentId}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">CodeChef ID</label>
                                <p className="font-medium">{student.codechefId}</p>
                            </div>
                            <div className="flex justify-end space-x-3 pt-2 border-t">
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
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View - Table */}
            <div className='hidden sm:block bg-white rounded-lg shadow-md overflow-x-auto'>
                <table className='min-w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Student Name</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Student ID</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>CodeChef ID</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {filteredStudents.map((student) => (
                            <tr key={student._id} className="hover:bg-gray-50">
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <Link
                                        to={`/student-stats/${student.codechefId}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        {student.studentName}
                                    </Link>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>{student.studentId}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>{student.codechefId}</td>
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
        </div>
    );
};

export default Students;