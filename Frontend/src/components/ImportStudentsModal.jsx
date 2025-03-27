import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const ImportStudentsModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');

    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      
      if (fileType === 'csv') {
        parseCSV(selectedFile);
      } else if (['xlsx', 'xls'].includes(fileType)) {
        parseExcel(selectedFile);
      } else {
        setError('Please upload a CSV or Excel file');
        setFile(null);
      }
    }
  };

  const parseCSV = (file) => {
    setIsLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
        setIsLoading(false);
      },
      error: (error) => {
        setError('Error parsing CSV file: ' + error.message);
        setIsLoading(false);
      }
    });
  };

  const parseExcel = (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);
        processData(parsedData);
      } catch (error) {
        setError('Error parsing Excel file: ' + error.message);
      }
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const processData = (data) => {
    // Validate and transform the data
    const processedData = data.map(row => {
      // Try to match expected column names with various possible formats
      const studentName = row.studentName || row.StudentName || row['Student Name'] || row.Name || row.name;
      const studentId = row.studentId || row.StudentId || row['Student ID'] || row.ID || row.id;
      const codechefId = row.codechefId || row.CodechefId || row['Codechef ID'] || row.Codechef || row.codechef;

      return {
        studentName,
        studentId,
        codechefId
      };
    }).filter(row => row.studentName && row.studentId && row.codechefId);

    setParsedData(processedData);
    setPreview(processedData.slice(0, 5)); // Show first 5 rows as preview
    
    if (processedData.length === 0) {
      setError('No valid data found. Please ensure your file has columns for studentName, studentId, and codechefId.');
    }
  };

  const handleImport = () => {
    if (parsedData.length === 0) {
      setError('No valid data to import');
      return;
    }
    onImport(parsedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Import Students</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Upload a CSV or Excel file with the following columns: studentName, studentId, and codechefId.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200"
              >
                Select File
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
            </div>
          )}

          {preview.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Preview (first 5 rows):</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CodeChef ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{row.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.codechefId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Total records: {parsedData.length}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parsedData.length === 0 || isLoading}
              className={`px-4 py-2 rounded-md text-white transition duration-200 ${
                parsedData.length === 0 || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              Import {parsedData.length} Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsModal; 