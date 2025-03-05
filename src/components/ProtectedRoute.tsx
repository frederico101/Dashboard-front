"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import React, { useEffect } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session && role) {
      signIn(); // Redirect to login if not authenticated and role is required
    } else if (role && session?.user?.role !== role) {
      router.push("/"); // Redirect if role doesn't match
    }
  }, [session, status, role, router]);

  if (status === "loading" || (!session && role)) {
    return <div>Loading...</div>; // Show a loading state
  }

  return <>{children}</>;
};

export default ProtectedRoute;