"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import { UserRoles } from "@/types/auth.types";

// Role-based redirect mapping
const getRoleBasedRedirect = (role: string): string => {
  switch (role) {
    case UserRoles.ADMIN:
      return "/admin";
    case UserRoles.COMMITTEE_MEMBER:
      return "/gcv";
    default:
      return "/";
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(UserRoles.ADMIN);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set initial role based on redirect parameter
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect === "/gcv") {
      setRole(UserRoles.COMMITTEE_MEMBER);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, role });
      const result = await login({ email, password, role });
      console.log("Login result:", result);

      if (result.success) {
        // Use the backend role from the authenticated user, not the dropdown selection
        const backendRole = result.user?.role || role;

        // Get redirect from query params or use role-based default
        const queryRedirect = searchParams.get("redirect");
        const defaultRedirect = getRoleBasedRedirect(backendRole);
        const redirect = queryRedirect || defaultRedirect;

        console.log(
          "Login successful, redirecting to:",
          redirect,
          "based on backend role:",
          backendRole,
        );
        router.push(redirect);
      } else {
        const errorMsg = result.error || "Login failed";
        console.error("Login failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Login error caught:", err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to GrantEzy Admin
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Access the administrative dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="email-address">
                Email address
              </label>

              <input
                autoComplete="email"
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                id="email-address"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                type="email"
                value={email}
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>

              <input
                autoComplete="current-password"
                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="role">
                Role
              </label>

              <select
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                id="role"
                name="role"
                onChange={(e) => setRole(e.target.value as UserRoles)}
                required
                value={role}
              >
                {Object.values(UserRoles).map((userRole) => (
                  <option key={userRole} value={userRole}>
                    {userRole.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Login Failed
                  </h3>

                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Test credentials: admin@test.com / password123
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                className="font-medium text-blue-600 hover:text-blue-500"
                href="/signup"
              >
                Sign up here
              </Link>
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Access GCV Dashboard?{" "}
              <Link
                className="font-medium text-purple-600 hover:text-purple-500"
                href="/login?redirect=/gcv"
              >
                Login as Committee Member
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
