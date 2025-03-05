"use client";

import React, { useEffect } from "react";

const LogoutPage: React.FC = () => {
  useEffect(() => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    window.location.href = "/login";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Logging out...</h1>
      </div>
    </div>
  );
};

export default LogoutPage;