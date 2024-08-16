import PlayerIcon from "./PlayerIcon";

const PlayerLabel = ({ player = undefined, isCurrentPlayer }) => {
  if (!player) {
    return <div className="playerLabel_container_empty">Open slot</div>;
  }

  return (
    <div className="playerLabel_container_notEmpty">
      <div className="playerLabel_icon">
        <PlayerIcon iconId={player.icon} color={player.color} />
      </div>
      <div className="playerLabel_name">{player.name}</div>
      {isCurrentPlayer && <div className="playerLabel_you">You</div>}
    </div>
  );
};

export default PlayerLabel;
