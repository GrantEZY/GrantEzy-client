/**
 * Universal Invite Route (Backend Email Link)
 * URL: /invite-accept-or-reject/[token]/[slug]
 * This matches the email template route from the backend
 * Handles both CO-APPLICANT and REVIEWER invites
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import { use } from "react";

import { useRouter } from "next/navigation";

import { ToastProvider } from "@/components/ui/ToastNew";

/**
 * Universal Invite Route (Backend Email Link)
 * URL: /invite-accept-or-reject/[token]/[slug]
 * This matches the email template route from the backend
 * Handles both CO-APPLICANT and REVIEWER invites
 */

interface PageProps {
  params: Promise<{
    token: string;
    slug: string;
  }>;
}

// Loading component for Suspense
function InviteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-6 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="flex space-x-4">
            <div className="h-10 w-24 rounded bg-gray-200"></div>
            <div className="h-10 w-24 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvitePageContent({
  params,
}: {
  params: { token: string; slug: string };
}) {
  const { token, slug } = params;
  const router = useRouter();
  const [_isDetectingType, setIsDetectingType] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectInviteType() {
      try {
        // Try co-applicant endpoint first
        const coApplicantResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/co-applicant/get-token-details?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`,
          { method: "GET" },
        );

        if (coApplicantResponse.ok) {
          // It's a co-applicant invite
          console.log(
            "[InviteRouter] Detected CO-APPLICANT invite, redirecting...",
          );
          router.replace(
            `/co-applicant/invite?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`,
          );
          return;
        }

        // Try reviewer endpoint
        const reviewerResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/reviewer/get-token-details?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`,
          { method: "GET" },
        );

        if (reviewerResponse.ok) {
          // It's a reviewer invite
          console.log(
            "[InviteRouter] Detected REVIEWER invite, redirecting...",
          );
          router.replace(
            `/reviewer/invite?token=${encodeURIComponent(token)}&slug=${encodeURIComponent(slug)}`,
          );
          return;
        }

        // Neither worked
        setError("Invalid or expired invitation link");
        setIsDetectingType(false);
      } catch (err) {
        console.error("[InviteRouter] Error detecting invite type:", err);
        setError("Failed to verify invitation");
        setIsDetectingType(false);
      }
    }

    detectInviteType();
  }, [token, slug, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-red-900">
            Invalid Invitation
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-md bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return <InviteLoading />;
}

export default function UniversalInviteRoute({ params }: PageProps) {
  // Use React's use() hook to unwrap the promise in client component
  const resolvedParams = use(params);

  return (
    <ToastProvider>
      <Suspense fallback={<InviteLoading />}>
        <InvitePageContent params={resolvedParams} />
      </Suspense>
    </ToastProvider>
  );
}
