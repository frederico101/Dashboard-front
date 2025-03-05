// filepath: /C:/Users/fredy/Documents/slashDev/Test/next/front/src/pages/auth/login.tsx
import { signIn } from "next-auth/react";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <form className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <input type="email" placeholder="Email" className="mb-4 p-2 border rounded w-full" />
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={() => signIn("email")}
        >
          Login with Email
        </button>
      </form>
    </div>
  );
};

export default LoginPage;