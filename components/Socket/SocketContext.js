// socketContext.js
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { connect, io } from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const INACTIVITY_TIMEOUT = 300000 / 5; // 10 minutes = 600000

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
      setInactivityTimeout(timeout);
    }
  }, [isConnected]);

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

  const startSocket = useCallback(() => {
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
      console.log("Updating data");
      resetInactivityTimeout();
      const { isHost } = data.players.find((p) => p.socketId == newSocket.id);
      if (isHost) setIsHost(true);
      console.log("Is host?", isHost);
      setLobbyData({ ...data });
    });

    newSocket.on("lobby_start_game", () => {
      console.log("Game started!");
      router.push(`/${lobbyRef.current}`);
    });

    newSocket.on("lobby_disconnect", ({ player }) => {
      console.log(`${player} Left.`); // notifcation
    });

    newSocket.on("lobby_created", ({ lobbyId }) => {
      console.log("lobby created", lobbyId);
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

    newSocket.on("client_guess_invalid", (word) => {});

    // ! We would just be updating lobby_data
    // newSocket.on("lobby_guess_valid", (guesss) => {});

    setSocket(newSocket);
  }, [resetInactivityTimeout]);

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
    setLobbyData({ players: [] });
    setIsConnected(false);
    setIsInLobby(false);

    if (socket) {
      socket.emit("client_disconnect", { lobbyId: lobbyRef.current, socketId: socket.id });
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
      lobbyRef.current = null;
      router.push("/");
    } else console.error("Socket not connected");

    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }
  };

  const handleGuess = (word) => {
    socket.emit("client_word_guess", { word, lobbyId: lobbyRef.current });
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
          isInGame: lobbyData.isInGame,
          gameState: lobbyData.gameState,
          isInLobby: lobbyData.isInLobby,
          players: lobbyData.players,
          lobbyId: lobbyRef.current,
        },
        disconnect,
        startGame,
        isHost,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
