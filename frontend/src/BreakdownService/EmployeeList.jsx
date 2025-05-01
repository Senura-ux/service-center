import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../BookingManagement/Spinner";

const EmployeeList = ({ position }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
