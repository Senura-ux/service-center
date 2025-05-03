import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../BookingManagement/Spinner";
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { BsEyeFill } from 'react-icons/bs';
import { useSnackbar } from 'notistack';

const EmployeeList = ({ position }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverStatus, setDriverStatus] = useState({ status: 'free', requestId: null });
  const { enqueueSnackbar } = useSnackbar();

  const [editForm, setEditForm] = useState({
    employeeName: '',
    email: '',
    password: '', // Add password field
    contactNo: '',
    Age: '',
    licenseNo: '',
    joinedYear: '',
    salary: '',
    position: 'driver' // Add position field with default value
  });

  const [formErrors, setFormErrors] = useState({
    employeeName: '',
    email: '',
    contactNo: '',
    Age: '',
    licenseNo: '',
    joinedYear: '',
    salary: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactNumber = (number) => {
    const numberRegex = /^\d{10}$/;
    return numberRegex.test(number);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      employeeName: '',
      email: '',
      contactNo: '',
      Age: '',
      licenseNo: '',
      joinedYear: '',
      salary: ''
    };

    // Name validation
    if (!editForm.employeeName?.toString().trim()) {
      errors.employeeName = 'Driver name is required';
      isValid = false;
    }

    // Email validation
    if (!editForm.email?.toString().trim()) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!validateEmail(editForm.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Contact number validation
    if (!editForm.contactNo?.toString().trim()) {
      errors.contactNo = 'Contact number is required';
      isValid = false;
    } else if (!validateContactNumber(editForm.contactNo.toString())) {
      errors.contactNo = 'Contact number must be exactly 10 digits';
      isValid = false;
    }

    // Age validation
    if (!editForm.Age) {
      errors.Age = 'Age is required';
      isValid = false;
    } else {
      const ageNum = Number(editForm.Age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        errors.Age = 'Age must be between 18 and 65';
        isValid = false;
      }
    }

    // License number validation
    if (!editForm.licenseNo?.toString().trim()) {
      errors.licenseNo = 'License number is required';
      isValid = false;
    } else if (editForm.licenseNo.toString().length < 6) {
      errors.licenseNo = 'License number must be at least 6 characters';
      isValid = false;
    }

    // Joined year validation
    if (!editForm.joinedYear) {
      errors.joinedYear = 'Joined year is required';
      isValid = false;
    } else {
      const yearNum = Number(editForm.joinedYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear) {
        errors.joinedYear = `Year must be between 2000 and ${currentYear}`;
        isValid = false;
      }
    }

    // Salary validation
    if (!editForm.salary) {
      errors.salary = 'Salary is required';
      isValid = false;
    } else {
      const salaryNum = Number(editForm.salary);
      if (isNaN(salaryNum) || salaryNum < 0) {
        errors.salary = 'Salary must be a positive number';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
    
    // Clear existing error for this field
    setFormErrors(prev => ({ ...prev, [field]: '' }));

    // Real-time validation
    if (!value?.toString().trim()) {
      setFormErrors(prev => ({ ...prev, [field]: 'This field is required' }));
    } else {
      switch (field) {
        case 'email':
          if (!validateEmail(value)) {
            setFormErrors(prev => ({ ...prev, email: 'Invalid email' }));
          }
          break;
        case 'contactNo':
          if (!validateContactNumber(value.toString())) {
            setFormErrors(prev => ({ ...prev, contactNo: 'Invalid phone number, it should contain 10 digits' }));
          }
          break;
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/employees")
      .then((response) => {
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

  const handleEdit = (driver) => {
    setDriverToEdit(driver);
    setEditForm({
      employeeName: driver.employeeName,
      email: driver.email,
      password: driver.password || '', // Include password if available
      contactNo: driver.contactNo,
      Age: driver.Age,
      licenseNo: driver.licenseNo,
      joinedYear: driver.joinedYear,
      salary: driver.salary,
      position: 'driver' // Always set position as driver
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      enqueueSnackbar('Please correct the errors in the form', { variant: 'error' });
      return;
    }

    try {
      // Include all required fields in the update payload
      const updatePayload = {
        ...editForm,
        position: 'driver', // Ensure position is included
        password: editForm.password || driverToEdit.password // Use existing password if not changed
      };

      await axios.put(`http://localhost:5555/empmanageRequests/${driverToEdit._id}`, updatePayload);
      const updatedEmployees = employees.map(emp => 
        emp._id === driverToEdit._id ? { ...emp, ...updatePayload } : emp
      );
      setEmployees(updatedEmployees);
      setShowEditModal(false);
      enqueueSnackbar('Driver updated successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error updating driver:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error updating driver', { variant: 'error' });
    }
  };

  const handleView = async (driver) => {
    setSelectedDriver(driver);
    // Check if driver is assigned to any active breakdown request
    try {
      const response = await axios.get('http://localhost:5555/breakdownRequests');
      const activeRequest = response.data.data.find(
        request => request.assignedDriver === driver.employeeName && 
        ['New', 'Accepted', 'In Progress'].includes(request.status)
      );
      
      if (activeRequest) {
        setDriverStatus({
          status: 'assigned',
          requestId: activeRequest._id
        });
      } else {
        setDriverStatus({
          status: 'free',
          requestId: null
        });
      }
      setShowViewModal(true);
    } catch (error) {
      console.error('Error checking driver status:', error);
      enqueueSnackbar('Error checking driver status', { variant: 'error' });
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
                    <BsEyeFill
                      className="text-xl text-green-500 hover:text-green-700 cursor-pointer"
                      onClick={() => handleView(employee)}
                    />
                    <AiOutlineEdit 
                      className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer"
                      onClick={() => handleEdit(employee)}
                    />
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col" style={{ width: '500px', height: '80vh' }}>
            <h3 className="text-lg font-semibold mb-4">Edit Driver Details</h3>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editForm.employeeName}
                    onChange={(e) => handleInputChange('employeeName', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.employeeName ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:outline-none`}
                  />
                  {formErrors.employeeName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.employeeName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:outline-none`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep existing)</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter only if changing password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    value={editForm.contactNo}
                    onChange={(e) => handleInputChange('contactNo', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.contactNo ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:outline-none`}
                  />
                  {formErrors.contactNo && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.contactNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    value={editForm.Age}
                    onChange={(e) => handleInputChange('Age', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.Age ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:outline-none`}
                  />
                  {formErrors.Age && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.Age}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    value={editForm.licenseNo}
                    onChange={(e) => handleInputChange('licenseNo', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.licenseNo ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:outline-none`}
                  />
                  {formErrors.licenseNo && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.licenseNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined Year</label>
                  <input
                    type="number"
                    value={editForm.joinedYear}
                    onChange={(e) => handleInputChange('joinedYear', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.joinedYear ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:outline-none`}
                  />
                  {formErrors.joinedYear && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.joinedYear}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary</label>
                  <input
                    type="number"
                    value={editForm.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.salary ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:outline-none`}
                  />
                  {formErrors.salary && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t">
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* View Modal */}
      {showViewModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Driver Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{selectedDriver.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{selectedDriver.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact:</span>
                <span>{selectedDriver.contactNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">License No:</span>
                <span>{selectedDriver.licenseNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Age:</span>
                <span>{selectedDriver.Age}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Experience:</span>
                <span>{new Date().getFullYear() - selectedDriver.joinedYear} years</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Joined Year:</span>
                <span>{selectedDriver.joinedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Salary:</span>
                <span>Rs. {selectedDriver.salary}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  driverStatus.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {driverStatus.status === 'assigned' ? (
                    <>
                      Assigned to Request #{driverStatus.requestId?.slice(-5)}
                    </>
                  ) : 'Available'}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
