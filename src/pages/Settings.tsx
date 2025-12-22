import React from "react";

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your admin preferences and configuration.
        </p>
      </div>

      <div className="space-y-6">
        {/* API Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            API Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="backend-api-url"
                className="block text-sm font-medium text-gray-700"
              >
                Backend API URL
              </label>
              <input
                id="backend-api-url"
                type="text"
                value={
                  import.meta.env.VITE_API_URL || "http://localhost:3001/api"
                }
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                title="Backend API URL configuration"
              />
              <p className="mt-1 text-sm text-gray-500">
                Configure this in your .env file as VITE_API_URL
              </p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Admin Information
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                placeholder="admin"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                title="Admin username"
              />
            </div>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@forge.com"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                title="Admin email address"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
          <div className="space-y-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Backup & Export */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Data Management
          </h3>
          <div className="space-y-4">
            <div className="flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export Events
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export Teachings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
