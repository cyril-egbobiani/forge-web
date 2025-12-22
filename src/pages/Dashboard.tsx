import React from "react";
import {
  CalendarDaysIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: "Total Events",
      value: "24",
      icon: CalendarDaysIcon,
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "Published Teachings",
      value: "156",
      icon: BookOpenIcon,
      change: "+8%",
      changeType: "increase",
    },
    {
      name: "Active Users",
      value: "1,329",
      icon: UserGroupIcon,
      change: "+23%",
      changeType: "increase",
    },
    {
      name: "Engagement Rate",
      value: "87%",
      icon: ChartBarIcon,
      change: "+3%",
      changeType: "increase",
    },
  ];

  const recentActivity = [
    {
      action: "New teaching published",
      item: "Walking in Faith",
      time: "2 hours ago",
    },
    { action: "Event created", item: "Sunday Service", time: "4 hours ago" },
    {
      action: "Teaching updated",
      item: "Prayer and Fasting",
      time: "1 day ago",
    },
    { action: "Event published", item: "Youth Conference", time: "2 days ago" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your community.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === "increase"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, idx) => (
                <li key={idx}>
                  <div className="relative pb-8">
                    {idx !== recentActivity.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                          <div className="h-2 w-2 bg-white rounded-full" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.action}{" "}
                            <span className="font-medium text-gray-900">
                              {activity.item}
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
