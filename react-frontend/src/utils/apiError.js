// Turns an Axios error into a readable message.
// The backend sends { message, errors: [{ field, message }] } for validation
// failures; show the first specific reason instead of just "Validation failed".
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    const text = typeof first === "string" ? first : first?.message;
    if (text) {
      return text;
    }
  }

  return data?.message || err?.message || fallback;
}
