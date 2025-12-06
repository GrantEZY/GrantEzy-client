'use client';

import { AuthGuard } from '@/components/guards/AuthGuard';
import GCVLayout from '@/components/layout/GCVLayout';

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <GCVLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              </svg>
            </div>

            <h1 className="mb-4 text-4xl font-bold text-gray-900">Analytics</h1>

            <p className="text-xl text-gray-600">Coming Soon</p>

            <p className="mt-4 text-gray-500">
              We&apos;re working on bringing you powerful analytics and insights. Stay tuned for
              updates!
            </p>
          </div>
        </div>
      </GCVLayout>
    </AuthGuard>
  );
}
