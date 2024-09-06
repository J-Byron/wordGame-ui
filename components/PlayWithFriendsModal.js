import React, { useState, useEffect } from "react";
import { useSocket } from "./Socket/SocketContext";
import PlayerLabel from "./Player/PlayerLabel";
import LobbyModal from "./LobbyModal";
import { useRouter } from "next/router";

/**
 * Create lobby
 * Connect to lobby
 * Invite friends
 * Start
 */

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
    lobbyInfo: { lobbyId, isInGame },
  } = useSocket();

  const router = useRouter();

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
      //TODO
      console.log("Invalid lobbyId");
    }
  };

  useEffect(() => {
    if (isInGame) {
      router.push(
        {
          pathname: `/${lobbyId}`,
          query: { fromLobby: true },
        },
        `/${lobbyId}`
      );
    }
  }, [isInGame]);

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
    lobbyInfo: { isInLobby },
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
          {currentLayout === layouts.lobby && <LobbyModal />}
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
