import { apiRequest } from "@/lib/api-client";
import { tokenStorage } from "@/lib/token-storage";

export type ProcessPaymentInput = {
    paymentLinkId?: string;
    amount?: number;
    currency?: string;
    payerEmail?: string;
    payerName?: string;
    paymentMethodId?: string; // If using saved method
    metadata?: Record<string, unknown>;
};

export type PaymentTransaction = {
    id: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    amount: number;
    currency: string;
    createdAt: string;
};

const PAYMENTS_BASE = "/payments";

function authHeaders() {
    const headers: Record<string, string> = {};
    headers.Accept = "application/json";

    const tokens = tokenStorage.get();
    if (tokens?.accessToken) {
        headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return headers;
}

export const paymentService = {
    async process(input: ProcessPaymentInput) {
        return apiRequest<PaymentTransaction>(`${PAYMENTS_BASE}/process`, {
            method: "POST",
            headers: authHeaders(),
            body: input,
        });
    },
};
