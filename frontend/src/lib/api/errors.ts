const STATUS_MESSAGES: Record<number, string> = {
  400: 'The request was invalid. Please check your input.',
  403: 'You don\'t have permission to do that.',
  404: 'The requested item was not found.',
  409: 'This conflicts with an existing record.',
  422: 'The request contained invalid data.',
  429: 'Too many requests. Please slow down.',
  500: 'A server error occurred. Please try again.',
  502: 'The server is temporarily unavailable.',
  503: 'The service is currently unavailable. Please try again later.',
};

/**
 * Extracts a human-readable message from an Axios error or unknown error.
 * Prefers the server's own message field when present; falls back to
 * a friendly status-code description; then a generic fallback.
 */
export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
    const serverMessage = axiosError.response?.data?.message;
    if (serverMessage) return serverMessage;
    const status = axiosError.response?.status;
    if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
    return fallback;
  }
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('network')) return 'Unable to reach the server. Check your connection.';
    return error.message;
  }
  return fallback;
}
