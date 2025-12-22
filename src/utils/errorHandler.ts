import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const handleApiError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
) => {
  const {
    showToast = true,
    logError = true,
    fallbackMessage = "An error occurred",
  } = options;

  let message = fallbackMessage;

  if (error instanceof AxiosError && error.response?.data?.message) {
    message = error.response.data.message;
  }

  if (logError) {
    console.error("API Error:", error);
  }

  if (showToast) {
    toast.error(message);
  }

  return message;
};
