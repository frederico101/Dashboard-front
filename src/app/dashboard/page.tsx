"use client";

import React from 'react';
import Weather from '@/components/Weather';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li className="mb-2"><a href="/dashboard" className="block p-2">Dashboard</a></li>
            <li className="mb-2"><a href="/profile" className="block p-2">Profile</a></li>
            <li className="mb-2"><a href="/admin" className="block p-2">Admin</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-2xl mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">Summary Card 1</div>
          <div className="bg-white p-4 rounded shadow">Summary Card 2</div>
          <div className="bg-white p-4 rounded shadow">Summary Card 3</div>
          <Weather />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;