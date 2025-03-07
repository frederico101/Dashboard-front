"use client"
import React from 'react';

const ApiStatusBadge: React.FC<{status: 'healthy' | 'degraded' | 'down'}> = ({ status }) => {
  if (status === 'healthy') {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <div className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></div>
        Healthy
      </div>
    );
  }
  
  if (status === 'degraded') {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <div className="w-2 h-2 mr-1.5 rounded-full bg-yellow-500"></div>
        Degraded
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
      <div className="w-2 h-2 mr-1.5 rounded-full bg-red-500"></div>
      Down
    </div>
  );
};

export default ApiStatusBadge;