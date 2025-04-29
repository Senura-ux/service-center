import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';

const AddItemForm = () => {
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState({
    name: '',
    code: '',
    companyName: '',
    description: '',
    qty: 0,
    buyingPrice: 0,
    price: 0,
    category: '',
    photo: null, // Set initial value to null for file
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5555/categories');
        setCategories(response.data);
      } catch (error) {
        setError('Failed to fetch categories.');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear specific error
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItem((prev) => ({
        ...prev,
        photo: file, // Store the file object directly
      }));
      setErrors((prev) => ({ ...prev, photo: '' })); // Clear specific error
    }
  };

  // Validation Function
  const validateForm = () => {
    const newErrors = {};
  
    // Check if fields are filled out
    if (!item.name.trim()) newErrors.name = 'Name is required';
    if (item.name.length < 3) newErrors.name = 'Name must be at least 3 characters long';
    
    if (!item.code.trim()) newErrors.code = 'Code is required';
    if (item.code.length < 3) newErrors.code = 'Code must be at least 3 characters long';
    
    if (!item.companyName.trim()) newErrors.companyName = 'Company name is required';
    
    if (!item.description.trim()) newErrors.description = 'Description is required';
    
    if (item.qty <= 0) newErrors.qty = 'Quantity must be greater than 0';
    
    if (item.buyingPrice <= 0) newErrors.buyingPrice = 'Buying Price must be greater than 0';
    
    if (item.price <= 0) newErrors.price = 'Price must be greater than 0';
    //if (item.price <= item.buyingPrice) newErrors.price = 'Price must be higher than Buying Price';
    
    if (!item.category) newErrors.category = 'Please select a category';
    
    if (!item.photo) {
      newErrors.photo = 'Photo is required';
    } else if (item.photo.size > 1048576) {
      newErrors.photo = 'Photo size should not exceed 1MB';
    } else if (!/\.(jpg|jpeg|png)$/i.test(item.photo.name)) { // Validate file format
      newErrors.photo = 'Photo must be in JPG, JPEG, or PNG format';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation
    if (!validateForm()) return;

    // Create a FormData object
    const formData = new FormData();
    
    // Append fields to FormData
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }

    try {
      await axios.post('http://localhost:5555/inventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      alert('Item added successfully!');
      navigate('/dashboard/senura'); // Redirect to items list after successful addition
    } catch (error) {
      setError('Failed to add item.');
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className='flex'>
      <ManagerHeader />
      <div className="flex-1 relative min-h-screen">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 animate-gradient-slow"></div>
          <div className="absolute inset-0 opacity-50 bg-grid-pattern"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent animate-shimmer">
              Add New Item
            </h1>
            <p className="text-gray-600 mt-2">Enter the details of your new inventory item below</p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                        Item Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={item.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter item name"
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="code">
                        Item Code
                      </label>
                      <input
                        type="text"
                        id="code"
                        name="code"
                        value={item.code}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                          errors.code ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter item code"
                        required
                      />
                      {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="price">
                        Price (LKR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">LKR</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={item.price}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                            errors.price ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="qty">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="qty"
                        name="qty"
                        value={item.qty}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                          errors.qty ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter quantity"
                        required
                      />
                      {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={item.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                          errors.category ? 'border-red-500' : 'border-gray-200'
                        }`}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="photo">
                        Product Image
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200">
                          <div className="flex flex-col items-center justify-center pt-7">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                              Select a photo
                            </p>
                          </div>
                          <input 
                            type="file" 
                            id="photo"
                            name="photo"
                            className="opacity-0"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                      </div>
                      {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                    </div>
                  </div>
                </div>

                {/* Full Width Fields */}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={item.description}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full px-4 py-3 rounded-lg border-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter item description"
                      required
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
