"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ApiStatusBadge from "@/components/ApiStatusBadge";

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

// Define API service type
interface ApiService {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [apiServices, setApiServices] = useState<ApiService[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for admin access
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUsers();
    fetchApiStatus();
    
    // Check theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, [router]);

  // Mock function to fetch users - replace with actual API call
  const fetchUsers = async () => {
    // In a real app, fetch from your API
    // Mock data for demonstration
    setUsers([
      { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", status: "active" },
      { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "user", status: "inactive" },
    ]);
  };

 // Mock function to fetch API status - replace with actual API call
  const fetchApiStatus = async () => {
    // In a real app, fetch from your API monitoring endpoints
    // Mock data for demonstration
    setApiServices([
      { name: "Authentication API", status: "healthy", latency: 42 },
      { name: "Weather API", status: "degraded", latency: 230 },
      { name: "Bitcoin API", status: "healthy", latency: 85 },
      { name: "News API", status: "down", latency: 500 },
    ]);
    
    setLoading(false);
  };

  // Mock function to toggle user status
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900 dark:text-gray-100">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark:bg-gray-900 dark:text-gray-100' : ''}`}>
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">Admin</h2>
        </div>
        <nav>
          <ul>
            <li className="mb-2"><a href="/dashboard" className="block p-2 rounded hover:bg-gray-700 transition-colors">Dashboard</a></li>
            <li className="mb-2"><a href="/profile" className="block p-2 rounded hover:bg-gray-700 transition-colors">Profile</a></li>
            <li className="mb-2 bg-gray-700"><a href="/admin" className="block p-2 rounded transition-colors">Admin</a></li>
          </ul>
        </nav>
      </aside>
      
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* User Management Panel */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`px-3 py-1 rounded text-white ${user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* System Status Monitoring */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">CPU Usage</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: "35%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
                <div className="text-right text-sm">35%</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Memory Usage</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: "72%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
                <div className="text-right text-sm">72%</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Disk Space</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: "52%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                </div>
                <div className="text-right text-sm">52%</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Network</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: "18%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                </div>
                <div className="text-right text-sm">18%</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* API Integration Health Checks */}
        <section>
          <h2 className="text-xl font-semibold mb-4">API Integration Health</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">API Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Latency</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {apiServices.map((service) => (
                  <tr key={service.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ApiStatusBadge status={service.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {service.latency} ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">
                        Refresh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}