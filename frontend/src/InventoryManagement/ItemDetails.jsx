import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemDetailsssss = () => {
  const { id } = useParams(); // Get item ID from URL
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [updatedItem, setUpdatedItem] = useState({}); // For handling updates
  const [categories, setCategories] = useState([]); // To store available categories
  const [formErrors, setFormErrors] = useState({}); // For storing validation errors

  // Fetch item details and available categories
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const itemResponse = await axios.get(`http://localhost:5555/inventory-items/${id}`);
        setItem(itemResponse.data);
        setUpdatedItem(itemResponse.data); // Initialize with fetched data

        const categoriesResponse = await axios.get('http://localhost:5555/categories');
        setCategories(categoriesResponse.data); // Set available categories
      } catch (error) {
        setError('Error fetching item or category details');
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/inventory-items/${id}`);
      alert('Item deleted successfully');
      navigate('/dashboard/senura'); // Redirect back to the inventory list
    } catch (error) {
      alert('Error deleting item');
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!updatedItem.name) errors.name = 'Name is required';
    if (!updatedItem.price || updatedItem.price < 0) errors.price = 'Price must be a non-negative number';
    if (!updatedItem.qty || updatedItem.qty < 0) errors.qty = 'Quantity must be a non-negative number';
    if (!updatedItem.description) errors.description = 'Description is required';
    if (!updatedItem.companyName) errors.companyName = 'Company name is required';
    if (!updatedItem.category) errors.category = 'Category is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleUpdate = async () => {
    if (!validateForm()) return; // Only proceed if the form is valid

    try {
      await axios.put(`http://localhost:5555/inventory-items/${id}`, updatedItem);
      alert('Item updated successfully');
      setShowModal(false); // Close the modal after successful update
      navigate(`/items/${id}`); // Refresh item details page after update
    } catch (error) {
      alert('Error updating item');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem({ ...updatedItem, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' }); // Clear error for this field
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find((cat) => cat._id === e.target.value);
    setUpdatedItem({ ...updatedItem, category: selectedCategory });
    setFormErrors({ ...formErrors, category: '' }); // Clear category error
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 animate-gradient-slow"></div>
        <div className="absolute inset-0 opacity-50 bg-grid-pattern"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          Item Details
        </h1>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        ) : !item ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {item.photo && (
                <div className="relative h-96 group">
                  <img
                    src={`data:image/jpeg;base64,${item.photo}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={item.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  {item.name}
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price</span>
                    <span className="text-2xl font-bold text-red-600">LKR {item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stock</span>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      item.qty < 3 ? 'bg-red-100 text-red-800' : 
                      item.qty < 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.qty} units
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details and Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold mb-4">Item Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="text-gray-800">{item.description}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Company</label>
                    <p className="text-gray-800">{item.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Category</label>
                    <p className="text-gray-800">{item.category?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-300"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Update Item
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={updatedItem.name || ''}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          formErrors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">LKR</span>
                        <input
                          type="number"
                          name="price"
                          value={updatedItem.price || ''}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                            formErrors.price ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        name="qty"
                        value={updatedItem.qty || ''}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          formErrors.qty ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {formErrors.qty && <p className="text-red-500 text-sm mt-1">{formErrors.qty}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        value={updatedItem.category?._id || ''}
                        onChange={handleCategoryChange}
                        className={`mt-1 block w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          formErrors.category ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                    </div>
                  </div>
                </div>

                {/* Full width fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={updatedItem.description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300"
                  >
                    Update Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailsssss;
