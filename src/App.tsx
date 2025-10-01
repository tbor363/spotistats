import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Overview from "./pages/Overview";
import TopTracks from "./pages/TopTracks";
import TopArtists from "./pages/TopArtists";
import TopGenres from "./pages/TopGenres";
import RecentlyPlayed from "./pages/RecentlyPlayed";

// import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";

function App() {
  return (
    // <AppLayout />
    <AppLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/top-genres" element={<TopGenres />} />
        <Route path="/recently-played" element={<RecentlyPlayed />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
