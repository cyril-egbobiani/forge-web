import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { teachingsApi, uploadApi } from "../services/api";
import type { Teaching } from "../types";
import { handleApiError } from "../utils/errorHandler";

interface TeachingFormData {
  title: string;
  description: string;
  content: string;
  author: string;
  scripture?: string;
  category: Teaching["category"];
  tags: string;
  isPublished: boolean;
  youtubeUrl?: string;
  youtubeVideoId?: string;
}

const TeachingForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  // const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  const isEdit = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TeachingFormData>();

  // Helper function to extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    if (!url) return "";
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/ |.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = regex.exec(url);
    return match ? match[1] : "";
  };

  // Watch for YouTube URL changes
  const watchedYoutubeUrl = watch("youtubeUrl");

  useEffect(() => {
    if (watchedYoutubeUrl) {
      const videoId = extractYouTubeId(watchedYoutubeUrl);
      setValue("youtubeVideoId", videoId);

      // Auto-generate thumbnail preview if video ID is available
      if (videoId && !imagePreview) {
        setImagePreview(
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        );
      }
    }
  }, [watchedYoutubeUrl, setValue, imagePreview]);

  useEffect(() => {
    if (isEdit && id) {
      fetchTeaching(id);
    }
  }, [id, isEdit]);

  const fetchTeaching = async (teachingId: string) => {
    try {
      const response = await teachingsApi.getById(teachingId);
      if (response.data.success) {
        const teaching = response.data.data;
        reset({
          title: teaching.title,
          description: teaching.description,
          content: teaching.content,
          author:
            typeof teaching.speaker === "string"
              ? teaching.speaker
              : teaching.speaker?.name || "", // Handle both string and object structures
          scripture: teaching.scripture,
          category: teaching.category,
          tags: teaching.tags.join(", "),
          isPublished: teaching.isPublished,
          youtubeUrl: teaching.youtubeUrl || "",
          youtubeVideoId: teaching.youtubeVideoId || "",
        });
        if (teaching.thumbnailUrl) {
          // Changed from imageUrl
          setImagePreview(teaching.thumbnailUrl);
        }
      }
    } catch (error) {
      handleApiError(error, { fallbackMessage: "Failed to fetch teaching" });
      navigate("/teachings");
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const onSubmit = async (data: TeachingFormData) => {
    setLoading(true);
    try {
      let imageUrl = imagePreview;
      let videoUrl = "";

      setUploadingFiles(true);

      // Upload image if new file selected
      if (imageFile) {
        const uploadResponse = await uploadApi.uploadImage(imageFile);
        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.data.url;
        }
      }

      // Upload video if new file selected
      if (videoFile) {
        const uploadResponse = await uploadApi.uploadVideo(videoFile);
        if (uploadResponse.data.success) {
          videoUrl = uploadResponse.data.data.url;
        }
      }

      setUploadingFiles(false);

      const teachingData: Omit<Teaching, "id"> = {
        title: data.title,
        description: data.description,
        content: data.content,
        speaker: {
          name: data.author, // Map author to speaker.name
        },
        scripture: data.scripture || undefined,
        category: data.category,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        isPublished: data.isPublished,
        thumbnailUrl: imageUrl || undefined, // Use thumbnailUrl instead of imageUrl
        videoUrl: videoUrl || undefined,
        youtubeUrl: data.youtubeUrl || undefined,
        youtubeVideoId: data.youtubeVideoId || undefined,
        publishDate: data.isPublished ? new Date().toISOString() : undefined,
      };

      if (isEdit && id) {
        await teachingsApi.update(id, teachingData);
        toast.success("Teaching updated successfully");
      } else {
        await teachingsApi.create(teachingData);
        toast.success("Teaching created successfully");
      }

      navigate("/teachings");
    } catch (error) {
      handleApiError(error, {
        fallbackMessage: isEdit
          ? "Failed to update teaching"
          : "Failed to create teaching",
      });
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Teaching" : "Create New Teaching"}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              {...register("content", { required: "Content is required" })}
              rows={10}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the full teaching content..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                {...register("author", { required: "Author is required" })}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.author.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Scripture Reference
              </label>
              <input
                {...register("scripture")}
                type="text"
                placeholder="e.g. John 3:16"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
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
              <option value="sermon">Sermon</option>
              <option value="devotional">Devotional</option>
              <option value="study">Bible Study</option>
              <option value="testimony">Testimony</option>
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
              Tags
            </label>
            <input
              {...register("tags")}
              type="text"
              placeholder="faith, prayer, healing (comma separated)"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate tags with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Featured Image
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
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload image</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video File (Optional)
            </label>
            <div className="mt-1">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                placeholder="Upload a video file"
                title="Video File Upload"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Upload a local video file or use YouTube URL below
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              YouTube Integration
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  YouTube URL
                </label>
                <input
                  {...register("youtubeUrl")}
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Paste the full YouTube video URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  YouTube Video ID (Auto-generated)
                </label>
                <input
                  {...register("youtubeVideoId")}
                  type="text"
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Will be auto-extracted from URL"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Video ID is automatically extracted from the URL
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              {...register("isPublished")}
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Publish immediately (visible to users)
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/teachings")}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingFiles}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading || uploadingFiles
                ? "Saving..."
                : isEdit
                ? "Update Teaching"
                : "Create Teaching"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeachingForm;
