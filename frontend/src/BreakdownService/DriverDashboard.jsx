import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { BiCar, BiMapPin, BiPhone, BiUser, BiCalendar } from 'react-icons/bi';

const DriverDashboard = () => {
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loggedInDriver, setLoggedInDriver] = useState(null);

  useEffect(() => {
    const fetchLoggedInDriverInfo = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.isDriver) {
        setLoggedInDriver(user);
        return user.username; // Driver's name
      }
      return null;
    };

    const driverName = fetchLoggedInDriverInfo();
    if (!driverName) {
      setError("Please log in as a driver to view this dashboard");
      setLoading(false);
      return;
    }

    const fetchAssignedRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5555/breakdownRequests');
        // Filter requests assigned to the logged-in driver
        const filteredRequests = response.data.data.filter(
          request => request.assignedDriver === driverName
        );
        setAssignedRequests(filteredRequests);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assigned requests:', err);
        setError('Failed to load your assigned requests. Please try again.');
        setLoading(false);
      }
    };

    fetchAssignedRequests();
  }, []);

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5555/breakdownRequests/${requestId}/status`, {
        status: newStatus
      });
      
      // Update the local state to reflect the change
      setAssignedRequests(prevRequests => 
        prevRequests.map(request => 
          request._id === requestId ? { ...request, status: newStatus } : request
        )
      );
      
      enqueueSnackbar(`Request status updated to ${newStatus}`, { variant: 'success' });
      
      // Send notification to customer via WhatsApp (you can modify this as needed)
      const request = assignedRequests.find(req => req._id === requestId);
      if (request) {
        const message = encodeURIComponent(`Your breakdown service request status has been updated to: ${newStatus}`);
        const phoneNumber = encodeURIComponent(request.contactNumber);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      }
    } catch (err) {
      console.error('Error updating request status:', err);
      enqueueSnackbar('Failed to update request status', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Driver Dashboard - {loggedInDriver?.username}
      </h1>
      
      {assignedRequests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No breakdown requests have been assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Request #{request._id.slice(-5)}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <BiUser className="text-red-500 mr-2" />
                    <span className="text-gray-700">{request.customerName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BiPhone className="text-red-500 mr-2" />
                    <span className="text-gray-700">{request.contactNumber}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BiCar className="text-red-500 mr-2" />
                    <span className="text-gray-700">{request.vehicleNumber}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BiMapPin className="text-red-500 mr-2" />
                    <span className="text-gray-700">{request.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <BiCalendar className="text-red-500 mr-2" />
                    <span className="text-gray-700">
                      {new Date(request.createdAt).toLocaleDateString()} at {' '}
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <p className="text-gray-600 font-medium">Update Status:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateRequestStatus(request._id, 'Accepted')}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      disabled={request.status === 'Accepted'}
                    >
                      Accept
                    </button>
                    
                    <button
                      onClick={() => updateRequestStatus(request._id, 'In Progress')}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      disabled={request.status === 'In Progress' || request.status === 'New'}
                    >
                      In Progress
                    </button>
                    
                    <button
                      onClick={() => updateRequestStatus(request._id, 'Completed')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      disabled={request.status === 'Completed' || request.status === 'New'}
                    >
                      Complete
                    </button>
                    
                    <button
                      onClick={() => updateRequestStatus(request._id, 'Declined')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      disabled={request.status === 'Declined' || request.status !== 'New'}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;