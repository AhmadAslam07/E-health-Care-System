export const fetchWrapper = async (
  url,
  method = "GET",
  token = localStorage.getItem("token"),
  body = null,
  isFormData = false
) => {
  let headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const options = {
    method,
    headers,
    cache: "no-cache",
  };

  if (method !== "GET" && body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
};