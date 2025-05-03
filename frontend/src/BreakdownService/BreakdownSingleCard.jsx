import { Link } from 'react-router-dom';
import { BiUserCircle, BiCar, BiPhone } from 'react-icons/bi';
import { AiFillInfoCircle, AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { useState, useEffect } from 'react';
import BreakdownModal from './BreakdownModal';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF
import { AiOutlineFilePdf } from 'react-icons/ai'; // Import PDF icon
import { PDFDownloadLink } from '@react-pdf/renderer';
import BreakdownReport from './BreakdownReport';

const BreakdownSingleCard = ({ breakdownRequest }) => {
  const [showModal, setShowModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [status, setStatus] = useState(localStorage.getItem(`status_${breakdownRequest._id}`) || breakdownRequest.status || 'New');
  const [driverError, setDriverError] = useState(false); // Track driver assignment errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5555/employees');
        const allEmployees = response.data;
        const driverList = allEmployees.filter(employee => employee.position === 'driver');
        setDrivers(driverList);

        const storedDriver = localStorage.getItem(`selectedDriver_${breakdownRequest._id}`);
        const isPending = localStorage.getItem(`driverError_${breakdownRequest._id}`) === 'true';
        if (storedDriver) {
          setSelectedDriver(storedDriver);
        }

        // Check if driver is pending and set state accordingly
        if (isPending) {
          setSelectedDriver('Pending');
          setDriverError(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [breakdownRequest._id]);

  const handleAssignDriver = async (event) => {
    const driverId = event.target.value;
    if (!driverId) return;

    const selectedDriverData = drivers.find(driver => driver._id === driverId);
    if (!selectedDriverData) return;

    try {
      // First check if driver has any existing assignments
      const response = await axios.get('http://localhost:5555/breakdownRequests');
      const existingAssignments = response.data.data.filter(request => 
        request.assignedDriver === selectedDriverData.employeeName &&
        (request.status === 'Accepted' || request.status === 'In Progress')
      );

      if (existingAssignments.length > 0) {
        alert(`${selectedDriverData.employeeName} is currently assigned to another active request. Please wait until they complete their current assignment or choose another driver.`);
        setSelectedDriver(''); // Reset selection
        setDriverError(true);
        localStorage.setItem(`driverError_${breakdownRequest._id}`, 'true');
        return;
      }

      // If no active assignments, proceed with assigning the driver
      const assignResponse = await axios.put(
        `http://localhost:5555/breakdownRequests/${breakdownRequest._id}/assign-driver`,
        { assignedDriver: selectedDriverData.employeeName }
      );

      alert(`Successfully assigned ${selectedDriverData.employeeName} to ${breakdownRequest.customerName}`);
      setSelectedDriver(driverId);
      setDriverError(false);
      localStorage.setItem(`selectedDriver_${breakdownRequest._id}`, driverId);
      localStorage.removeItem(`driverError_${breakdownRequest._id}`);
      
    } catch (error) {
      console.error('Error in driver assignment:', error);
      alert('There was an error assigning the driver. Please try again.');
      setSelectedDriver('');
      setDriverError(true);
    }
  };

  const updateStatusInDatabase = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:5555/breakdownRequests/${breakdownRequest._id}/status`, {
        status: newStatus,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusColorClasses = {
    New: 'bg-purple-500 text-white',
    Accepted: 'bg-blue-500 text-white',
    'In Progress': 'bg-yellow-500 text-white',
    Completed: 'bg-green-500 text-white',
    Declined: 'bg-red-500 text-white'
  };

  const isDriverAssignmentDisabled = () => {
    return ['Accepted', 'In Progress', 'Completed'].includes(status);
  };

  useEffect(() => {
    // Listen for status updates
    const checkStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/breakdownRequests/${breakdownRequest._id}`);
        const currentStatus = response.data.status;
        if (currentStatus !== status) {
          setStatus(currentStatus);
          localStorage.setItem(`status_${breakdownRequest._id}`, currentStatus);
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    // Check status every 30 seconds
    const intervalId = setInterval(checkStatus, 30000);
    return () => clearInterval(intervalId);
  }, [breakdownRequest._id, status]);

  return (
    <div
      className="border-2 border-gray-500 rounded-lg px-6 py-4 m-4 relative hover:shadow-xl"
      style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '600px' }}
    >
      <h2
        className={`absolute top-1 right-2 px-4 py-1 rounded-lg ${statusColorClasses[status]}`}
      >
        {status}
      </h2>
      
      <div className="flex justify-start items-center gap-x-2">
        <BiUserCircle className="text-red-300 text-2xl" />
        <h2 className="my-1">{breakdownRequest.customerName}</h2>
      </div>
      <div className="flex justify-start items-center gap-x-2">
        <BiCar className="text-red-300 text-2xl" />
        <h2 className="my-1">{breakdownRequest.vehicleNumber}</h2>
      </div>
      <div className="flex justify-start items-center gap-x-2">
        <BiPhone className="text-red-300 text-2xl" />
        <h2 className="my-1">{breakdownRequest.contactNumber}</h2>
      </div>

      <div className="mt-4">
        <label className="text-lg font-semibold">Assign Driver:</label>
        <select
          value={selectedDriver}
          onChange={handleAssignDriver}
          disabled={isDriverAssignmentDisabled()}
          className={`border rounded px-2 py-1 ${driverError ? 'bg-yellow-200' : ''} 
            ${isDriverAssignmentDisabled() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          style={{ width: '200px', maxWidth: '100%' }}
        >
          <option value="">Select a driver</option>
          {drivers.map((driver) => (
            <option key={driver._id} value={driver._id}>
              {driver.employeeName} {driverError && selectedDriver === 'Pending' ? '(Pending)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center gap-x-2 mt-4 p-4">
        <Link to={`/breakdownRequests/details/${breakdownRequest._id}`}>
          <AiFillInfoCircle className="text-2xl text-blue-500 hover:text-black" />
        </Link>
        <Link to={`/breakdownRequests/edit/${breakdownRequest._id}`}>
          <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-black" />
        </Link>
        <Link to={`/breakdownRequests/delete/${breakdownRequest._id}`}>
          <MdOutlineDelete className="text-2xl text-red-600 hover:text-black" />
        </Link>
        <PDFDownloadLink
          document={<BreakdownReport breakdownRequest={breakdownRequest} />}
          fileName={`BreakdownReport_${breakdownRequest._id}.pdf`}
        >
           {({ loading }) => (
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <AiOutlineFilePdf className="text-2xl text-green-500 hover:text-black" />
        {loading && <span style={{ marginLeft: '4px' }}>Loading...</span>}
      </div>
    )}
        </PDFDownloadLink>
      </div>

      {showModal && (
        <BreakdownModal breakdownRequest={breakdownRequest} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default BreakdownSingleCard;
