export function getErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return "Something went wrong.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  return Object.entries(data)
    .map(([field, errors]) => {
      const message = Array.isArray(errors)
        ? errors.join(", ")
        : errors;

      return `${field}: ${message}`;
    })
    .join("\n");
}