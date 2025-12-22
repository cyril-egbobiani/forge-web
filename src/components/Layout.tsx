import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Events", href: "/events", icon: CalendarDaysIcon },
    { name: "Teachings", href: "/teachings", icon: BookOpenIcon },
    { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
            <h1 className="text-xl font-bold text-gray-900">Forge Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors`}
                >
                  <item.icon
                    className={`${
                      isActive
                        ? "text-indigo-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 h-5 w-5 flex-shrink-0`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="border-t border-gray-200 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
