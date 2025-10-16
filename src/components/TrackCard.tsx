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
    <div className={`list-item ${selected ? "selected" : ""}`}>
      <div className="list-rank">
        <h1>{rank}.</h1>
      </div>
      <div className="track-card">
        <div className="track-card-cover">
          <img src={track.coverUrl} alt={`${track.name} cover`} />
        </div>
        <div className="track-card-info">
          <div className="track-top-row">
            <span className="track-card-name">{track.name}</span>
            <span className="track-card-top-separator">-</span>
            <span className="track-card-artist">
              {track.artists.join(", ")}
            </span>
          </div>
          <div className="track-middle-row">
            <span className="track-card-album">{track.albumName}</span>
          </div>
          <div className="track-bottom-row">
            <span className="track-card-genre">{track.genres[0]}</span>
            <span className="track-card-bottom-separator">|</span>
            <span className="track-card-date">
              Released {track.releaseDate}
            </span>
          </div>
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
