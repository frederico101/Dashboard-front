"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navigation: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // const payload = JSON.parse(atob(token.split(".")[1]));
        // // Verificar se o email é "fredyalves.fredyalves@hotmail.com" e definir a função como "admin"
        // if (payload.email === "fredyalves.fredyalves@hotmail.com") {
        //   setRole("admin");
        // } else {
        //   setRole(payload.role);
        // }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = async () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {role ? (
          <>
            <li><a href="/dashboard" className="block p-2">Dashboard</a></li>
            <li><a href="/profile" className="block p-2">Profile</a></li>
            {role === "admin" && (
              <li><a href="/admin" className="block p-2">Admin</a></li>
            )}
            <li><button onClick={() => router.push("/login")} className="block p-2">Login</button></li>
            <li><a href="/register" className="block p-2">Register</a></li>

          </>
        ) : (
          <>
            <li className="ml-auto"><button onClick={handleLogout} className="block p-2 float-right">Logout</button></li>

          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;