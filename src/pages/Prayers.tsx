import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { prayersApi } from "../services/api";
import type { PrayerRequest } from "../types";
import {
  HeartIcon,
  UserIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Prayers: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const res = await prayersApi.getAll();
      if (res.data.success) {
        setPrayers(res.data.prayerRequests || []);
      }
    } catch (error) {
      console.error("Failed to load prayers:", error);
      toast.error("Failed to load prayer requests");
    } finally {
      setLoading(false);
    }
  };

  const filteredPrayers = prayers.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.authorName && p.authorName.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prayer Wall Moderation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Oversee community prayer requests, track prayer activity, and moderate requests.
          </p>
        </div>
        <button
          onClick={fetchPrayers}
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search prayer requests by keyword or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
        >
          <option value="all">All Categories</option>
          <option value="personal">Personal</option>
          <option value="family">Family</option>
          <option value="healing">Healing</option>
          <option value="guidance">Guidance</option>
          <option value="thanksgiving">Thanksgiving</option>
        </select>
      </div>

      {/* Prayers List */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading prayer requests...</div>
      ) : filteredPrayers.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No prayer requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? "Try adjusting your search criteria" : "New prayer requests submitted from mobile will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrayers.map((prayer) => (
            <div
              key={prayer._id}
              className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {prayer.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <HeartIcon className="mr-1 h-3.5 w-3.5 text-rose-500" />
                    {prayer.prayerCount || 0} prayed
                  </div>
                </div>

                <h3 className="mt-3 text-base font-semibold text-gray-900">{prayer.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{prayer.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <UserIcon className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  {prayer.isAnonymous ? "Anonymous Member" : prayer.authorName || "Member"}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  {new Date(prayer.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prayers;
