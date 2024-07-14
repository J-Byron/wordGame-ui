import React, { useState, useEffect } from "react";
import { useSocket } from "./Socket/SocketContext";

/**
 * Create lobby
 * Connect to lobby
 * Invite friends
 * Start
 */

// TODO should be LobbyLayout and in its own file because joiners will also see this screen
const HostLayout = () => {
  const [lobbyValue, setLobbyValue] = useState("");
  const [didCopy, setDidCopy] = useState(false);
  const { isConnected, startSocket, createLobby, lobbyId, isInLobby, lobbyData, socket } = useSocket();

  useEffect(() => {
    if (!isConnected) startSocket();
  }, []);

  useEffect(() => {
    if (isConnected && !isInLobby) {
      createLobby();
    }
  }, [isConnected]);

  const { players } = lobbyData;

  return (
    <div className="hostLayout_container">
      {/* LobbyId copy */}
      <div className="hostLayout_lobbyHeader">
        <div>Lobby ID:</div>
        <div
          className="hostLayout_lobbyId"
          onClick={() => {
            setDidCopy(true);
            navigator.clipboard.writeText(lobbyId);
          }}
        >
          {lobbyId}
        </div>
      </div>

      {/* Players */}
      <div className="hostLayout_body">
        {players?.length >= 1 && (
          <>
            <div className="hostLayout_body_player">
              {/* <div className="hostLayout_body_player_icon"></div> */}
              <div className="hostLayout_body_player_name">{players[0]?.name}</div>
            </div>
            <div className="hostLayout_body_player">{players[1]?.name || "Open slot"} </div>
            <div className="hostLayout_body_player">{players[2]?.name || "Open slot"}</div>
            <div className="hostLayout_body_player">{players[3]?.name || "Open slot"}</div>
          </>
        )}
      </div>

      {/* Navigation ie start, back */}
      <div>
        <div className="hostLayout_startButton">Start</div>
      </div>
    </div>
  );
};

/**
 * Connect to lobby
 */
const JoinLayout = () => {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  const { joinLobby, isConnected, startSocket } = useSocket();

  useEffect(() => {
    if (!isConnected) startSocket();
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
  const layouts = { main: "main", host: "host", join: "join" };
  const [currentLayout, setCurrentLayout] = useState(layouts.main);
  const { socket, isConnected, disconnect } = useSocket();

  useEffect(() => {
    if (!isConnected) {
      setCurrentLayout(layouts.main);
    }
  }, [isConnected]);

  return (
    <div
      className="playWithFriendsModal_backdrop"
      onClick={() => {
        handleClose();
        if (socket) disconnect();
      }}
    >
      <div className="modal_wrapper">
        <div className="modal_closeButton" />

        <div className="playWithFriendsModal_container" onClick={(e) => e.stopPropagation()}>
          {currentLayout === layouts.host && <HostLayout />}
          {currentLayout === layouts.join && <JoinLayout />}

          {/* <div onClick={toggleJoinLayout}>Join game</div> */}
          {currentLayout === layouts.main && (
            <>
              <div
                className="playWithFriendsModal_hostButton"
                onClick={() => {
                  setCurrentLayout(layouts.host);
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
