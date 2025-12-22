import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { eventsApi, uploadApi } from "../services/api";
import type { Event } from "../types";
import { handleApiError } from "../utils/errorHandler";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: Event["category"];
  isActive: boolean;
}

const EventForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const isEdit = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // watch,
    // setValue,
  } = useForm<EventFormData>({
    defaultValues: {
      isActive: true, // Default to active for new events
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchEvent(id);
    }
  }, [id, isEdit]);

  const fetchEvent = async (eventId: string) => {
    try {
      const response = await eventsApi.getById(eventId);
      if (response.data.success) {
        const event = response.data.data;
        reset({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          category: event.category,
          isActive: event.isActive,
        });
        if (event.imageUrl) {
          setImagePreview(event.imageUrl);
        }
      }
    } catch (error) {
      handleApiError(error, { fallbackMessage: "Failed to fetch event" });
      navigate("/events");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    console.log("Form data before submission:", data);

    try {
      let imageUrl = imagePreview;

      // Upload image if new file selected
      if (imageFile) {
        setUploadingImage(true);
        const uploadResponse = await uploadApi.uploadImage(imageFile);
        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.data.url;
        }
        setUploadingImage(false);
      }

      const eventData: Omit<Event, "id"> = {
        ...data,
        isActive: Boolean(data.isActive), // Ensure boolean conversion
        imageUrl: imageUrl || undefined,
      };

      console.log("Event data being sent:", eventData);

      if (isEdit && id) {
        await eventsApi.update(id, eventData);
        toast.success("Event updated successfully");
      } else {
        await eventsApi.create(eventData);
        toast.success("Event created successfully");
      }

      navigate("/events");
    } catch (error) {
      handleApiError(error, {
        fallbackMessage: isEdit
          ? "Failed to update event"
          : "Failed to create event",
      });
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Event" : "Create New Event"}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                {...register("date", { required: "Date is required" })}
                type="date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                {...register("time", { required: "Time is required" })}
                type="time"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              {...register("location", { required: "Location is required" })}
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              <option value="service">Service</option>
              <option value="fellowship">Fellowship</option>
              <option value="conference">Conference</option>
              <option value="outreach">Outreach</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              {...register("isActive")}
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-900"
            >
              Active (visible to users)
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading || uploadingImage
                ? "Saving..."
                : isEdit
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
