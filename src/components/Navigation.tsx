"use client";

import { signIn } from "next-auth/react";
import React from "react";

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><a href="/dashboard" className="block p-2">Dashboard</a></li>
        <li><a href="/register" className="block p-2">Register</a></li>
        <li>
          <a
            href="#"
            className="block p-2"
            onClick={(e) => {
              e.preventDefault();
              signIn("email");
            }}
          >
            Login
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;