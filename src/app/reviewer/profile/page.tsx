'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/guards/AuthGuard';
import ReviewerLayout from '@/components/layout/ReviewerLayout';
import ProfileView from '@/components/profile/ProfileView';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { useUserStore } from '@/store/user.store';
import { UpdateProfileRequest } from '@/types/user.types';

export default function ReviewerProfilePage() {
  const { profile, isLoading, error, getUserProfile, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading && !profile) {
    return (
      <AuthGuard>
        <ReviewerLayout>
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-sm text-gray-600">Loading profile...</p>
            </div>
          </div>
        </ReviewerLayout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <ReviewerLayout>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </ReviewerLayout>
      </AuthGuard>
    );
  }

  if (!profile) {
    return (
      <AuthGuard>
        <ReviewerLayout>
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-gray-600">Profile not found</p>
          </div>
        </ReviewerLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ReviewerLayout>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {isEditing ? (
            <ProfileEditForm
              initialData={{
                firstName: profile.person.firstName,
                lastName: profile.person.lastName,
                email: profile.contact.email,
                phone: profile.contact.phone || undefined,
                address: profile.contact.address || undefined,
                commitment: profile.commitment,
                experiences: profile.experiences || [],
              }}
              onSubmit={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          ) : (
            <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
          )}
        </div>
      </ReviewerLayout>
    </AuthGuard>
  );
}
