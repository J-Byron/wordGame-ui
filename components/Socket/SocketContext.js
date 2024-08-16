// socketContext.js
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

const SocketContext = createContext();

const INACTIVITY_TIMEOUT = 600000; // 10 minutes = 600000 --> 20

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lobbyData, setLobbyData] = useState({ players: [] });

  // const [isManualDisconnect, setIsManualDisconnect] = useState(false);
  const [isInLobby, setIsInLobby] = useState(false);
  const [inactivityTimeout, setInactivityTimeout] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const lobbyRef = useRef(null);
  const router = useRouter();

  const resetInactivityTimeout = useCallback(() => {
    if (isConnected) {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      const timeout = setTimeout(() => {
        console.log("Disconnected due to inactivity");
        disconnect();
      }, INACTIVITY_TIMEOUT);

      console.log({ timeout });
      setInactivityTimeout(timeout);
    }

    // With this current functionality, if there is ANY update in the lobbyData it prevents all players from disconnecting
    // due to innactivity. This is useful because one player might make many guesses while other players spectate.
    //
    // However, players are disconnected in intervals if they are afk because if there are 4 players in lobby and one player leaves
    // it will update each player's lobby data to reflect the updated player list, causing all player's innactivity timer to
    // reset
  }, [lobbyData]);

  useEffect(() => {
    if (isConnected) {
      resetInactivityTimeout();
    }
  }, [isConnected, resetInactivityTimeout]);

  useEffect(() => {
    if (socket) {
      const handleBeforeUnload = (ev) => {
        ev.preventDefault();
        disconnect();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [socket]);

  const startSocket = useCallback(
    (fromUrl = false) => {
      const newSocket = io(process.env.NEXT_PUBLIC_GOOGLE_APP_ENGINE_BASE_URL_WSS, {
        // pingTimeout: 60000,
        // pingInterval: 25000,
        reconnection: false, // Disable automatic reconnection
        "sync disconnect on unload": true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
        resetInactivityTimeout();
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection failed", error);
      });

      newSocket.on("error", ({ message }) => {
        // Todo - notification
        console.log(message);
      });

      newSocket.on("joined_lobby", ({ lobbyId }) => {
        console.log(`Joined lobby ${lobbyId}`);
        setIsInLobby(true);
        lobbyRef.current = lobbyId;
        resetInactivityTimeout();
      });

      newSocket.on("lobby_data", ({ data }) => {
        // resetInactivityTimeout();
        const { isHost } = data.players.find((p) => p.socketId == newSocket.id);
        setIsHost(isHost);
        console.log(data);
        setLobbyData({ ...data });
      });

      newSocket.on("lobby_start_game", () => {
        console.log("Game started!");
        router.push(
          {
            pathname: `/${lobbyRef.current}`,
            query: { fromLobby: true },
          },
          `/${lobbyRef.current}`
        );
      });

      newSocket.on("lobby_disconnect", ({ player }) => {
        console.log(`${player} Left.`); // notifcation
      });

      newSocket.on("lobby_created", ({ lobbyId, data }) => {
        console.log("lobby created", lobbyId);
        setLobbyData(data);
        setIsHost(true);
        //   router.push(`/${lobbyId}`);
      });

      newSocket.on("lobby_full", (reason) => {
        console.log(reason);
      });

      newSocket.on("lobby_client_joined", ({ player }) => {
        console.log(`${player} joined.`); // notification
      });

      newSocket.on("lobby_client_disconnect", ({ player }) => {
        console.log(`${player} disconnected`);
      });

      newSocket.on("disconnect_reason", (reason) => {
        // TODO -> Move to notification
        console.log(reason);
        console.log("In disconnect reason");

        disconnect();
      });

      newSocket.on("client_notFound_guess", ({ word, message }) => {
        console.log(word, message);
      });

      // ! We would just be updating lobby_data
      // newSocket.on("lobby_guess_valid", (guesss) => {});

      setSocket(newSocket);
    },
    [resetInactivityTimeout]
  );

  const createLobby = () => {
    if (socket && isConnected) {
      console.log("...creating lobby");
      socket.emit("create_lobby", { lobbyId: lobbyRef.current });
    } else console.error("Socket not connected");
  };

  const joinLobby = (lobbyId) => {
    if (socket) {
      socket.emit("join_lobby", lobbyId);
    } else console.error("Socket not connected");
  };

  const startGame = () => {
    console.log("Starting game ... ");
    if (socket) {
      socket.emit("start_game", { lobbyId: lobbyRef.current });
    }
  };

  const disconnect = () => {
    console.log("disconnecting!");
    router.push("/");
    setLobbyData({ players: [] });
    setIsConnected(false);
    setIsInLobby(false);

    if (socket) {
      socket.emit("client_disconnect", { lobbyId: lobbyRef.current, socketId: socket.id });
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
      lobbyRef.current = null;
    } else console.error("Socket not connected");

    if (inactivityTimeout) {
      console.log("Clearing timout");
      clearTimeout(inactivityTimeout);
    }
  };

  const handleGuess = (word, level) => {
    socket.emit("client_guess", { word, lobbyId: lobbyRef.current, level: level, player: socket.id });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinLobby,
        isConnected,
        startSocket,
        createLobby,
        lobbyDetails: {
          levels: lobbyData.levels,
          isInGame: lobbyData.isInGame,
          gameState: lobbyData.gameState,
          isInLobby: lobbyData.isInLobby,
          players: lobbyData.players,
          lobbyId: lobbyRef.current,
        },
        disconnect,
        startGame,
        isHost,
        handleGuess,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

/**
 * @typedef {Object} LobbyDetails
 * @property {string[]} levels
 * @property {boolean} isInGame
 * @property {string} gameState
 * @property {boolean} isInLobby
 * @property {Object[]} players
 * @property {string} lobbyId
 */

/**
 * @typedef {Object} SocketContextType
 * @property {any} socket
 * @property {function} joinLobby
 * @property {boolean} isConnected
 * @property {function} startSocket
 * @property {function} createLobby
 * @property {LobbyDetails} lobbyDetails
 * @property {function} disconnect
 * @property {function} startGame
 * @property {boolean} isHost
 * @property {function} handleGuess
 */

/**
 * @returns {SocketContextType}
 */
export const useSocket = () => useContext(SocketContext);
