"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Weather from "@/components/Weather";
import FinancialData from "@/components/FinancialData";
import CovidData from "@/components/CovidData";

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // or a loading state
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li className="mb-2">
              <a href="/dashboard" className="block p-2">Dashboard</a>
            </li>
            <li className="mb-2">
              <a href="/profile" className="block p-2">Profile</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-2xl mb-4">Welcome, {session.user.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Weather />
          <FinancialData />
          <CovidData />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;