// socketContext.js
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { connect, io } from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const INACTIVITY_TIMEOUT = 300000 / 5; // 5 minutes

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const lobbyRef = useRef(null);
  const [isInLobby, setIsInLobby] = useState(false);
  const [lobbyData, setLobbyData] = useState({ players: [] });
  const [isManualDisconnect, setIsManualDisconnect] = useState(false);
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const resetInactivityTimeout = useCallback(() => {
    console.log("ressetting timeout");
    console.log(isConnected);
    if (isConnected) {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
        console.log("clearing");
      }
      const timeout = setTimeout(() => {
        console.log("disconnected due to innactivity");
        disconnect();
      }, INACTIVITY_TIMEOUT);
      setInactivityTimeout(timeout);
      console.log("setting");
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      resetInactivityTimeout();
    }
  }, [isConnected, resetInactivityTimeout]);

  const startSocket = useCallback(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_GOOGLE_APP_ENGINE_BASE_URL_WSS, {
      // pingTimeout: 60000,
      // pingInterval: 25000,
      reconnection: false, // Disable automatic reconnection
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      resetInactivityTimeout();
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection failed", error);
    });

    newSocket.on("joined_lobby", ({ lobbyId }) => {
      // Which lobby?
      console.log(`Joined lobby ${lobbyId}`);
      setIsInLobby(true);
      lobbyRef.current = lobbyId;
      resetInactivityTimeout();
      //   router.push(`/${lobbyId}`);
    });

    newSocket.on("lobby_data", ({ data }) => {
      console.log("Updating data");
      setLobbyData({ ...data });
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

    setSocket(newSocket);
  }, [resetInactivityTimeout]);

  const createLobby = () => {
    if (socket && isConnected) {
      console.log("...creating lobby");
      socket.emit("create_lobby");
    } else console.error("Socket not connected");
  };

  const joinLobby = (lobbyId) => {
    if (socket) {
      socket.emit("join_lobby", lobbyId);
    } else console.error("Socket not connected");
  };

  const disconnect = () => {
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
      clearTimeout(inactivityTimeout);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinLobby,
        isConnected,
        startSocket,
        createLobby,
        lobbyId: lobbyRef.current,
        isInLobby,
        lobbyData: lobbyData,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
