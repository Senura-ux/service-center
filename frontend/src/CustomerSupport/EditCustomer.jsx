import React, { useState, useEffect } from 'react';
import BackButton from '../BookingManagement/BackButton';
import Spinner from '../BookingManagement/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditCustomer = () => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [vehicleError, setVehicleError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/customer/${id}`)
      .then((response) => {
        const { customerName, email, mobileNumber, vehicleNumber, subject, category, priority, estimatedTime } = response.data;
        setCustomerName(customerName);
        setEmail(email);
        setMobileNumber(mobileNumber);
        setVehicleNumber(vehicleNumber);
        setSubject(subject);
        setCategory(category);
        setPriority(priority);
        setEstimatedTime(estimatedTime);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        enqueueSnackbar('An error occurred while fetching customer details', { variant: 'error' });
        console.error(error);
      });
  }, [id, enqueueSnackbar]);

  // Real-time validation handlers
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const validateMobileNumber = (mobileNumber) => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setMobileError("Mobile number must be 10 digits");
    } else {
      setMobileError("");
    }
  };

  const validateVehicleNumber = (vehicleNumber) => {
    const VehicleRegex = /^[A-Z]{2,3}-\d{4}$/;
    if (!vehicleRegex.test(vehicleNumber)) {
      setVehicleError("Invalid vehicle number format (ABC-1234)");
    } else {
      setVehicleError("");
    }
  };

  const handleEditCustomer = () => {
    if (emailError || mobileError || vehicleError) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }

    const data = {
      customerName,
      email,
      mobileNumber,
      vehicleNumber,
      subject,
      category,
      priority,
      estimatedTime,
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/customer/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ticket edited successfully', { variant: 'success' });
        navigate(-1);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('An error occurred while editing the Ticket', { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <BackButton />
      {loading && <Spinner />}
      <div className="max-w-3xl mx-auto bg-white backdrop-blur-lg bg-opacity-80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-red-600 to-red-800">
          <h2 className="text-2xl font-bold text-white mb-2">Edit Support Ticket</h2>
          <p className="text-red-100">Update the details of your support ticket</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Customer Name Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              readOnly
            />
          </div>

          {/* Contact Number Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
              Contact Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+94</span>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  validateMobileNumber(e.target.value);
                }}
                className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 pl-12 pr-4 py-3"
                placeholder="Enter your phone number"
              />
            </div>
            {mobileError && <p className="mt-1 text-sm text-red-600">{mobileError}</p>}
          </div>

          {/* Email Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              placeholder="Enter your email address"
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          {/* Vehicle Number Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
              Vehicle Number
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(e.target.value);
                validateVehicleNumber(e.target.value);
              }}
              className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              placeholder="e.g., ABC-1234"
            />
            {vehicleError && <p className="mt-1 text-sm text-red-600">{vehicleError}</p>}
          </div>

          {/* Subject Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              >
                <option value="">Select Category</option>
                <option value="Service Booking">Service Booking</option>
                <option value="Breakdown Service">Breakdown Service</option>
                <option value="Online Store">Online Store</option>
                <option value="Sign up Issues">Sign up Issues</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Estimated Time Display */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estimated Resolution Time
            </label>
            <div className="text-gray-600 font-medium">
              {estimatedTime || "Select category and priority to see estimate"}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleEditCustomer}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
            >
              Update Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCustomer;
