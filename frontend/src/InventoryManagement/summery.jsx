import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { useReactToPrint } from 'react-to-print';

const InventorySummaryReport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportDateTime, setReportDateTime] = useState(''); // State to store the report generation date and time

  const reportRef = useRef(); // Reference for generating PDF

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5555/inventory-items');
        setItems(response.data);
        setLoading(false);
        setReportDateTime(new Date().toLocaleString()); // Set the date and time when the data is fetched
      } catch (error) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Function to calculate profit and totals
  const calculateSummary = () => {
    const summary = {};

    items.forEach(item => {
      const { category, name, qty, buyingPrice, price } = item;
      const total = qty * buyingPrice;
      const profit = (price - buyingPrice) * qty;

      if (!summary[category.name]) {
        summary[category.name] = {
          items: [],
          categoryTotal: 0,
          categoryProfit: 0,
        };
      }

      summary[category.name].items.push({
        name,
        qty,
        buyingPrice,
        price,
        total,
        profit,
      });

      summary[category.name].categoryTotal += total;
      summary[category.name].categoryProfit += profit;
    });

    return summary;
  };

  // Handle print and download PDF
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: 'Inventory Summary Report',
  });

  const summary = calculateSummary();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='flex'>
      <ManagerHeader />
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
              Inventory Summary Report
            </h1>
            <p className="text-gray-600">
              <span className="font-semibold">Report Generated:</span> {reportDateTime}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>

        <div ref={reportRef} className="space-y-8">
          {Object.keys(summary).map((category) => (
            <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-800">
                <h2 className="text-xl font-bold text-white">{category}</h2>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Item Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Buying Price (LKR)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Selling Price (LKR)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total Cost (LKR)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Profit (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {summary[category].items.map((item, index) => (
                        <tr 
                          key={index}
                          className={`hover:bg-gray-50 transition-colors ${
                            item.qty < 3 ? 'bg-red-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">{item.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.qty < 3 ? 'bg-red-100 text-red-800' : 
                              item.qty < 10 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.qty}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.buyingPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.total.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">{item.profit.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Category Total Cost:</span>
                    <span className="text-lg font-bold text-gray-800">
                      LKR {summary[category].categoryTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Category Total Profit:</span>
                    <span className="text-lg font-bold text-green-600">
                      LKR {summary[category].categoryProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Low Stock Items Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-red-600">
              <h2 className="text-xl font-bold text-white">Low Stock Alert</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items
                  .filter(item => item.qty < 3)
                  .map(item => (
                    <div 
                      key={item._id} 
                      className="bg-red-50 rounded-lg p-4 border border-red-100 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-red-800">{item.name}</h3>
                        <p className="text-sm text-red-600">Quantity: {item.qty}</p>
                      </div>
                      <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-1 rounded-full">
                        Low Stock
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummaryReport;
