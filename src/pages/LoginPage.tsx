import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyAPI } from "../services/api";
import "../css/LoginPage.css";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (spotifyAPI.isAuthenticated()) {
      navigate("/overview");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await spotifyAPI.redirectToAuth();
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">SPOTISTATS</h1>

        <p className="login-description">
          Discover your music listening habits and create personalized playlists
          from your Spotify data.
        </p>

        <ul className="login-features">
          <li>View your top tracks and artists</li>
          <li>See your recently played music</li>
          <li>Generate custom playlists</li>
          <li>Analyze your listening patterns</li>
        </ul>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Connecting...
            </>
          ) : (
            <>
              <span className="music-icon">♫</span>
              Connect with Spotify
            </>
          )}
        </button>

        <p className="login-disclaimer">
          We'll redirect you to Spotify to authorize access to your music data.
          Your login information is never stored by this application.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
