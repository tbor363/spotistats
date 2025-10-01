import "../css/TrackCard.css";
import "../css/ListItem.css";
import type { Track } from "../types/spotify";

interface Props {
  track: Track;
  rank: number;
  selected: boolean;
  onToggle: () => void;
}

function TrackCard({ track, rank, selected, onToggle }: Props) {
  return (
    <div className={"list-item" + (selected ? " active" : "")}>
      <div className="list-rank">
        <h1>{rank}.</h1>
      </div>
      <div className="track-card">
        <div className="track-card-cover">
          <img src={track.coverUrl} alt={`${track.name} cover`} />
        </div>
        <div className="track-card-info">
          <h3 className="track-card-title">{track.name}</h3>
          <p className="track-card-artist">{track.artists.join(", ")}</p>
        </div>
        <div className="track-card-button">
          <button
            className="track-card-add"
            onClick={onToggle}
            aria-pressed={selected}
          >
            {/* {selected ? "" : "+"} */}+
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackCard;
