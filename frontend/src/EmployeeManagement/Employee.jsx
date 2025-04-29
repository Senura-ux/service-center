import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [empmanageRequests, setEmpmanageRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await axios.get("http://localhost:5555/empmanageRequests");
        setEmpmanageRequests(result.data.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5555/empmanageRequests/${id}`);

      if (response.data.Status) {
        setEmpmanageRequests((prev) => prev.filter((e) => e._id !== id));
        alert("Record deleted successfully!");
      } else {
        alert("Failed to delete the record: " + (response.data.Error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error during delete:", err);
      alert("An error occurred while deleting the record.");
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter an Employee ID or Name to search.");
      return;
    }

    try {
      const searchQuery = /^[0-9a-fA-F]{24}$/.test(searchTerm)
        ? `employeeId=${searchTerm}`
        : `employeeName=${searchTerm}`;

      console.log("Searching with query:", searchQuery);

      const response = await axios.get(`http://localhost:5555/empmanageRequests/search?${searchQuery}`);

      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        alert("No results found.");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Error occurred while searching.");
    }
  };

  const renderTableRows = (data) => {
    return data.map((e) => (
      <tr key={e._id} className="border-b">
        <td className="p-3 border">{e._id}</td>
        <td className="p-3 border">{e.employeeName}</td>
        <td className="p-3 border">{e.email}</td>
        <td className="p-3 border">{e.contactNo}</td>
        <td className="p-3 border">{e.position}</td>
        <td className="p-3 border">{e.licenseNo}</td>
        <td className="p-3 border">{e.salary}</td>
        <td className="p-3 border">
          <Link
            to={`/dashboard/emp/edit_employee/` + e._id}
            className="bg-green-600 text-white rounded-md px-3 py-1 mr-2 hover:bg-green-500 transition-transform duration-300 transform hover:scale-105"
          >
            Edit
          </Link>
          <button
            className="bg-red-600 text-white rounded-md px-3 py-1 hover:bg-red-500 transition-transform duration-300 transform hover:scale-105 ml-2"
            onClick={() => handleDelete(e._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md overflow-x-auto">
      <div className="flex justify-center">
        <h3 className="text-center text-black text-2xl mb-5 font-bold uppercase tracking-wide border-b-2 border-black pb-2">
          Employee Record Details
        </h3>
      </div>

      {/* Search Bar */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by Employee ID or Name"
          className="border rounded-md px-3 py-2 mr-3 w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-500 transition-transform duration-300 transform hover:scale-105"
        >
          Search
        </button>
      </div>

      <Link
        to="/dashboard/emp/add_employee"
        className="bg-green-600 text-white rounded-md px-4 py-2 mb-5 hover:bg-green-500 transition-transform duration-300 transform hover:scale-105"
      >
        Add Employee
      </Link>

      {/* Display Search Results if available */}
      <div className="mt-3">
        <table className="w-full border-collapse border-separate border-spacing-0 shadow-lg bg-white rounded-lg">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="font-bold uppercase p-3">Employee ID</th>
              <th className="font-bold uppercase p-3">Name</th>
              <th className="font-bold uppercase p-3">Email</th>
              <th className="font-bold uppercase p-3">Contact Number</th>
              <th className="font-bold uppercase p-3">Position</th>
              <th className="font-bold uppercase p-3">License No</th>
              <th className="font-bold uppercase p-3">Salary</th>
              <th className="font-bold uppercase p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchResults !== null
              ? searchResults.length > 0
                ? renderTableRows(searchResults)
                : (
                  <tr>
                    <td colSpan="8" className="text-center p-4 text-gray-500">No search results found.</td>
                  </tr>
                )
              : renderTableRows(empmanageRequests)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
