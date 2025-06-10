// src/app/(dashboard)/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import PrivatePageWrapper from "@/components/PrivatePageWrapper";
import { Typography } from "@/components/core-ui/typography";
import { LayoutDashboard } from "lucide-react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <PrivatePageWrapper>
      <div className='flex h-screen bg-gray-50'>
        {/* Left Sidebar */}
        <div className='w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed h-full'>
          {/* Profile Section */}
          <div className='p-4 border-b border-gray-200'>
            <Link
              href='/profile'
              className='flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors'
            >
              <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold'>
                {user?.name?.charAt(0)}
              </div>
              <div className='flex-1 min-w-0'>
                <Typography
                  variant='body-sm'
                  tone='default'
                  className='truncate font-medium'
                  as='p'
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant='body-sm'
                  tone='muted'
                  className='truncate'
                  as='p'
                >
                  {user?.email}
                </Typography>
              </div>
            </Link>
          </div>

          {/* Project Section */}
          <div className='p-4 border-b border-gray-200 flex flex-col gap-1'>
            <Typography variant='label' tone='muted'>
              Project
            </Typography>
            <Typography variant='h3' tone='default' className='mb-1'>
              Task tracker
            </Typography>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-4'>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/dashboard'
                  className={`flex items-center px-3 py-2 rounded-md transition-colors transition-outline hover:bg-gray-100 hover:border ${
                    isClient && pathname === "/dashboard"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className='flex gap-2 items-center'>
                    <LayoutDashboard size={18} />
                    <Typography variant='body-sm' className='font-medium'>
                      Dashboard
                    </Typography>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Bottom Section - Role Badge and Logout */}
          <div className='p-4 border-t border-gray-200'>
            <div className='flex items-center justify-between mb-3'>
              <Typography
                variant='chip'
                className='bg-blue-100 text-blue-800 capitalize'
              >
                {user?.role}
              </Typography>
            </div>
            <button
              onClick={logout}
              className='w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors'
            >
              <svg
                className='w-5 h-5 mr-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                />
              </svg>
              <Typography
                variant='body-sm'
                tone='danger'
                className='font-medium'
              >
                Logout
              </Typography>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 ml-64'>
          <main className='min-h-screen'>{children}</main>
        </div>
      </div>
    </PrivatePageWrapper>
  );
}
