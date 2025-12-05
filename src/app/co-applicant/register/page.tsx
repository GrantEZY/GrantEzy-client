/**
 * Co-Applicant Registration Page
 * Handles registration for invited co-applicants
 * URL: /co-applicant/register?token={token}&slug={slug}&email={email}
 */
"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { showToast, ToastProvider } from "@/components/ui/ToastNew";

import { useAuth } from "@/hooks/useAuth";
import { useCoApplicantInvite } from "@/hooks/useCoApplicant";

import { UserCommitmentStatus } from "@/types/auth.types";

/**
 * Co-Applicant Registration Page
 * Handles registration for invited co-applicants
 * URL: /co-applicant/register?token={token}&slug={slug}&email={email}
 */

/**
 * Co-Applicant Registration Page
 * Handles registration for invited co-applicants
 * URL: /co-applicant/register?token={token}&slug={slug}&email={email}
 */

export default function CoApplicantRegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, isLoading: authLoading } = useAuth();
  const { accept } = useCoApplicantInvite(
    searchParams.get("token") || "",
    searchParams.get("slug") || "",
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = searchParams.get("token");
  const slug = searchParams.get("slug");

  useEffect(() => {
    if (!token || !slug) {
      router.push("/login");
    }
  }, [token, slug, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate firstName
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Validate lastName
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Register the user
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        commitment: UserCommitmentStatus.FULL_TIME, // Default for co-applicants
        password: formData.password,
      });

      showToast.success(
        "🎉 Account created successfully! Now processing your team invite...",
      );

      // Step 2: Accept the co-applicant invite (user should exist now)
      // Wait a moment for the user to be fully created
      setTimeout(async () => {
        try {
          const acceptResult = await accept();

          if (acceptResult.success) {
            showToast.success(
              "✅ Invite accepted! You're now part of the team.",
            );

            // Step 3: Redirect to co-applicant dashboard after success
            setTimeout(() => {
              router.push("/co-applicant/dashboard");
            }, 1500);
          } else {
            showToast.error(
              "Account created but failed to accept invite. Please try logging in and accepting the invite again.",
            );
            setTimeout(() => {
              router.push(
                `/login?redirect=/invite-accept-or-reject/${token}/${slug}`,
              );
            }, 2000);
          }
        } catch (inviteError) {
          console.error("Invite acceptance error:", inviteError);
          showToast.error(
            "Account created but failed to accept invite. Please try logging in and accepting the invite again.",
          );
          setTimeout(() => {
            router.push(
              `/login?redirect=/invite-accept-or-reject/${token}/${slug}`,
            );
          }, 2000);
        }
      }, 1000); // Wait 1 second for user creation to complete
    } catch (error: any) {
      console.error("Registration error:", error);
      showToast.error(
        error.message || "Failed to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !slug) {
    return null; // Will redirect via useEffect
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Complete Your Registration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You've been invited to collaborate on a grant application.
              <br />
              Create your account to get started.
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start">
              <svg
                className="mt-0.5 h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You've been invited to join a grant application team.
                  <br />
                  After registration, you'll automatically join the team and
                  gain access to the application.
                </p>
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`relative mt-1 block w-full appearance-none border px-3 py-2 ${
                    errors.firstName ? "border-red-300" : "border-gray-300"
                  } rounded-md text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`relative mt-1 block w-full appearance-none border px-3 py-2 ${
                    errors.lastName ? "border-red-300" : "border-gray-300"
                  } rounded-md text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`relative mt-1 block w-full appearance-none border px-3 py-2 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  placeholder="Enter the email you were invited to"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Use the email address that received the invitation.
                </p>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`relative mt-1 block w-full appearance-none border px-3 py-2 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`relative mt-1 block w-full appearance-none border px-3 py-2 ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account & Joining Team...
                  </>
                ) : (
                  "Create Account & Join Team"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/login?redirect=/invite-accept-or-reject/${token}/${slug}`,
                    )
                  }
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in instead
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </ToastProvider>
  );
}
