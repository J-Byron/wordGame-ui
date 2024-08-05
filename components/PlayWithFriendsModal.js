import React, { useState, useEffect } from "react";
import { useSocket } from "./Socket/SocketContext";

/**
 * Create lobby
 * Connect to lobby
 * Invite friends
 * Start
 */

// TODO should be its own file because joiners will also see this screen

const LobbyLayout = () => {
  const [didCopy, setDidCopy] = useState(false);
  const {
    isConnected,
    startSocket,
    createLobby,
    lobbyId,
    lobbyDetails: { isInLobby },
    players,
    isHost,
    startGame,
  } = useSocket();

  useEffect(() => {
    if (!isConnected) {
      startSocket();
    }
  }, []);

  useEffect(() => {
    if (isConnected && !isInLobby) {
      createLobby();
    }
  }, [isConnected]);

  const footerButton = () => {
    if (isHost) {
      return (
        <div>
          <div className="lobbyLayout_startButton" onClick={startGame}>
            Start
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="lobbyLayout_guestButton">Waiting for host ...</div>
        </div>
      );
    }
  };

  return (
    <div className="lobbyLayout_container">
      {/* LobbyId copy */}
      <div className="lobbyLayout_lobbyHeader">
        <div>Lobby ID:</div>
        <div
          className="lobbyLayout_lobbyId"
          onClick={() => {
            setDidCopy(true);
            navigator.clipboard.writeText(lobbyId);
          }}
        >
          {lobbyId}
        </div>
      </div>

      {/* Players */}
      <div className="lobbyLayout_body">
        {players?.length >= 1 && (
          <>
            <div className="lobbyLayout_body_player">
              {/* <div className="LobbyLayout_body_player_icon"></div> */}
              <div className="lobbyLayout_body_player_name">{players[0]?.name}</div>
            </div>
            <div className="lobbyLayout_body_player">{players[1]?.name || "Open slot"} </div>
            <div className="lobbyLayout_body_player">{players[2]?.name || "Open slot"}</div>
            <div className="lobbyLayout_body_player">{players[3]?.name || "Open slot"}</div>
          </>
        )}
      </div>

      {/* Navigation ie start, back */}
      {footerButton()}
    </div>
  );
};

/**
 * Connect to lobby
 */
const JoinLayout = () => {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  const {
    joinLobby,
    isConnected,
    startSocket,
    lobbyDetails: { lobbyId },
  } = useSocket();

  useEffect(() => {
    if (!isConnected) {
      startSocket();
    }
  }, []);

  const validateInput = (value) => {
    const regex = /^[A-Za-z0-9]{5}$/;
    return regex.test(value);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    setIsValid(validateInput(value));
  };

  const handleJoinClick = () => {
    if (isValid) {
      joinLobby(inputValue);
    } else {
      console.log("Invalid lobbyId");
    }
  };

  return (
    <div className="joinLayout_container">
      <input
        className="joinLayout_input"
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={`type lobbyId here ...`}
      />
      <div className="joinLayout_joinButton" onClick={handleJoinClick}>
        Join
      </div>
    </div>
  );
};

export const PlayWithFriendsModal = ({ handleClose }) => {
  const layouts = { main: "main", lobby: "lobby", join: "join" };
  const [currentLayout, setCurrentLayout] = useState(layouts.main);
  const {
    isConnected,
    disconnect,
    lobbyDetails: { isInLobby },
  } = useSocket();

  useEffect(() => {
    if (!isConnected) {
      setCurrentLayout(layouts.main);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isInLobby) {
      setCurrentLayout(layouts.lobby);
    }
  }, [isInLobby]);

  return (
    <div
      className="playWithFriendsModal_backdrop"
      onClick={() => {
        handleClose();
        console.log("Closing modal");
        if (isConnected) disconnect();
      }}
    >
      <div className="modal_wrapper">
        <div className="modal_closeButton" />

        <div className="playWithFriendsModal_container" onClick={(e) => e.stopPropagation()}>
          {currentLayout === layouts.lobby && <LobbyLayout />}
          {currentLayout === layouts.join && <JoinLayout />}

          {/* <div onClick={toggleJoinLayout}>Join game</div> */}
          {currentLayout === layouts.main && (
            <>
              <div
                className="playWithFriendsModal_hostButton"
                onClick={() => {
                  setCurrentLayout(layouts.lobby);
                }}
              >
                Host game
              </div>
              <div
                className="playWithFriendsModal_joinButton"
                onClick={() => {
                  setCurrentLayout(layouts.join);
                }}
              >
                Join game
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
