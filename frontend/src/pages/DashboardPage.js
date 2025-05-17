import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Team Dev Trooper" />
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;