import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { teachingsApi, uploadApi } from "../services/api";
import type { Teaching, KeyMoment, AiInsights } from "../types";
import { handleApiError } from "../utils/errorHandler";
import {
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

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
  const [generatingAi, setGeneratingAi] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // AI Insights & Key Moments State
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);

  const isEdit = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<TeachingFormData>();

  const extractYouTubeId = (url: string) => {
    if (!url) return "";
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = regex.exec(url);
    return match ? match[1] : "";
  };

  const watchedYoutubeUrl = watch("youtubeUrl");

  useEffect(() => {
    if (watchedYoutubeUrl) {
      const videoId = extractYouTubeId(watchedYoutubeUrl);
      setValue("youtubeVideoId", videoId);
      if (videoId && !imagePreview) {
        setImagePreview(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
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
          author: teaching.author,
          scripture: teaching.scripture,
          category: teaching.category,
          tags: Array.isArray(teaching.tags) ? teaching.tags.join(", ") : "",
          isPublished: teaching.isPublished,
          youtubeUrl: teaching.youtubeUrl || "",
          youtubeVideoId: teaching.youtubeVideoId || "",
        });
        if (teaching.thumbnailUrl) {
          setImagePreview(teaching.thumbnailUrl);
        }
        if (teaching.aiInsights) {
          setAiInsights(teaching.aiInsights);
        }
        if (teaching.keyMoments) {
          setKeyMoments(teaching.keyMoments);
        }
      }
    } catch (error) {
      handleApiError(error, { fallbackMessage: "Failed to fetch teaching" });
      navigate("/teachings");
    }
  };

  const handleGenerateAi = async () => {
    const values = getValues();
    if (!values.title) {
      toast.error("Please enter a teaching title first before generating AI insights.");
      return;
    }

    try {
      setGeneratingAi(true);
      const res = await teachingsApi.generateAi({
        title: values.title,
        description: values.description,
        content: values.content,
        author: values.author,
        scripture: values.scripture,
      });

      if (res.data.success) {
        setAiInsights(res.data.data.aiInsights);
        setKeyMoments(res.data.data.keyMoments || []);
        toast.success("AI Insights & Key Moments generated successfully!");
      }
    } catch (error) {
      console.error("Failed to generate AI insights:", error);
      toast.error("Failed to generate AI insights");
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleAddKeyMoment = () => {
    const newMoment: KeyMoment = {
      timestamp: "00:00",
      seconds: 0,
      title: "New Key Moment",
      subtitle: "",
      scripture: "",
      takeaway: "",
    };
    setKeyMoments([...keyMoments, newMoment]);
  };

  const handleUpdateKeyMoment = (index: number, field: keyof KeyMoment, value: any) => {
    const updated = [...keyMoments];
    updated[index] = { ...updated[index], [field]: value };
    setKeyMoments(updated);
  };

  const handleRemoveKeyMoment = (index: number) => {
    setKeyMoments(keyMoments.filter((_, i) => i !== index));
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

      if (imageFile) {
        const uploadResponse = await uploadApi.uploadImage(imageFile);
        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.data.url;
        }
      }

      if (videoFile) {
        const uploadResponse = await uploadApi.uploadVideo(videoFile);
        if (uploadResponse.data.success) {
          videoUrl = uploadResponse.data.data.url;
        }
      }

      setUploadingFiles(false);

      const teachingData: any = {
        title: data.title,
        description: data.description,
        content: data.content,
        author: data.author,
        scripture: data.scripture,
        category: data.category,
        tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        thumbnailUrl: imageUrl,
        videoUrl: videoUrl,
        youtubeUrl: data.youtubeUrl,
        youtubeVideoId: data.youtubeVideoId,
        aiInsights: aiInsights || undefined,
        keyMoments: keyMoments,
        isPublished: data.isPublished,
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
        fallbackMessage: isEdit ? "Failed to update teaching" : "Failed to create teaching",
      });
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Teaching" : "Drop New Teaching & Video"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Publish sermons, attach YouTube/video media, and generate AI Key Moments.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Teaching Title *</label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. The Power to Will and to Do of His Good Will"
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Speaker / Preacher *</label>
              <input
                type="text"
                {...register("author", { required: "Speaker name is required" })}
                placeholder="Pastor Cyril Thompson"
                className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
              {errors.author && <p className="mt-1 text-xs text-red-600">{errors.author.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Scripture Reference</label>
              <input
                type="text"
                {...register("scripture")}
                placeholder="Philippians 2:12-13"
                className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              rows={3}
              {...register("description", { required: "Description is required" })}
              placeholder="Brief summary of the sermon..."
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Content / Transcript</label>
            <textarea
              rows={5}
              {...register("content")}
              placeholder="Sermon transcript or outline..."
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono text-xs"
            />
          </div>
        </div>

        {/* Video & Media Integration */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Video & Media Links</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube Video URL</label>
            <input
              type="text"
              {...register("youtubeUrl")}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Custom Video File (Optional MP4)</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-36 w-64 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>
        </div>

        {/* Gemini AI Key Moments & Exegesis Builder */}
        <div className="rounded-lg bg-indigo-50/50 p-6 shadow-sm border border-indigo-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-indigo-950 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-indigo-600" />
                AI Key Moments & Theological Insights
              </h2>
              <p className="text-xs text-indigo-700">
                Use Gemini 2.0 to auto-extract timestamped milestones, original language exegesis, and discussion questions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateAi}
              disabled={generatingAi}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              <SparklesIcon className="mr-1.5 h-4 w-4" />
              {generatingAi ? "Generating AI Insights..." : "Generate with Gemini"}
            </button>
          </div>

          {/* AI Insights Display */}
          {aiInsights && (
            <div className="mt-4 rounded-md bg-white p-4 border border-indigo-100 space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Core Thesis</span>
                <p className="mt-1 text-sm text-gray-800">{aiInsights.coreThesis}</p>
              </div>

              {aiInsights.scriptureReferences && aiInsights.scriptureReferences.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Greek/Hebrew Exegesis</span>
                  <div className="mt-1 space-y-2">
                    {aiInsights.scriptureReferences.map((ref, i) => (
                      <div key={i} className="text-xs bg-gray-50 p-2.5 rounded border border-gray-200">
                        <span className="font-semibold text-gray-900">{ref.reference}:</span> {ref.greekExegesis || ref.context}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Moments Editor */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                Video Key Moments ({keyMoments.length})
              </span>
              <button
                type="button"
                onClick={handleAddKeyMoment}
                className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                <PlusIcon className="mr-1 h-3.5 w-3.5" />
                Add Moment
              </button>
            </div>

            {keyMoments.map((moment, index) => (
              <div
                key={index}
                className="rounded-md bg-white p-4 border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="04:12"
                      value={moment.timestamp}
                      onChange={(e) => handleUpdateKeyMoment(index, "timestamp", e.target.value)}
                      className="w-20 rounded border-gray-300 text-xs font-mono font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Title (e.g. Worship & Alignment)"
                      value={moment.title}
                      onChange={(e) => handleUpdateKeyMoment(index, "title", e.target.value)}
                      className="flex-1 rounded border-gray-300 text-xs font-semibold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyMoment(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Subtitle (e.g. Anelia Cafe Live Set)"
                    value={moment.subtitle || ""}
                    onChange={(e) => handleUpdateKeyMoment(index, "subtitle", e.target.value)}
                    className="rounded border-gray-300 text-xs text-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Scripture Anchor (e.g. Psalm 100:1-4)"
                    value={moment.scripture || ""}
                    onChange={(e) => handleUpdateKeyMoment(index, "scripture", e.target.value)}
                    className="rounded border-gray-300 text-xs text-gray-600"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Takeaway (1-2 sentence actionable summary for mobile app)"
                  value={moment.takeaway || ""}
                  onChange={(e) => handleUpdateKeyMoment(index, "takeaway", e.target.value)}
                  className="w-full rounded border-gray-300 text-xs text-gray-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Publishing Status */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-900">Publish Immediately</span>
            <p className="text-xs text-gray-500">Make this sermon live on the mobile app home screen</p>
          </div>
          <input
            type="checkbox"
            {...register("isPublished")}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/teachings")}
            className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploadingFiles}
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Saving Teaching..." : isEdit ? "Update Teaching" : "Publish Teaching"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeachingForm;
