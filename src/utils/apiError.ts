
export const formatRetryAfter = (seconds?: number) => {
  if (!seconds || seconds < 1) return "soon";
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
};

export const getApiErrorMessage = (
  error: any,
  fallback = "Something went wrong. Please try again."
) => {
  if (error?.isRateLimited && error?.userMessage) {
    return error.userMessage;
  }

  if (error?.response?.status === 429) {
    const retryAfter = Number(
      error?.response?.data?.retryAfter ||
        error?.response?.headers?.["retry-after"] ||
        0
    );
    const message =
      error?.response?.data?.message ||
      "You are doing that too quickly. Please wait before trying again.";

    return `${message} Try again in ${formatRetryAfter(retryAfter)}.`;
  }

  return (
    error?.response?.data?.message ||
    error?.userMessage ||
    error?.message ||
    fallback
  );
};
