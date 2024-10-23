import React, { useEffect, useState } from "react";
import { useSocket } from "./Socket/SocketContext";
import LobbyModal from "./LobbyModal";
import JoinModal from "./JoinModal";

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
        if (isConnected) disconnect();
      }}
    >
      <div className="modal_wrapper">
        <div className="modal_closeButton" />

        <div
          className="playWithFriendsModal_container"
          onClick={(e) => e.stopPropagation()}
        >
          {currentLayout === layouts.lobby && <LobbyModal />}
          {currentLayout === layouts.join && <JoinModal />}

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
