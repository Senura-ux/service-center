import React from 'react';

const StatusProgressBar = ({ status }) => {
  // Define the order of statuses for progression
  const statusSteps = ['New', 'Accepted', 'In Progress', 'Completed'];
  
  // Special case for declined requests
  if (status === 'Declined') {
    return (
      <div className="w-full mt-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-red-700">Request Declined</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-red-600 h-2.5 rounded-full w-full"></div>
        </div>
      </div>
    );
  }
  
  // Find the current step index
  const currentStepIndex = statusSteps.indexOf(status);
  
  // Calculate progress percentage
  const progressPercentage = currentStepIndex >= 0 
    ? (currentStepIndex + 1) / statusSteps.length * 100 
    : 0;
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">Status: {status}</span>
        <span className="text-xs font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getStatusColor(status)}`} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs mt-1">
        {statusSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-3 h-3 rounded-full mb-1 ${
                index <= currentStepIndex 
                  ? getStatusDotColor(status) 
                  : 'bg-gray-300'
              }`}
            ></div>
            <span className={index <= currentStepIndex ? 'font-medium' : 'text-gray-400'}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'New':
      return 'bg-blue-600';
    case 'Accepted':
      return 'bg-yellow-500';
    case 'In Progress':
      return 'bg-yellow-600';
    case 'Completed':
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
};

const getStatusDotColor = (status) => {
  switch (status) {
    case 'New':
      return 'bg-blue-600';
    case 'Accepted':
      return 'bg-yellow-500';
    case 'In Progress':
      return 'bg-yellow-600';
    case 'Completed':
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
};

export default StatusProgressBar;