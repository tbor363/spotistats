import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { spotifyAPI } from "../services/api";
import "../css/CallbackPage.css";

const CallbackPage = () => {
  const [status, setStatus] = useState("Processing...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          setStatus(`Authorization failed: ${error}`);
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        if (!code || !state) {
          setStatus("Invalid callback parameters");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        setStatus("Exchanging code for access token...");
        await spotifyAPI.exchangeCodeForToken(code, state);

        setStatus("Login successful! Redirecting...");
        setTimeout(() => navigate("/overview"), 1000);
      } catch (error) {
        console.error("Callback error:", error);
        setStatus(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="callback-container">
      <h2 className="callback-title">Spotify Authorization</h2>
      <p className="callback-status">{status}</p>
      <div className="callback-spinner"></div>
    </div>
  );
};

export default CallbackPage;
