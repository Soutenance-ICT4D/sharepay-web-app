// ... imports
import { tokenStorage, type AuthTokens } from "@/lib/token-storage";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  code?: string;
  data: T;
  timestamp?: string;
};

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public payload?: unknown;

  constructor(message: string, status: number, code?: string, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  _retry?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://agregator-production-5d03.up.railway.app/api/v1";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  // INJECTION AUTOMATIQUE DU TOKEN
  const tokens = tokenStorage.get();
  const authHeaders: Record<string, string> = {};

  if (tokens?.accessToken) {
    authHeaders.Authorization = `Bearer ${tokens.accessToken}`;
  }

  // Fusion des headers : ceux passés en options ont la priorité (au cas où on voudrait surcharger)
  const finalHeaders = {
    ...authHeaders,
    ...(headers as Record<string, string>),
  };

  // DEBUG: Log request details (FULL DEBUG FOR USER)
  console.group(`[API Request] ${rest.method || "GET"} ${url}`);
  console.log("Headers:", JSON.stringify(finalHeaders, null, 2));
  if (body) {
    console.log("Body:", JSON.stringify(body, null, 2));
  } else {
    console.log("Body: (empty)");
  }
  console.groupEnd();

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...finalHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const payload = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    // Handle 401 Unauthorized - Token Refresh Logic
    if (res.status === 401 && !options._retry) {
      if (isRefreshing) {
        // If refresh is already happening, queue this request
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              const newHeaders = { ...(headers ?? {}) } as Record<string, string>;
              newHeaders.Authorization = `Bearer ${token}`;
              resolve(apiRequest<T>(path, { ...options, _retry: true, headers: newHeaders }));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      const tokens = tokenStorage.get();
      if (tokens?.refreshToken) {
        options._retry = true;
        isRefreshing = true;

        try {
          console.log("[ApiClient] Attempting refresh with token:", tokens.refreshToken.slice(0, 10) + "...");

          // Attempt to refresh token directly to avoid circular dependency
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: tokens.refreshToken }),
          });

          console.log("[ApiClient] Refresh response status:", refreshRes.status);

          if (refreshRes.ok) {
            const refreshPayload = await refreshRes.json();
            console.log("[ApiClient] Refresh success, payload:", refreshPayload);
            const newTokens = refreshPayload.data as AuthTokens;

            if (newTokens?.accessToken) {
              tokenStorage.set(newTokens);
              processQueue(null, newTokens.accessToken);

              // Retry original request with new token
              const newHeaders = { ...(headers ?? {}) } as Record<string, string>;
              newHeaders.Authorization = `Bearer ${newTokens.accessToken}`;

              return apiRequest<T>(path, {
                ...options,
                headers: newHeaders,
              });
            } else {
              console.error("[ApiClient] Refresh payload missing accessToken");
              throw new Error("Refresh payload missing accessToken");
            }
          } else {
            const errText = await refreshRes.text();
            console.error("[ApiClient] Refresh failed. Status:", refreshRes.status, "Body:", errText);
            throw new Error(`Refresh failed: ${refreshRes.status} ${errText}`);
          }
        } catch (error) {
          console.error("[ApiClient] Token refresh mechanism error:", error);
          processQueue(error, null);
          tokenStorage.clear();
          // Dont throw here to allow 401 to propagate if needed, or redirect
          // But usually we want to stop.
        } finally {
          isRefreshing = false;
        }
      }
    }

    const errorPayload = payload as { message?: string; code?: string } | undefined;
    const message = errorPayload?.message ?? `Request failed (${res.status})`;
    const code = errorPayload?.code;

    throw new ApiError(message, res.status, code, payload);
  }

  // Handle 204 No Content
  if (!payload && (res.status === 204 || res.status === 205)) {
    return {
      success: true,
      message: "",
      data: undefined as unknown as T,
    };
  }

  const apiPayload = payload as ApiResponse<T>;

  if (apiPayload.success === false) {
    throw new ApiError(
      apiPayload.message || "Request failed",
      res.status,
      apiPayload.code,
      apiPayload
    );
  }

  return apiPayload;
}
