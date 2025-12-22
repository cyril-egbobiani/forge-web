import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { eventsApi } from "../services/api";
import type { Event } from "../types";
import { handleApiError } from "../utils/errorHandler";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsApi.getAll();
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      handleApiError(error, { fallbackMessage: "Failed to fetch events" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await eventsApi.delete(id);
      setEvents(events.filter((event) => event.id !== id));
      toast.success("Event deleted successfully");
    } catch (error) {
      handleApiError(error, { fallbackMessage: "Failed to delete event" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage community events and announcements.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/events/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Event
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {events.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No events found. Create your first event!
              </p>
            </li>
          ) : (
            events.map((event) => (
              <li key={event.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      {event.imageUrl ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={event.imageUrl}
                          alt={event.title}
                          onError={(e) => {
                            console.error("Image failed to load:", event.imageUrl);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center hidden">
                        <span className="text-gray-400 text-xs">
                          No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">
                          {event.title}
                        </p>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {event.description}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>
                          {format(new Date(event.date), "PPP")} at {event.time}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/events/edit/${event.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                      aria-label={`Edit event: ${event.title}`}
                      title="Edit event"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id!)}
                      className="text-red-600 hover:text-red-900"
                      aria-label={`Delete event: ${event.title}`}
                      title="Delete event"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Events;
