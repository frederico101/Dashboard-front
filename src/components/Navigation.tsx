"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navigation: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Send a request to verify if the token is still valid
      const verifyToken = async () => {
        try {
          const verifyResponse = await fetch("http://127.0.0.1:8000/api/users/user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (verifyResponse.ok) {
            // Token is valid, user is logged in
            const data = await verifyResponse.json();
            setIsLoggedIn(true);
            setRole(data.role || null); // Assuming your API response includes the user's role
          } else {
            // Token is invalid or expired, clear token from localStorage
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Failed to verify token:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      };

      verifyToken();
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {isLoggedIn ? (
          <>
            <li><a href="/dashboard" className="block p-2">Dashboard</a></li>
            <li><a href="/profile" className="block p-2">Profile</a></li>
            {role === "admin" && (
              <li><a href="/admin" className="block p-2">Admin</a></li>
            )}
            <li className="ml-auto">
              <button onClick={handleLogout} className="block p-2">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><a href="/login" className="block p-2">Login</a></li>
            <li><a href="/register" className="block p-2">Register</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
