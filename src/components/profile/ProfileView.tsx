'use client';

import { UserProfile, UserCommitmentStatus } from '@/types/user.types';
import { format } from 'date-fns';

interface ProfileViewProps {
  profile: UserProfile;
  onEdit: () => void;
}

export default function ProfileView({ profile, onEdit }: ProfileViewProps) {
  const getCommitmentLabel = (commitment: UserCommitmentStatus) => {
    return commitment.replace('_', ' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <p className="mt-1 text-sm text-gray-600">View and manage your personal information</p>
        </div>
        <button
          onClick={onEdit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Profile
        </button>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <p className="mt-1 text-sm text-gray-900">{profile.person.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <p className="mt-1 text-sm text-gray-900">{profile.person.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{profile.contact.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-sm text-gray-900">{profile.contact.phone || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="mt-1 text-sm text-gray-900">
              {profile.contact.address || 'Not provided'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commitment Status</label>
            <p className="mt-1 text-sm text-gray-900">{getCommitmentLabel(profile.commitment)}</p>
          </div>
        </div>
      </div>

      {/* Experience */}
      {profile.experiences && profile.experiences.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Work Experience</h3>
          <div className="space-y-4">
            {profile.experiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                <p className="text-sm text-gray-700">{exp.company}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                  {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                </p>
                {exp.description && <p className="mt-2 text-sm text-gray-600">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account Details */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-sm text-gray-900">{profile.role.join(', ')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-sm text-gray-900">
              {format(new Date(profile.createdAt), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
