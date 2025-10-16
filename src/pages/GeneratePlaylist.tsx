import PageHeader from "../layout/PageHeader";
import TrackCard from "../components/TrackCard";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { useCallback, useState } from "react";

import { spotifyAPI } from "../services/api";
import "../css/GeneratePlaylist.css";

function TopTracks() {
  const initialTracks: Array<{
    id: string;
    name: string;
    artists: string[];
    coverUrl: string;
    releaseDate: string;
    genres: string[];
    albumName: string;
  }> = [];

  const [tracks, setTracks] = useState(initialTracks);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected: (id: string) => boolean = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleSelect: (id: string) => void = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      console.log(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setSelectedIds(new Set()), []);
  const selectAll = useCallback(
    () => setSelectedIds(new Set(tracks.map((t) => t.id))),
    [tracks]
  );

  const selectedCount = selectedIds.size;

  const displayItemsBasedOnDropdown = useCallback(async (option: string) => {
    setIsLoading(true);
    try {
      console.log("Display items based on:", option);

      if (option === "Top Tracks") {
        const response = await spotifyAPI.getTopTracks("short_term");
        console.log("Top Tracks:", response);

        const mappedTracks = response.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          artists: item.artists.map((artist: any) => artist.name),
          coverUrl: item.album.images[0]?.url || "",
          releaseDate: item.album.release_date,
          genres: ["default"], // Spotify API does not provide genres for tracks directly
          albumName: item.album.name,
        }));

        setTracks(mappedTracks);
        console.log("Mapped Tracks:", mappedTracks);
      } else if (option === "Top Artists") {
        const response = await spotifyAPI.getTopArtists("short_term");
        console.log("Top Artists:", response);

        // Convert artists to track-like format for display
        const mappedArtists = response.items.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          artists: [],
          coverUrl: artist.images[0]?.url || "",
          releaseDate: "",
          genres: artist.genres || ["default"],
          albumName: "",
        }));

        setTracks(mappedArtists);
        console.log("Mapped Artists:", mappedArtists);
      } else if (option === "Recently Played") {
        const response = await spotifyAPI.getRecentlyPlayed();
        console.log("Recently Played:", response);

        const mappedTracks = response.items.map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists.map((artist: any) => artist.name),
          coverUrl: item.track.album.images[0]?.url || "",
          releaseDate: item.track.album.release_date,
          genres: ["default"],
          albumName: item.track.album.name,
        }));

        setTracks(mappedTracks);
        console.log("Mapped Recently Played:", mappedTracks);
      }

      // Clear selections when new data is loaded
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(async () => {
    if (selectedIds.size === 0) return;

    setIsLoading(true);
    try {
      const user = await spotifyAPI.getCurrentUser();
      console.log("Current User:", user);

      const playlistName = "My Generated Playlist";
      const playlistDescription = "Playlist created with Spotistats";

      const playlist = await spotifyAPI.createPlaylist(
        user.id,
        playlistName,
        playlistDescription,
        false
      );
      console.log("Created Playlist:", playlist);

      const trackUris = tracks
        .filter((track) => selectedIds.has(track.id))
        .map((track) => `spotify:track:${track.id}`);

      if (trackUris.length > 0) {
        await spotifyAPI.addTracksToPlaylist(playlist.id, trackUris);
        console.log("Added tracks to playlist:", trackUris);
      }

      alert(`Playlist "${playlistName}" created successfully!`);
      // Optionally, clear selections and tracks after creation
      setSelectedIds(new Set());
      setTracks([]);
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIds, tracks]);

  return (
    <>
      <PageHeader
        title="Generate Playlist"
        subtitle="Create a new playlist from your favorite tracks"
      />
      <div className="page-actions">
        <Dropdown
          label="Create Playlist From"
          options={[
            "Top Tracks",
            "Top Artists",
            "Recently Played",
            "Liked Songs",
          ]}
          onSelect={displayItemsBasedOnDropdown}
        />
        <Button
          label="Clear All"
          onClick={clearAll}
          disabled={selectedCount === 0}
        />
        <Button
          label="Select All"
          onClick={selectAll}
          disabled={selectedCount === tracks.length}
        />
        <Button
          label="Create Playlist"
          onClick={createPlaylist}
          disabled={selectedCount === 0}
        />
      </div>

      {isLoading ? (
        <div className="generate-playlist-loading">
          <div className="generate-playlist-spinner"></div>
          Loading tracks...
        </div>
      ) : tracks.length === 0 ? (
        <div className="generate-playlist-empty">
          <div className="generate-playlist-empty-icon">🎵</div>
          <h3 className="generate-playlist-empty-title">
            No tracks to display
          </h3>
          <p className="generate-playlist-empty-description">
            Please select an option from the dropdown above to load your Spotify
            data and start creating your playlist.
          </p>
        </div>
      ) : (
        <ul className="generate-playlist-tracks-list">
          {tracks.map((track, index) => (
            <TrackCard
              key={track.id}
              rank={index + 1}
              track={track}
              selected={isSelected(track.id)}
              onToggle={() => toggleSelect(track.id)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TopTracks;
