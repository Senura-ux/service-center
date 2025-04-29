import React, { useState } from 'react';
import ManagerHeader from '../InventoryManagement/managerHeader';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddCategoryForm = () => {
  const [categoryCode, setCategoryCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await axios.post('http://localhost:5555/categories', {
        categoryCode,
        name,
        description
      });
      alert('Category added successfully!');
      // Reset form
      setCategoryCode('');
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  return (
    <div className='flex'>
      <ManagerHeader />
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Add New Category
            </h1>
            <p className="text-gray-600 mt-2">Create a new category for inventory items</p>
          </div>

          {statusMessage && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700">{statusMessage}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="categoryCode">
                    Category Code
                  </label>
                  <input
                    type="text"
                    id="categoryCode"
                    value={categoryCode}
                    onChange={(e) => setCategoryCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                    placeholder="Enter category code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                    placeholder="Enter category description"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Link to="/catagory">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;
