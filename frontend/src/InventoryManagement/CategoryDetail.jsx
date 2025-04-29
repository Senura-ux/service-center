import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/categories/${id}`);
        setCategory(response.data);
      } catch (error) {
        setError('Failed to fetch category.');
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/categories/${id}`);
      navigate('/catagory');
    } catch (error) {
      setError('Failed to delete category.');
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdate = () => {
    navigate(`/categories/${id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
        Category Details
      </h1>

      {error && <div className="max-w-2xl mx-auto p-4 bg-red-50 border-l-4 border-red-500 rounded-lg mb-8">
        <p className="text-red-700">{error}</p>
      </div>}

      {category && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-800">
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
              <p className="text-red-100 text-sm mt-1">Code: {category.categoryCode}</p>
            </div>

            <div className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-2 text-gray-900">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-2 text-gray-900">{new Date(category.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-2 text-gray-900">{new Date(category.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Link to="/catagory">
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300">
                    Back
                  </button>
                </Link>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-300"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
