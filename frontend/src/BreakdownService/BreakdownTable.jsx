import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import StatusProgressBar from './StatusProgressBar';
import axios from 'axios';

const BreakdownTable = ({ breakdownRequests: initialBreakdownRequests, loading }) => {
  const [breakdownRequests, setBreakdownRequests] = useState(initialBreakdownRequests);
  
  // Poll for updates every 30 seconds
  useEffect(() => {
    setBreakdownRequests(initialBreakdownRequests);
    
    const pollInterval = setInterval(async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        
        const response = await axios.get('http://localhost:5555/breakdownRequests');
        const filteredBreakdowns = response.data.data.filter(
          (breakdownRequest) => breakdownRequest.customerName === user.username
        );
        
        setBreakdownRequests(filteredBreakdowns);
      } catch (error) {
        console.error('Error polling for breakdown updates:', error);
      }
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, [initialBreakdownRequests]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="border-b-2 border-red-600 p-3 text-left text-l">No</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l">Customer Name</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l">Contact Number</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l max-md:hidden">Vehicle Number</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l max-md:hidden">Location</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l max-md:hidden">Issue Type</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l max-md:hidden">Assigned Driver</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l">Status</th>
            <th className="border-b-2 border-red-600 p-3 text-left text-l">Operations</th>
          </tr>
        </thead>
        <tbody>
          {breakdownRequests.map((request, index) => (
            <tr className="even:bg-gray-100 odd:bg-white transition duration-200 hover:bg-gray-200" key={request._id}>
              <td className="border-b border-gray-300 p-4 text-left">{index + 1}</td>
              <td className="border-b border-gray-300 p-4 text-left">{request.customerName}</td>
              <td className="border-b border-gray-300 p-4 text-left">{request.contactNumber}</td>
              <td className="border-b border-gray-300 p-4 text-left max-md:hidden">{request.vehicleNumber}</td>
              <td className="border-b border-gray-300 p-4 text-left max-md:hidden">{request.location}</td>
              <td className="border-b border-gray-300 p-4 text-left max-md:hidden">{request.issueType}</td>
              <td className="border-b border-gray-300 p-4 text-left max-md:hidden">{request.assignedDriver || 'Not Assigned'}</td>
              <td className="border-b border-gray-300 p-4 text-left">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                  {request.status || 'New'}
                </span>
                <StatusProgressBar status={request.status || 'New'} />
              </td>
              <td className="border-b border-gray-300 p-4 text-left">
                <div className="flex justify-start gap-x-4">
                  <Link to={`/breakdownRequests/details/${request._id}`}>
                    <BsInfoCircle className="text-2xl text-green-800" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800';
    case 'Accepted':
      return 'bg-yellow-100 text-yellow-800';
    case 'In Progress':
      return 'bg-yellow-300 text-yellow-900';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Declined':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default BreakdownTable;
