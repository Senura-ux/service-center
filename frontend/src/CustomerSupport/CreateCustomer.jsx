import React, { useState, useEffect } from "react";
import BackButton from "../BookingManagement/BackButton";
import Spinner from "../BookingManagement/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function ContactForm() {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isUserLoggedIn = () => {
    return localStorage.getItem("token") !== null; // Check for a token in localStorage
  };

  // Function to get the username from localStorage
  const getUsername = () => {
    return localStorage.getItem("username"); // Assuming the username is stored in localStorage
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
  
    // If no user is logged in, show a message and navigate to login
    if (!loggedInUser || !loggedInUser.username) {
      enqueueSnackbar("Please log in to make a Ticket", { variant: "error" });
      navigate("/login"); // Redirect to login page
      return;
    }
  
    // Set the customerName from the logged-in user's username
    setCustomerName(loggedInUser.username);
  }, [navigate, enqueueSnackbar]);

  useEffect(() => {
    if (category && priority) {
      calculateEstimatedTime(category, priority);
    }
  }, [category, priority]);

  const calculateEstimatedTime = (category, priority) => {
    let days;
    switch (category) {
      case "Service Booking":
        days = priority === "High" ? 2 : priority === "Medium" ? 4 : 8;
        break;
      case "Breakdown Service":
        days = priority === "High" ? 1 : priority === "Medium" ? 3 : 6;
        break;
      case "Online Store":
        days = priority === "High" ? 3 : priority === "Medium" ? 6 : 12;
        break;
      case "Sign up Issues":
        days = priority === "High" ? 4 : priority === "Medium" ? 8 : 16;
        break;
      case "Other":
        days = priority === "High" ? 5 : priority === "Medium" ? 10 : 20;
        break;
      default:
        days = 0;
    }

    const today = new Date();
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + days);

    const formattedDate = estimatedDate.toLocaleDateString();
    setEstimatedTime(`Approximately ${days} Days (${formattedDate})`);
  };
             // my validation part
             
  const validateVehicle = (vehicleNumber) => {
    const VehicleRegex = /^[A-Z]{2,3}-\d{4}$/;
    return VehicleRegex.test(vehicleNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (mobileNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(mobileNumber);
  };

  const handleSaveCustomer = () => {
    if (!customerName.trim()) {
      enqueueSnackbar("Please enter the customer's name", { variant: "error" });
      return;
    }

    if (!mobileNumber.trim() || !validateMobileNumber(mobileNumber)) {
      enqueueSnackbar("Please enter a valid 10-digit contact number", { variant: "error" });
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      enqueueSnackbar("Please enter a valid email address", { variant: "error" });
      return;
    }

    if (!vehicleNumber.trim() || !validateVehicle(vehicleNumber)) {
      enqueueSnackbar('Please enter a valid Vehicle Number (e.g., ABC-1234 or XYZ-5678).', { variant: 'error' });
      return;
    }

    if (!subject.trim()) {
      enqueueSnackbar("Please enter the subject", { variant: "error" });
      return;
    }

    if (!category.trim()) {
      enqueueSnackbar("Please select a category", { variant: "error" });
      return;
    }

    if (!priority.trim()) {
      enqueueSnackbar("Please select a priority", { variant: "error" });
      return;
    }

    const data = {
      customerName,
      mobileNumber,
      email,
      vehicleNumber,
      subject,
      category,
      priority,
      estimatedTime, 
    };

    setLoading(true);
    axios
      .post("http://localhost:5555/customer", data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Ticket Created Successfully", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        // Log error response
        console.error("Error details:", error.response?.data || error.message);
        enqueueSnackbar("Error occurred while creating the Ticket", { variant: "error" });
      });
  };

  // New handler for restricting non-numeric and limiting to 10 digits
  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
    }
  };

  const handleAdminDashboard = () => {
    navigate("/admin-dashboard");
  };

  const handleCustomerDashboard = () => {
    navigate("/customer-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <BackButton />
      {loading && <Spinner />}
      
      <div className="max-w-3xl mx-auto bg-white backdrop-blur-lg bg-opacity-80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-red-600 to-red-800">
          <h2 className="text-2xl font-bold text-white mb-2">Create Support Ticket</h2>
          <p className="text-red-100">Fill in the details below to create a new support ticket</p>
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
                onChange={handleMobileNumberChange}
                className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 pl-12 pr-4 py-3"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              placeholder="Enter your email address"
            />
          </div>

          {/* Vehicle Number Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-focus-within:text-red-600">
              Vehicle Number
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="form-input block w-full rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200 transition-all duration-200 px-4 py-3"
              placeholder="e.g., ABC-1234"
            />
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

          {/* Category Select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onClick={handleSaveCustomer}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg"
            >
              Create Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
