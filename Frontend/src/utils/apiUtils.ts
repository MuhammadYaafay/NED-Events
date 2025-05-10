import { getAuthToken } from "./authUtils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  authenticated?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, authenticated = false } = options;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authenticated) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  console.log("API Request:", {
    endpoint,
    method,
    body,
    headers,
    url: `${API_URL}${endpoint}`
  });

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(authenticated && {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: response.url
      });
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Don't log 401 errors as they're expected in some cases
    if (!(error instanceof Error && error.message === "Unauthorized")) {
      console.error("API Request Failed:", {
        endpoint,
        error: error instanceof Error ? error.message : "Unknown error",
        url: `${API_URL}${endpoint}`,
      });
    }
    throw error;
  }
}

export const uploadFile = async (
  endpoint: string,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<unknown> => {
  const token = getAuthToken();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Handle progress events if callback provided
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          onProgress(percentComplete);
        }
      });
    }

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          resolve(xhr.responseText);
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(
            new Error(
              errorData.msg ||
                errorData.message ||
                `Upload failed: ${xhr.status}`
            )
          );
        } catch (error) {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      }
    });

    // Handle network errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    // Handle timeouts
    xhr.addEventListener("timeout", () => {
      reject(new Error("Upload timed out"));
    });

    // Open and send the request
    xhr.open("PUT", `${API_URL}${endpoint}`);
    if (token) {
      xhr.setRequestHeader("x-auth-token", token);
    }
    xhr.send(formData);
  });
};
