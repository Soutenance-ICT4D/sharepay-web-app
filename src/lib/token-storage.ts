export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
};

const ACCESS_TOKEN_KEY = "sharepay.accessToken";
const REFRESH_TOKEN_KEY = "sharepay.refreshToken";
const TOKEN_TYPE_KEY = "sharepay.tokenType";

export type TokenPersistMode = "local" | "session";
const PERSIST_MODE_KEY = "sharepay.persistMode";

function isBrowser() {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  getPersistMode(): TokenPersistMode {
    if (!isBrowser()) return "session";
    const mode = window.localStorage.getItem(PERSIST_MODE_KEY);
    return mode === "local" ? "local" : "session";
  },

  getPersistent(): AuthTokens | null {
    if (!isBrowser()) return null;

    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    const tokenType = window.localStorage.getItem(TOKEN_TYPE_KEY) ?? "Bearer";

    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken, tokenType };
  },

  get(): AuthTokens | null {
    if (!isBrowser()) return null;

    const storages: Storage[] = [window.sessionStorage, window.localStorage];
    for (const storage of storages) {
      const accessToken = storage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = storage.getItem(REFRESH_TOKEN_KEY);
      const tokenType = storage.getItem(TOKEN_TYPE_KEY) ?? "Bearer";

      if (accessToken && refreshToken) {
        return { accessToken, refreshToken, tokenType };
      }
    }

    return null;
  },

  set(tokens: AuthTokens, options?: { persist?: boolean }) {
    if (!isBrowser()) return;

    const persist = options?.persist ?? false;
    const targetStorage = persist ? window.localStorage : window.sessionStorage;
    const mode: TokenPersistMode = persist ? "local" : "session";

    window.localStorage.setItem(PERSIST_MODE_KEY, mode);

    // Nettoyage de l'autre storage pour éviter les conflits
    const otherStorage = persist ? window.sessionStorage : window.localStorage;
    otherStorage.removeItem(ACCESS_TOKEN_KEY);
    otherStorage.removeItem(REFRESH_TOKEN_KEY);
    otherStorage.removeItem(TOKEN_TYPE_KEY);

    targetStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    targetStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    targetStorage.setItem(TOKEN_TYPE_KEY, tokens.tokenType ?? "Bearer");
  },

  clear() {
    if (!isBrowser()) return;

    window.localStorage.removeItem(PERSIST_MODE_KEY);

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(TOKEN_TYPE_KEY);

    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_TYPE_KEY);
  },

  getAuthorizationHeader(): string | null {
    const tokens = this.get();
    if (!tokens?.accessToken) return null;
    return `${tokens.tokenType} ${tokens.accessToken}`;
  },
};
