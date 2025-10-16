import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Overview from "./pages/Overview";
import TopTracks from "./pages/TopTracks";
import TopArtists from "./pages/TopArtists";
import TopGenres from "./pages/GeneratePlaylist";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import LoginPage from "./pages/LoginPage";
import CallbackPage from "./pages/CallbackPage";
import ProtectedRoute from "./components/ProtectedRoute";

// import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />

      {/* Protected routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/overview"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Overview />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-tracks"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TopTracks />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-artists"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TopArtists />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recently-played"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RecentlyPlayed />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-playlist"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TopGenres />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
