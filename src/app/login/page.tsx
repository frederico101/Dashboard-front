"use client";

import { signIn } from "next-auth/react";
import React, { useEffect } from "react";

const LoginPage: React.FC = () => {
  useEffect(() => {
    signIn("email");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <div>
          Redirecting to sign-in...
        </div>
      </div>
    </div>
  );
};

export default LoginPage;