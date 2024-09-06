import { useState, useEffect } from "react";
import { useSocket } from "./Socket/SocketContext";
import PlayerLabel from "./Player/PlayerLabel";

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
  };

  return (
    <div className="lobbyModal_container">
      {/* LobbyId copy */}
      <div className="lobbyModal_lobbyHeader">
        <div>Lobby ID:</div>
        <div
          className="lobbyModal_lobbyId"
          onClick={() => {
            setDidCopy(true);
            navigator.clipboard.writeText(lobbyId);
          }}
        >
          {lobbyId}
        </div>
      </div>

      {/* Players */}
      <div className="lobbyModal_body">
        {players?.length >= 1 && (
          // <>
          //   <div className="lobbyModal_body_player">{players[0]?.name}</div>
          //   <div className="lobbyModal_body_player">{players[1]?.name || "Open slot"}</div>
          //   <div className="lobbyModal_body_player">{players[2]?.name || "Open slot"}</div>
          //   <div className="lobbyModal_body_player">{players[3]?.name || "Open slot"}</div>
          // </>
          <>
            <PlayerLabel
              player={players[0]}
              isCurrentPlayer={players[0]?.socketId == socket.id}
              canKick={isHost}
              handleKick={kickPlayer}
            />
            <PlayerLabel
              player={players[1]}
              isCurrentPlayer={players[1]?.socketId == socket.id}
              canKick={isHost}
              handleKick={kickPlayer}
            />
            <PlayerLabel
              player={players[2]}
              isCurrentPlayer={players[2]?.socketId == socket.id}
              canKick={isHost}
              handleKick={kickPlayer}
            />
            <PlayerLabel
              player={players[3]}
              isCurrentPlayer={players[3]?.socketId == socket.id}
              canKick={isHost}
              handleKick={kickPlayer}
            />
          </>
        )}
      </div>

      {/* Navigation ie start, back */}
      {isInLobby && footerButton()}
    </div>
  );
};

export default LobbyModal;
