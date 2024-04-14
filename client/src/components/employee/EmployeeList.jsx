import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employee');
        const employeesWithImageUrls = await Promise.all(response.data.reverse().map(async (employee) => {
          return { ...employee };
        }));
        setEmployees(employeesWithImageUrls);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchEmployees(); // Call fetchEmployees function when component mounts
  }, []);



  const handleDelete = async (employeeId) => {
    try {
      const response = await axios.delete(`/api/employee/${employeeId}`);
      if (response.status === 200) { // Check for successful deletion
        setEmployees(employees.filter(employee => employee._id !== employeeId));
        alert('Employee deleted successfully');
      } else {
        alert('Error deleting employee. Please try again.');
      }
    } catch (error) {
      alert('Error deleting employee:', error);
    }
  };

  const handleUpdate = (employeeId) => {
    // Implement your update logic here
    console.log('Update employee with ID:', employeeId);
    navigate(`/UpdateEmployee/${employeeId}`); // Navigate to UpdateEmployee page with leave ID
  };

  const storage = getStorage();
  const fetchImageUrl = async (imagePath) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const fullPath = `images/${imagePath}`;
    console.log("Attempting to fetch image from:", fullPath);
    try {
      const imageRef = ref(storage, fullPath);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error(`Error fetching image URL for ${fullPath}:`, error);
      return 'https://via.placeholder.com/150';
    }
  };

  return (
    <div className="flex bg-gray-200">
      <div className="min-h-screen flex">

      </div>
      {/* Table content */}

      <div className="ml-8 flex-1 pr-8">
        <div className="newContainer">
          <div className="top shadow-md py-2 px-4 my-4">
            <h1 className="text-gray-600 font-bold text-lg">Employee Summary</h1>
          </div>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto">
              <div className="flex justify-end items-center mb-4">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => navigate('/dashboard?tab=AddEmployee')}
                >
                  Add New Employee
                </button>
              </div>
              <table className="w-full sm:w-auto max-w-[90%] bg-white text-xs">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">First</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Last</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">NIC</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">DOB</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                    <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{employee._id}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.firstname}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.lastname}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.email}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.phone}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.nic}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{new Date(employee.dob).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.gender}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.address}</td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                        <img src={employee.imageUrl} alt="Employee" className="h-10 w-10 rounded-full" />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                        <div className="flex">
                          <Link to={`/ViewEmployee/${employee._id}`}>
                            <FaEye className="mr-2 cursor-pointer text-green-500 hover:text-green-700" />
                          </Link>

                          <FaEdit className="mr-2 cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => handleUpdate(employee._id)} />
                          <FaTrashAlt className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleDelete(employee._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

