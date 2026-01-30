import { apiRequest } from "@/lib/api-client";
import { tokenStorage } from "@/lib/token-storage";

export type DeveloperAppEnvironment = "SANDBOX" | "PRODUCTION";

export type UiDeveloperAppEnvironment = "sandbox" | "production";

export type DeveloperAppStatus = "ACTIVE" | "SUSPENDED";

export type DeveloperApp = {
  id: string;
  name: string;
  description: string;
  environment: DeveloperAppEnvironment;
  status?: DeveloperAppStatus;
  apiVersion?: string;
  createdAt?: string;
  publicKey?: string;
  secretKeyMasked?: string;
  secretKey?: string;
  webhookUrl?: string | null;
};

export type CreateDeveloperAppInput = {
  name: string;
  description: string;
  environment: UiDeveloperAppEnvironment;
  webhookUrl?: string | null;
};

type EmptyData = Record<string, never>;

const APPS_BASE = "/merchants/apps";

function toApiEnvironment(value: UiDeveloperAppEnvironment): DeveloperAppEnvironment {
  return value === "production" ? "PRODUCTION" : "SANDBOX";
}

function authHeaders() {
  const headers: Record<string, string> = {};
  headers.Accept = "application/json";

  const tokens = tokenStorage.get();
  if (tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return headers;
}

export const developerAppsService = {
  async list() {
    return apiRequest<DeveloperApp[]>(`${APPS_BASE}`, {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async get(appId: string) {
    return apiRequest<DeveloperApp>(`${APPS_BASE}/${encodeURIComponent(appId)}`, {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async create(input: CreateDeveloperAppInput) {
    return apiRequest<DeveloperApp>(`${APPS_BASE}`, {
      method: "POST",
      headers: authHeaders(),
      body: {
        name: input.name,
        description: input.description,
        environment: toApiEnvironment(input.environment),
        webhookUrl: input.webhookUrl ?? null,
      },
    });
  },

  async update(appId: string, input: Partial<CreateDeveloperAppInput>) {
    const body: Record<string, unknown> = {};
    if (input.name !== undefined) body.name = input.name;
    if (input.description !== undefined) body.description = input.description;
    if (input.environment !== undefined) body.environment = toApiEnvironment(input.environment);
    if (input.webhookUrl !== undefined) body.webhookUrl = input.webhookUrl;

    return apiRequest<DeveloperApp>(`${APPS_BASE}/${encodeURIComponent(appId)}`, {
      method: "PUT",
      headers: authHeaders(),
      body,
    });
  },

  async suspend(appId: string) {
    return apiRequest<DeveloperApp>(`${APPS_BASE}/${encodeURIComponent(appId)}/suspend`, {
      method: "POST",
      headers: authHeaders(),
    });
  },

  async activate(appId: string) {
    return apiRequest<DeveloperApp>(`${APPS_BASE}/${encodeURIComponent(appId)}/activate`, {
      method: "POST",
      headers: authHeaders(),
    });
  },

  async remove(appId: string) {
    return apiRequest<EmptyData>(`${APPS_BASE}/${encodeURIComponent(appId)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },

  async createApiKey(appId: string) {
    return apiRequest<{ publicKey: string; secretKey: string }>(`${APPS_BASE}/${encodeURIComponent(appId)}/api-keys`, {
      method: "POST",
      headers: authHeaders(),
    });
  },

  async rotateApiKey(appId: string) {
    return apiRequest<{ publicKey: string; secretKey: string }>(`${APPS_BASE}/${encodeURIComponent(appId)}/api-keys/rotate`, {
      method: "POST",
      headers: authHeaders(),
    });
  },
};
