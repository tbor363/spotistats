// Spotify API Configuration
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const TOKEN_URL = import.meta.env.VITE_TOKEN_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Spotify Authorization Scopes
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
  "playlist-modify-public",
  "playlist-modify-private",
].join(" ");

// Generate random string for state parameter
const generateRandomString = (length: number): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Generate code verifier for PKCE
const generateCodeVerifier = (): string => {
  return generateRandomString(128);
};

// Generate code challenge for PKCE
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Spotify API Class
class SpotifyAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor() {
    // Check if tokens exist in localStorage
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem("spotify_access_token");
    this.refreshToken = localStorage.getItem("spotify_refresh_token");
    const expiresAt = localStorage.getItem("spotify_token_expires_at");
    this.tokenExpiresAt = expiresAt ? parseInt(expiresAt) : null;
  }

  private saveTokensToStorage(
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number
  ) {
    localStorage.setItem("spotify_access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("spotify_refresh_token", refreshToken);
    }
    if (expiresIn) {
      const expiresAt = Date.now() + expiresIn * 1000;
      localStorage.setItem("spotify_token_expires_at", expiresAt.toString());
      this.tokenExpiresAt = expiresAt;
    }
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  // Redirect to Spotify authorization page
  async redirectToAuth() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(16);

    // Store code verifier and state in localStorage
    localStorage.setItem("code_verifier", codeVerifier);
    localStorage.setItem("auth_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location.href = `${AUTH_URL}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, state: string) {
    const storedState = localStorage.getItem("auth_state");
    const codeVerifier = localStorage.getItem("code_verifier");

    if (state !== storedState) {
      throw new Error("State parameter mismatch");
    }

    if (!codeVerifier) {
      throw new Error("Code verifier not found");
    }

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    this.saveTokensToStorage(
      data.access_token,
      data.refresh_token,
      data.expires_in
    );

    // Clean up temporary storage
    localStorage.removeItem("code_verifier");
    localStorage.removeItem("auth_state");

    return data;
  }

  // Refresh access token
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    this.saveTokensToStorage(
      data.access_token,
      data.refresh_token || this.refreshToken,
      data.expires_in
    );

    return data;
  }

  // Check if token is valid and not expired
  isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiresAt) {
      return false;
    }
    return Date.now() < this.tokenExpiresAt - 60000; // 1 minute buffer
  }

  // Get valid access token (refresh if needed)
  async getValidToken(): Promise<string> {
    if (!this.isTokenValid()) {
      if (this.refreshToken) {
        await this.refreshAccessToken();
      } else {
        throw new Error("No valid token available. Please re-authenticate.");
      }
    }
    return this.accessToken!;
  }

  // Make authenticated API requests
  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const token = await this.getValidToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be invalid, try refreshing
        try {
          await this.refreshAccessToken();
          const newToken = await this.getValidToken();
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
              ...options.headers,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`API request failed: ${retryResponse.status}`);
          }

          return retryResponse.json();
        } catch (error) {
          // Refresh failed, user needs to re-authenticate
          this.logout();
          throw new Error("Authentication failed. Please log in again.");
        }
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  // Logout and clear tokens
  logout() {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expires_at");
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  // API Methods
  async getCurrentUser() {
    return this.makeAuthenticatedRequest("/me");
  }

  async getTopTracks(
    timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
    limit: number = 20
  ) {
    return this.makeAuthenticatedRequest(
      `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
    );
  }

  async getTopArtists(
    timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
    limit: number = 20
  ) {
    return this.makeAuthenticatedRequest(
      `/me/top/artists?time_range=${timeRange}&limit=${limit}`
    );
  }

  async getRecentlyPlayed(limit: number = 20) {
    return this.makeAuthenticatedRequest(
      `/me/player/recently-played?limit=${limit}`
    );
  }

  async createPlaylist(
    userId: string,
    name: string,
    description?: string,
    isPublic: boolean = false
  ) {
    return this.makeAuthenticatedRequest(`/users/${userId}/playlists`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        public: isPublic,
      }),
    });
  }

  async addTracksToPlaylist(playlistId: string, trackUris: string[]) {
    return this.makeAuthenticatedRequest(`/playlists/${playlistId}/tracks`, {
      method: "POST",
      body: JSON.stringify({
        uris: trackUris,
      }),
    });
  }
}

// Export singleton instance
export const spotifyAPI = new SpotifyAPI();
