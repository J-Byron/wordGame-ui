// socketContext.js
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { useNotification } from "@components/Notification/NotificationContext";
const SocketContext = createContext();

const INACTIVITY_TIMEOUT = 600000 / 2; // 10 minutes = 600000 --> 20

/**
 * @typedef {Object} LobbyData
 * @property {Array} players - List of players in the lobby
 * @property {Array} levels - List of available levels
 * @property {boolean} isInGame - Whether the game has started
 * @property {string} gameState - Current state of the game
 */

/**
 * Provider component for socket-related functionality
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lobbyData, setLobbyData] = useState({ players: [] });

  const [inactivityTimeout, setInactivityTimeout] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const lobbyRef = useRef(null);
  const router = useRouter();

  const { addSuccessNotification, addErrorNotification } = useNotification();
  /**
   * Resets the inactivity timeout
   */
  const resetInactivityTimeout = useCallback(() => {
    if (isConnected) {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      const timeout = setTimeout(() => {
        console.log("Disconnected due to inactivity");
        disconnect();
      }, INACTIVITY_TIMEOUT);

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

  /**
   * Initializes the socket connection
   * @param {string|null} fromUrl - The URL to connect from, if any
   */
  const startSocket = useCallback(
    (fromUrl = null) => {
      const newSocket = io(process.env.NEXT_PUBLIC_GOOGLE_APP_ENGINE_BASE_URL_WSS, {
        // pingTimeout: 60000,
        // pingInterval: 25000,
        "sync disconnect on unload": true,
        reconnection: false, // Disable automatic reconnection
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
        resetInactivityTimeout();

        if (fromUrl) {
          joinLobby(fromUrl);
        }
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected by server", reason);
        disconnect();
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection failed", error);
      });

      newSocket.on("error", (message) => {
        console.log(message);
        addErrorNotification(message);
        disconnect();
      });

      newSocket.on("joined_lobby", ({ lobbyId }) => {
        console.log(`Joined lobby ${lobbyId}`);
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
        addErrorNotification(`${player} Left.`);
        console.log(`${player} Left.`); // notifcation
      });

      newSocket.on("lobby_created", ({ lobbyId, data }) => {
        console.log("lobby created", lobbyId);
        setLobbyData(data);
        setIsHost(true);
      });

      newSocket.on("lobby_full", (reason) => {
        addErrorNotification(reason);
        console.log(reason);
      });

      newSocket.on("lobby_client_joined", ({ player }) => {
        console.log({ player });
        addSuccessNotification(`${player} joined.`);
      });

      newSocket.on("lobby_client_disconnect", ({ player }) => {
        addErrorNotification(`${player} disconnected.`);
      });

      newSocket.on("client_notFound_guess", ({ word }) => {
        addErrorNotification(`"${word}" was not found.`);
        // console.log(word, message);
      });

      newSocket.on("client_kicked", () => {
        addErrorNotification("You have been kicked from the lobby");
        disconnect();
      });

      // ! We would just be updating lobby_data
      // newSocket.on("lobby_guess_valid", (guesss) => {});

      setSocket(newSocket);
    },
    [resetInactivityTimeout]
  );

  /**
   * Creates a new lobby
   */
  const createLobby = () => {
    if (socket && isConnected) {
      console.log("...creating lobby");
      socket.emit("create_lobby", { lobbyId: lobbyRef.current });
    } else console.error("Socket not connected");
  };

  /**
   * Joins an existing lobby
   * @param {string} lobbyId - The ID of the lobby to join
   */
  const joinLobby = (lobbyId) => {
    if (socket) {
      socket.emit("join_lobby", lobbyId);
    } else console.error("Socket not connected");
  };

  /**
   * Starts the game
   */
  const startGame = () => {
    console.log("Starting game ... ");
    if (socket) {
      socket.emit("start_game", { lobbyId: lobbyRef.current });
    }
  };

  /**
   * Disconnects from the server and resets state
   */
  const disconnect = () => {
    console.log("Disconnecting from server");
    router.push("/");
    setLobbyData({ players: [] });
    setIsConnected(false);

    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
      lobbyRef.current = null;
    } else console.error("Socket not connected"); // This only occurs when user refreshes in a lobby where they are host

    if (inactivityTimeout) {
      console.log("Clearing timout");
      clearTimeout(inactivityTimeout);
    }
  };

  /**
   * Handles a player's guess
   * @param {string} word - The guessed word
   * @param {string} level - The level of the guess
   */
  const handleGuess = (word, level) => {
    socket.emit("client_guess", { word, lobbyId: lobbyRef.current, level: level, player: socket.id });
  };

  /**
   * Changes the game level
   * @param {string} level - The new level
   */
  const handleChangeLevel = (level) => {
    socket.emit("lobby_change_level", { lobbyId: lobbyRef.current, level });
  };

  /**
   * Kicks a player from the lobby
   * @param {Object} player - The player to kick
   */
  const kickPlayer = (player) => {
    console.log("Kicking player", { player });
    socket.emit("lobby_kick_player", { socketId: player.socketId });
  };

  return (
    <SocketContext.Provider
      value={{
        lobbyInfo: {
          levels: lobbyData.levels,
          isInGame: lobbyData.isInGame,
          gameState: lobbyData.gameState,
          isInLobby: lobbyData.isInLobby,
          players: lobbyData.players,
          lobbyId: lobbyRef.current,
          isHost,
        },
        socket,
        joinLobby,
        isConnected,
        startSocket,
        createLobby,
        disconnect,
        startGame,
        handleGuess,
        handleChangeLevel,
        kickPlayer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

/**
 * @typedef {Object} lobbyInfo
 * @property {string[]} levels
 * @property {boolean} isInGame
 * @property {string} gameState
 * @property {boolean} isInLobby
 * @property {Object[]} players
 * @property {string} lobbyId
 * @property {boolean} isHost
 */

/**
 * @typedef {Object} SocketContextType
 * @property {any} socket
 * @property {function} joinLobby
 * @property {boolean} isConnected
 * @property {function} startSocket
 * @property {function} createLobby
 * @property {lobbyInfo} lobbyInfo
 * @property {function} disconnect
 * @property {function} startGame
 * @property {function} handleGuess
 * @property {function} handleChangeLevel
 * @property {function} kickPlayer
 */

/**
 * Custom hook to access the SocketContext
 * @returns {SocketContextType}
 */
export const useSocket = () => useContext(SocketContext);
