import { useEffect, useState } from "react";
import { useSocket } from "./Socket/SocketContext";
import PlayerLabel from "./Player/PlayerLabel";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LobbyModal = () => {
  const [didCopy, setDidCopy] = useState(false);
  const {
    isConnected,
    startSocket,
    createLobby,
    lobbyInfo: { lobbyId, players, isInLobby, isInGame, isHost },
    startGame,
    socket,
    kickPlayer,
  } = useSocket();

  useEffect(() => {
    if (!isConnected) {
      startSocket();
    }
  }, []);

  useEffect(() => {
    if (isConnected && !isInLobby && !isInGame) {
      createLobby();
    }
  }, [isConnected]);

  const footerButton = () => {
    if (isInLobby) {
      if (isHost) {
        return (
          <div>
            <div className="lobbyModal_startButton" onClick={startGame}>
              Start
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="lobbyModal_guestButton">Waiting for host ...</div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <div className="lobbyModal_guestButton">Creating lobby ...</div>
        </div>
      );
    }
  };

  return (
    <div className="lobbyModal_container">
      {/* LobbyId copy */}
      <div className="lobbyModal_lobbyHeader">
        <div>Lobby ID:</div>
        {isInLobby || isInGame
          ? (
            <div
              className={`lobbyModal_lobbyId ${didCopy ? "copied" : ""}`}
              onClick={() => {
                if (!didCopy) {
                  setDidCopy(true);
                  setTimeout(() => {
                    setDidCopy(false);
                  }, 1500);
                }
                navigator.clipboard.writeText(lobbyId);
              }}
            >
              {didCopy ? "Copied!" : lobbyId}
            </div>
          )
          : (
            <Skeleton
              count={1}
              height={41}
              width={98}
              baseColor="#b7b7b75e"
              className="lobbyModal_lobbyId"
              containerClassName="skeleton_container"
              duration={1.5}
            />
          )}
      </div>

      {/* Players */}
      <div className="lobbyModal_body">
        <>
          <PlayerLabel
            player={players[0]}
            isCurrentPlayer={players[0]?.socketId == socket?.id}
            canKick={isHost}
            handleKick={kickPlayer}
          />
          <PlayerLabel
            player={players[1]}
            isCurrentPlayer={players[1]?.socketId == socket?.id}
            canKick={isHost}
            handleKick={kickPlayer}
          />
          <PlayerLabel
            player={players[2]}
            isCurrentPlayer={players[2]?.socketId == socket?.id}
            canKick={isHost}
            handleKick={kickPlayer}
          />
          <PlayerLabel
            player={players[3]}
            isCurrentPlayer={players[3]?.socketId == socket?.id}
            canKick={isHost}
            handleKick={kickPlayer}
          />
        </>
      </div>

      {/* Navigation ie start, back */}
      {!isInGame && footerButton()}
    </div>
  );
};

export default LobbyModal;
