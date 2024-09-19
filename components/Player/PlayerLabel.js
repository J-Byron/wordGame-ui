import PlayerIcon from "./PlayerIcon";

const PlayerLabel = ({ player = undefined, isCurrentPlayer, canKick = false, handleKick, marginBottom = true }) => {
  if (!player) {
    return <div className="playerLabel_container_empty">Open slot</div>;
  }

  return (
    <div
      className={`playerLabel_container_notEmpty ${marginBottom ? "marginBottom" : ""}`}
      style={{ border: `3px solid #${player.color}` }}
    >
      <div className="playerLabel_icon">
        <PlayerIcon iconId={player.icon} color={player.color} />
      </div>
      <div className="playerLabel_name">{player.name}</div>
      {isCurrentPlayer && <div className="playerLabel_you">You</div>}
      {canKick && !isCurrentPlayer && (
        <div className="playerLabel_kick" onClick={() => handleKick(player)}>
          Kick
        </div>
      )}
    </div>
  );
};

export default PlayerLabel;
