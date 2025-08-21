import React from 'react';
import Sidebar from '../components/Sidebar';

const LayoutBase = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutBase;
