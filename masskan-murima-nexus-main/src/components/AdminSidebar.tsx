import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, Users, Shield, Boxes } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Admin Panel</div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`
          }
        >
          <Home className="mr-3 h-6 w-6" />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/dashboard?tab=listings"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`
          }
        >
          <Boxes className="mr-3 h-6 w-6" />
          Listings
        </NavLink>
        <NavLink
          to="/admin/dashboard?tab=users"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`
          }
        >
          <Users className="mr-3 h-6 w-6" />
          Users
        </NavLink>
        <NavLink
          to="/admin/moderator"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              isActive ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`
          }
        >
          <Shield className="mr-3 h-6 w-6" />
          Moderators
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
