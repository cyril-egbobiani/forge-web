import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useErrorHandler = () => {
  const handleError = (
    error: unknown,
    fallbackMessage = "An error occurred"
  ) => {
    let message = fallbackMessage;

    if (error instanceof AxiosError && error.response?.data?.message) {
      message = error.response.data.message;
    }

    toast.error(message);
    console.error("Error:", error);
  };

  return { handleError };
};
