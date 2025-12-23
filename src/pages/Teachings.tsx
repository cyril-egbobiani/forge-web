import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { teachingsApi } from "../services/api";
import type { Teaching } from "../types";
import { handleApiError } from "../utils/errorHandler";

const Teachings: React.FC = () => {
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachings();
  }, []);

  const fetchTeachings = async () => {
    try {
      console.log("🔍 Fetching teachings...");
      const response = await teachingsApi.getAll();
      console.log("📦 Response received:", response);

      if (response.data.success) {
        console.log("✅ Success, setting teachings:", response.data.data);
        setTeachings(response.data.data || []);
      } else {
        console.error("❌ API returned success: false");
        toast.error("Failed to fetch teachings");
      }
    } catch (error) {
      console.error("❌ Error fetching teachings:", error);
      handleApiError(error, { fallbackMessage: "Failed to fetch teachings" });
    } finally {
      setLoading(false);
    }
  };

  //   const handleDelete = async (id: string) => {
  //     if (!confirm("Are you sure you want to delete this teaching?")) return;

  //     try {
  //       await teachingsApi.delete(id);
  //       setTeachings(teachings.filter((teaching) => teaching.id !== id));
  //       toast.success("Teaching deleted successfully");
  //     } catch (error) {
  //       handleApiError(error, { fallbackMessage: "Failed to delete teaching" });
  //     }
  //   };

  const handleTogglePublish = async (
    id: string,
    isCurrentlyPublished: boolean
  ) => {
    try {
      if (isCurrentlyPublished) {
        await teachingsApi.unpublish(id);
        toast.success("Teaching unpublished");
      } else {
        await teachingsApi.publish(id);
        toast.success("Teaching published");
      }

      setTeachings(
        teachings.map((teaching) =>
          teaching.id === id
            ? { ...teaching, isPublished: !isCurrentlyPublished }
            : teaching
        )
      );
    } catch (error) {
      handleApiError(error, {
        fallbackMessage: "Failed to update teaching status",
      });
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
          <h1 className="text-2xl font-bold text-gray-900">Teachings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage sermons, devotionals, and study materials.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/teachings/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Teaching
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {teachings.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No teachings found. Create your first teaching!
              </p>
            </li>
          ) : (
            teachings.map((teaching) => (
              <li key={teaching.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      {teaching.thumbnailUrl ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={teaching.thumbnailUrl}
                          alt={teaching.title}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">
                          {teaching.title}
                        </p>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            teaching.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {teaching.isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {teaching.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {teaching.description}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>By {teaching.author}</span>
                        {teaching.scripture && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{teaching.scripture}</span>
                          </>
                        )}
                        {teaching.publishDate && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              {format(new Date(teaching.publishDate), "PPP")}
                            </span>
                          </>
                        )}
                      </div>
                      {teaching.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {teaching.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleTogglePublish(teaching.id!, teaching.isPublished)
                      }
                      className={`${
                        teaching.isPublished
                          ? "text-yellow-600 hover:text-yellow-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                      title={
                        teaching.isPublished
                          ? "Unpublish Teaching"
                          : "Publish Teaching"
                      }
                      aria-label={
                        teaching.isPublished
                          ? "Unpublish Teaching"
                          : "Publish Teaching"
                      }
                    >
                      {teaching.isPublished ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <Link
                      to={`/teachings/edit/${teaching.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                      aria-label={`Edit teaching: ${teaching.title}`}
                      title="Edit teaching"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-900"
                      aria-label={`Delete teaching: ${teaching.title}`}
                      title="Delete teaching"
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

export default Teachings;
