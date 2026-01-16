export type ApiResponse<T> = {
  succes: boolean;
  message: string;
  data: T;
};

export class ApiError extends Error {
  public status: number;
  public payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;

  const res = await fetch(path, {
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
    const message =
      (payload as { message?: string } | undefined)?.message ??
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  if (!payload) {
    throw new ApiError("Empty response from server", res.status);
  }

  const apiPayload = payload as ApiResponse<T>;

  if (apiPayload.succes === false) {
    throw new ApiError(apiPayload.message || "Request failed", res.status, apiPayload);
  }

  return apiPayload;
}
