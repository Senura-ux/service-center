import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function AddDriver() {
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [age, setAge] = useState('');
  const [joinedYear, setJoinedYear] = useState(new Date().getFullYear());
  const [licenseNo, setLicenseNo] = useState('');
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { enqueueSnackbar } = useSnackbar();
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactError, setContactError] = useState('');
  const [licenseError, setLicenseError] = useState('');

  // Validation functions
  const validateName = (name) => {
    if (name.length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateContact = (contact) => {
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contact)) {
      setContactError('Contact number must be 10 digits');
      return false;
    }
    setContactError('');
    return true;
  };

  const validateLicense = (license) => {
    const licenseRegex = /^[A-Z0-9]{6,12}$/i;
    if (!licenseRegex.test(license)) {
      setLicenseError('License must be 6-12 alphanumeric characters');
      return false;
    }
    setLicenseError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName(employeeName);
    const isEmailValid = validateEmail(email);
    const isContactValid = validateContact(contactNo);
    const isLicenseValid = validateLicense(licenseNo);
    
    if (!(isNameValid && isEmailValid && isContactValid && isLicenseValid)) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }
    
    // Prepare data for submission
    const driverData = {
      employeeName,
      email,
      password,
      contactNo,
      Age: parseInt(age),
      joinedYear: parseInt(joinedYear),
      position: 'driver',
      licenseNo,
      salary: parseInt(salary)
    };
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5555/empmanageRequests', driverData);
      setLoading(false);
      enqueueSnackbar('Driver added successfully', { variant: 'success' });
      
      // Reset form
      setEmployeeName('');
      setEmail('');
      setPassword('');
      setContactNo('');
      setAge('');
      setJoinedYear(new Date().getFullYear());
      setLicenseNo('');
      setSalary('');
      
    } catch (error) {
      setLoading(false);
      console.error('Error adding driver:', error);
      enqueueSnackbar('Error adding driver', { variant: 'error' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Add New Driver</h2>
      
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver Name*
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => {
                setEmployeeName(e.target.value);
                validateName(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number*
            </label>
            <input
              type="text"
              value={contactNo}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow digits and limit to 10 characters
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setContactNo(value);
                  validateContact(value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="10 digits"
              required
            />
            {contactError && <p className="text-red-500 text-xs mt-1">{contactError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age*
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="18"
              max="65"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Joined Year*
            </label>
            <input
              type="number"
              value={joinedYear}
              onChange={(e) => setJoinedYear(e.target.value)}
              min="2000"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number*
            </label>
            <input
              type="text"
              value={licenseNo}
              onChange={(e) => {
                setLicenseNo(e.target.value);
                validateLicense(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            {licenseError && <p className="text-red-500 text-xs mt-1">{licenseError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary (Rs)*
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              min="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            Add Driver
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDriver;