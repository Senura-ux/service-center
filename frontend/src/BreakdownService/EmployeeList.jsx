import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../BookingManagement/Spinner";
import { Link } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const EmployeeList = ({ position }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/employees")
      .then((response) => {
        // Filter employees by position if specified
        const filteredEmployees = position 
          ? response.data.filter(emp => emp.position.toLowerCase() === position.toLowerCase())
          : response.data;
        setEmployees(filteredEmployees);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  }, [position]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/empmanageRequests/${driverToDelete._id}`);
      setEmployees(employees.filter(emp => emp._id !== driverToDelete._id));
      setShowDeleteModal(false);
      setDriverToDelete(null);
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Driver Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Driver Name</th>
              <th className="py-3 px-4 text-left">Contact No</th>
              <th className="py-3 px-4 text-left">License No</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Experience</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{employee.employeeName}</td>
                <td className="py-3 px-4">{employee.contactNo}</td>
                <td className="py-3 px-4">{employee.licenseNo}</td>
                <td className="py-3 px-4">{employee.Age}</td>
                <td className="py-3 px-4">{new Date().getFullYear() - employee.joinedYear} years</td>
                <td className="py-3 px-4">{employee.email}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link to={`/dashboard/emp/employee/edit/${employee._id}`}>
                      <AiOutlineEdit className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer" />
                    </Link>
                    <AiOutlineDelete
                      className="text-xl text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => {
                        setDriverToDelete(employee);
                        setShowDeleteModal(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this driver?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
