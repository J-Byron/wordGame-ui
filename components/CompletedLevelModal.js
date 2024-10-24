import { useEffect, useState } from "react";
import Confetti from "./Confetti";
import { useSocket } from "./Socket/SocketContext";
import PlayerLabel from "./Player/PlayerLabel";
import PlayerStatistics from "./Player/PlayerStatistics";

const CompletedLevelModal = ({
  level,
  handleClose,
  handleNextClick,
  handleSeeClosestWordsClick,
  correctWord = null,
  stats,
  isMultiplayer = false,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const {
    socket,
    lobbyInfo: { players, isHost },
  } = useSocket();

  const toggleConfetti = () => setShowConfetti(!showConfetti);

  // Reset the lottie key on every (render && completedLevel)
  useEffect(() => {
    // Basically I want the lottie to reset everytime the user switches from completed level to completed level
    // The issue is that the only way to conditionally reset a lottie is to edit the @key property and
    // I need to do it on every render in case the user switches between completed levels
    toggleConfetti();
  }, [level]);

  // Works for singleplayer but not multiplayer

  const singlePlayerStats = () => {
    const {
      guesses,
      green,
      yellow,
      red,
      longestColdStreak,
      longestHotStreak,
      percentile,
    } = stats;
    return (
      <>
        <div>
          total guesses: <span className="bold">{guesses}</span>
        </div>
        <div className="completedLevelmodal_colors">
          <div>{green}</div>
          <div>{yellow}</div>
          <div>{red}</div>
        </div>
        <div>
          best hot streak : 🔥 <span className="bold">{longestHotStreak}</span>
        </div>
        <div>
          worst cold streak : ❄️{" "}
          <span className="bold">{longestColdStreak}</span>
        </div>
        <div>
          percentile: <span className="bold">{percentile}</span>
        </div>
      </>
    );
  };
  const multiplayerStats = () => {
    return players.map((player) => {
      return (
        <PlayerStatistics
          key={player.socketId}
          statistics={stats[player.socketId]}
          player={player}
          isCurrentPlayer={socket.id === player.socketId}
        />
      );
    });
  };

  return (
    <div>
      <div
        className="completedLevelmodal_backdrop"
        onClick={() => handleClose()}
      >
        <Confetti toggle={showConfetti} />
        <div className="modal_wrapper">
          <div className="modal_closeButton" />
          <div
            className="completedLevelmodal_container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="completedLevelmodal_title">
              You completed level {level}!
            </span>
            <div className="completedLevelmodal_word">{correctWord}</div>
            <div className="completedLevelmodal_statsContainer">
              {isMultiplayer ? multiplayerStats() : singlePlayerStats()}
            </div>
            {(isHost || !isMultiplayer) && (
              <div className="completedLevelmodal_footer">
                <div
                  className="completedLevelmodal_closeButton"
                  onClick={handleClose}
                >
                  Close
                </div>
                <div
                  className="completedLevelmodal_closeButton"
                  onClick={handleSeeClosestWordsClick}
                >
                  see closest words
                </div>
                <div
                  className="completedLevelmodal_nextButton"
                  onClick={handleNextClick}
                >
                  Next
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedLevelModal;
