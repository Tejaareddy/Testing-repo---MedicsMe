import useErrorStore from '../zustand/errorstore';

export const handleError = (error, defaultMessage = "An unexpected error occurred.") => {
  const { setError } = useErrorStore.getState();
  let errorMessage = defaultMessage;
  let errorTitle = "Error";

  // Normalize error message
  const lowerMessage = error?.message?.toLowerCase?.() || '';


  const isSilentError =
    lowerMessage.includes("disconnected") ||
    lowerMessage.includes("operation was cancelled") ||
    lowerMessage.includes("device disconnected") ||
    lowerMessage.includes("is not connected") ||
    lowerMessage.includes("is already connected");

  if (isSilentError) {
    console.warn("Silent Bluetooth error:", error?.message);
    return;
  }

  try {
    if (error?.response) {
      // Axios-style API error
      console.error("API Error:", error.response);
      errorMessage = error.response.data?.message || error.response.statusText || defaultMessage;
      errorTitle = "API Error";
    } else if (error?.request) {
      // Network issue
      console.error("Network Error:", error.request);
      errorMessage = "Unable to reach the server. Check your internet connection.";
      errorTitle = "Network Error";
    } else if (typeof error === 'string') {
      // String errors
      console.error("String Error:", error);
      errorMessage = error;
    } else if (error?.message) {
      // Generic JS Error
      console.error("JS Error:", error.message);
      errorMessage = error.message;
    } else {
      // Unknown structure
      console.error("Unknown Error:", error);
      errorMessage = error?.toString?.() || defaultMessage;
    }

    // Set error for modal display
    setError(errorTitle, errorMessage);
  } catch (e) {
    console.error("Error in handleError:", e);
    setError("Error", defaultMessage);
  }
};
