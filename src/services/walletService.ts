import { apiRequest } from "@/lib/api-client";
import { tokenStorage } from "@/lib/token-storage";

export type Wallet = {
    id: string;
    currency: string;
    balance: number;
    isDefault: boolean;
};

const WALLETS_BASE = "/wallets";

function authHeaders() {
    const headers: Record<string, string> = {};
    headers.Accept = "application/json";

    const tokens = tokenStorage.get();
    if (tokens?.accessToken) {
        headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return headers;
}

export const walletService = {
    async getMyWallets() {
        return apiRequest<Wallet[]>(`${WALLETS_BASE}/me`, {
            method: "GET",
            headers: authHeaders(),
        });
    },
};
