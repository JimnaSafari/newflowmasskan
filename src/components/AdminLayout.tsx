import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // This component will be created next

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-0">
          {/* Admin banner */}
          <div className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 shadow">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 font-bold">A</span>
                <div>
                  <div className="text-sm uppercase tracking-wide opacity-90">Admin Area</div>
                  <div className="text-xs opacity-80">You are viewing administrative tools. Changes here affect the entire platform.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <a href="/admin/dashboard" className="underline hover:opacity-90">Dashboard</a>
                <span className="opacity-50">•</span>
                <a href="/admin/dashboard?tab=listings" className="underline hover:opacity-90">Listings</a>
                <span className="opacity-50">•</span>
                <a href="/admin/dashboard?tab=users" className="underline hover:opacity-90">Users</a>
                <span className="opacity-50">•</span>
                <a href="/admin/moderator" className="underline hover:opacity-90">Moderators</a>
              </div>
            </div>
          </div>
          <div className="p-6">
          <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
