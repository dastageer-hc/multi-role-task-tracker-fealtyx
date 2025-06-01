// src/app/(dashboard)/profile/page.tsx
"use client";

import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Profile</h1>

      <div className='bg-white shadow-sm rounded-lg'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900'>
            User Information
          </h2>
        </div>

        <div className='px-6 py-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <p className='mt-1 text-sm text-gray-900'>{user?.name}</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <p className='mt-1 text-sm text-gray-900'>{user?.email}</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              User ID
            </label>
            <p className='mt-1 text-sm text-gray-900'>{user?.id}</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Role
            </label>
            <div className='mt-1'>
              <span className='px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full capitalize'>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
