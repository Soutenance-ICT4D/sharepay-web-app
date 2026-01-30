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

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  // DEBUG: Log request details
  console.log(`[API Request] ${rest.method || "GET"} ${url}`);
  if (headers && (headers as Record<string, string>).Authorization) {
    console.log("[API Headers] Auth Token present:", (headers as Record<string, string>).Authorization);
  } else {
    console.log("[API Headers] No Authorization header present");
  }
  // console.log("[API Body]", body);

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const payload = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    // Handle 401 Unauthorized - Token Refresh Logic
    if (res.status === 401 && !options._retry) {
      const tokens = tokenStorage.get();
      if (tokens?.refreshToken) {
        try {
          // Attempt to refresh token directly to avoid circular dependency
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: tokens.refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshPayload = await refreshRes.json();
            // Assuming structure matches ApiResponse<AuthTokens> based on consistency
            const newTokens = refreshPayload.data as AuthTokens;

            if (newTokens?.accessToken) {
              tokenStorage.set(newTokens);

              // Retry original request with new token
              const newHeaders = { ...(headers ?? {}) } as Record<string, string>;
              newHeaders.Authorization = `Bearer ${newTokens.accessToken}`;

              return apiRequest<T>(path, {
                ...options,
                _retry: true,
                headers: newHeaders,
              });
            }
          } else {
            // Refresh failed - clear tokens to force login
            tokenStorage.clear();
          }
        } catch (error) {
          console.error("Token refresh failed", error);
          tokenStorage.clear();
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
