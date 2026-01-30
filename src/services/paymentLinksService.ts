import { apiRequest } from "@/lib/api-client";
import { tokenStorage } from "@/lib/token-storage";

export type PaymentLinkStatus = "ACTIVE" | "EXPIRED";

export type PaymentLink = {
  id: string;
  title: string;
  description?: string | null;
  link?: string | null;
  amountType?: "fixed" | "free";
  amountValue?: number | null;
  currency?: string | null;
  logoUrl?: string | null;
  themeColor?: string | null;
  redirectUrl?: string | null;
  expiresAt?: string | null;
  maxUses?: number | null;
  collectCustomerInfo?: boolean | null;
  payments?: number | null;
  status?: PaymentLinkStatus;
  createdAt?: string;
};

export type CreatePaymentLinkInput = {
  title: string;
  description?: string | null;
  amountType?: "fixed" | "free";
  amountValue?: number | null;
  currency?: string | null;
  logoUrl?: string | null;
  themeColor?: string | null;
  redirectUrl?: string | null;
  expiresAt?: string | null;
  maxUses?: number | null;
  collectCustomerInfo?: boolean | null;
  status?: PaymentLinkStatus;
  appId?: string | null;
  applicationTarget?: string | null;
};

type EmptyData = Record<string, never>;

const PAYMENT_LINKS_BASE = "/payment-links";

function authHeaders() {
  const headers: Record<string, string> = {};
  headers.Accept = "application/json";

  const tokens = tokenStorage.get();
  if (tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return headers;
}

export const paymentLinksService = {
  async list() {
    return apiRequest<PaymentLink[]>(`${PAYMENT_LINKS_BASE}`, {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async get(paymentLinkId: string) {
    return apiRequest<PaymentLink>(`${PAYMENT_LINKS_BASE}/${encodeURIComponent(paymentLinkId)}`, {
      method: "GET",
      headers: authHeaders(),
    });
  },

  async create(input: CreatePaymentLinkInput) {
    // appId is optional, backend handles default if missing

    // transform input to backend expected payload
    const payload = {
      appId: input.appId,
      status: input.status || "ACTIVE",
      title: input.title,
      description: input.description,
      amountType: input.amountType === "free" ? "FLEXIBLE" : "FIXED",
      amount: input.amountValue || 0,
      currency: input.currency || "XAF",
      merchantLogo: input.logoUrl,
      accentColor: input.themeColor,
      successUrl: input.redirectUrl,
      expiryDate: input.expiresAt,
      collectCustomerInfo: input.collectCustomerInfo ?? true,
    };

    return apiRequest<PaymentLink>(`${PAYMENT_LINKS_BASE}`, {
      method: "POST",
      headers: authHeaders(),
      body: payload,
    });
  },

  async update(paymentLinkId: string, input: Partial<CreatePaymentLinkInput>) {
    return apiRequest<PaymentLink>(`${PAYMENT_LINKS_BASE}/${encodeURIComponent(paymentLinkId)}`, {
      method: "PUT",
      headers: authHeaders(),
      body: input,
    });
  },

  async remove(paymentLinkId: string) {
    return apiRequest<EmptyData>(`${PAYMENT_LINKS_BASE}/${encodeURIComponent(paymentLinkId)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },

  async getPublic(token: string) {
    // Public endpoint - no auth headers needed
    return apiRequest<PaymentLink>(`${PAYMENT_LINKS_BASE}/public/${encodeURIComponent(token)}`, {
      method: "GET",
    });
  },

  async payPublic(token: string, data: Record<string, unknown>) {
    // Public endpoint - no auth headers needed
    return apiRequest<{
      success: boolean;
      transactionId?: string;
      redirectUrl?: string;
    }>(`${PAYMENT_LINKS_BASE}/public/${encodeURIComponent(token)}/pay`, {
      method: "POST",
      body: data,
    });
  },
};
