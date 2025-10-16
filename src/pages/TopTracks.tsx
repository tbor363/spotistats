import PageHeader from "../layout/PageHeader";
import TrackCard from "../components/TrackCard";
import { useCallback, useState } from "react";

function TopTracks() {
  const tracks = [
    {
      id: "1",
      name: "Clarity",
      artists: ["Zedd"],
      coverUrl:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      releaseDate: "2014-10-27",
      genres: ["Dance", "Electronic"],
      albumName: "Clarity",
    },
    {
      id: "2",
      name: "Stay The Night",
      artists: ["Zedd"],
      coverUrl:
        "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      releaseDate: "2013-09-10",
      genres: ["Dance", "Electronic"],
      albumName: "Clarity",
    },
  ];

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

  return (
    <>
      <PageHeader title="Top Tracks" subtitle="Your most listened to tracks" />
      <ul>
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
    </>
  );
}

export default TopTracks;
