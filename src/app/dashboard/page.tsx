"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Weather from "@/components/Weather";
import BitcoinPrice from "@/components/BitcoinPrice";
import CovidData from "@/components/CovidData";
import NewsHeadlines from "@/components/NewsHeadlines";
import { Moon, Sun } from "lucide-react";

const DashboardPage: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Theme toggle effect
  useEffect(() => {
    // Check for user's preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
  
      // if (!token) {
      //   router.push("/login");
      //   return;
      // }
    console.log("token", token);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/protected",
          {}, // Empty body (if no data is required)
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setData(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          console.error("Backend Error:", err.response.data);
        } else {
          if (err instanceof Error) {
            console.error("Error:", err.message);
          } else {
            console.error("Unexpected error", err);
          }
        }
        setError("Failed to fetch data");
        setLoading(false);
        router.push("/login");
      }
    };
  
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900 dark:text-gray-100">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900 dark:text-gray-100">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex dark:bg-gray-900 transition-colors duration-200">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">Dashboard</h2>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <nav>
          <ul>
            <li className="mb-2"><a href="/dashboard" className="block p-2 rounded hover:bg-gray-700 transition-colors">Dashboard</a></li>
            <li className="mb-2"><a href="/profile" className="block p-2 rounded hover:bg-gray-700 transition-colors">Profile</a></li>
            <li className="mb-2"><a href="/admin" className="block p-2 rounded hover:bg-gray-700 transition-colors">Admin</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 dark:bg-gray-900 dark:text-gray-100">
        <h1 className="text-2xl mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow dark:shadow-gray-800">The Weather</div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow dark:shadow-gray-800">Finance</div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow dark:shadow-gray-800">Statistics</div>
          <Weather />
          <BitcoinPrice />
          <CovidData />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;