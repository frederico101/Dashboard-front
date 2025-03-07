"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Navigation: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null means loading
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (token) {
        setIsLoggedIn(true);
        if (storedRole) {
          setRole(storedRole.trim().toLowerCase());
        }
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    router.push("/login"); // Redirect before clearing storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  // If the login status is still loading (null), render a loading message
  if (isLoggedIn === null) {
    return <div>Loading...</div>; // Or a spinner or some loading UI
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {isLoggedIn ? (
          <>
            <li><Link href="/dashboard" className="block p-2">Dashboard</Link></li>
            <li><Link href="/profile" className="block p-2">Profile</Link></li>
            {role === "admin" && (
              <li><Link href="/admin" className="block p-2">Admin</Link></li>
            )}
            <li className="ml-auto">
              <button onClick={handleLogout} className="block p-2">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login" className="block p-2">Login</Link></li>
            <li><Link href="/register" className="block p-2">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
