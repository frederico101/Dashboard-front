"use client";

import LogoutPage from "@/app/logout/LogoutPage";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const Navigation: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        {status === "authenticated" ? (
          <>
            <li><a href="/dashboard" className="block p-2">Dashboard</a></li>
            <li><a href="/profile" className="block p-2">Profile</a></li>
            <li><a href="/admin" className="block p-2">Admin</a></li>
            <li><a href="/logout" className="block p-2">Logout</a></li>
          </>
        ) : (
          <>
            <li><a href="/register" className="block p-2">Register</a></li>
            <li><a href="/login" className="block p-2" onClick={() => signIn()}>Login</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;