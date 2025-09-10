"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
          GrantEzy
        </h1>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isAuthenticated ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-gray-600">
                Role: {user?.role?.replace(/_/g, " ")}
              </p>
              
              <div className="space-y-3">
                <Link 
                  href="/admin"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Admin Dashboard
                </Link>
                
                <Link 
                  href="/admin/users"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage Users
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome to GrantEzy
              </h2>
              <p className="text-gray-600">
                Please sign in to access the admin dashboard
              </p>
              
              <Link 
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
