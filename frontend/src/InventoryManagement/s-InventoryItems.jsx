import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ManagerHeader from '../InventoryManagement/managerHeader';

const SenuraInventoryItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // For displaying filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // To store the search query

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5555/inventory-items');
        setItems(response.data);
        setFilteredItems(response.data); // Initialize filtered items
        setLoading(false);
      } catch (error) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter items based on the search query
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-6">{error}</div>;
  }

  return (
    <div className="flex">
      <ManagerHeader />
      <div className="container mx-auto p-8 bg-gray-50">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="w-72 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 pl-12"
              value={searchQuery}
              onChange={handleSearch}
            />
            <span className="absolute left-4 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <Link to={`/items/${item._id}`} className="block">
                {item.photo && (
                  <div className="relative h-64 rounded-t-2xl overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${item.photo}`}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                      alt={item.name}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h5 className="text-xl font-bold text-white">{item.name}</h5>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800">LKR {item.price.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.qty < 3 ? 'bg-red-100 text-red-800' : 
                      item.qty < 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      Stock: {item.qty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Category: {item.category?.name || 'N/A'}</span>
                    <span>{item.companyName}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600">No items found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SenuraInventoryItems;
