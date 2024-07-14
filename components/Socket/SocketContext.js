// socketContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lobbyId, setLobbyId] = useState(null); // can be pulled from lobbyData
  const [isInLobby, setIsInLobby] = useState(false);
  const [lobbyData, setLobbyData] = useState({ players: [] });

  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const startSocket = useCallback(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_GOOGLE_APP_ENGINE_BASE_URL);
    console.log("newsocket created");
    setSocket(newSocket);

    newSocket.on("connect", async () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection failed", error);
    });

    newSocket.on("joined_lobby", ({ lobbyId }) => {
      // Which lobby?
      console.log(`Joined lobby ${lobbyId}`);
      setIsInLobby(true);
      setLobbyId(lobbyId);
      //   router.push(`/${lobbyId}`);
    });

    newSocket.on("lobby_data", ({ data }) => {
      console.log("Updating data");
      setLobbyData({ ...data });
    });

    newSocket.on("disconnect", () => {
      console.log("Someone disconnected");
    });

    newSocket.on("lobby_disconnect", ({ player }) => {
      console.log(`${player} Left.`); // notifcation
    });

    newSocket.on("lobby_created", ({ lobbyId }) => {
      console.log("lobby created", lobbyId);
      //   router.push(`/${lobbyId}`);
    });

    newSocket.on("lobby_client_joined", ({ player }) => {
      console.log(`${player} joined.`); // notification
    });

    newSocket.on("lobby_client_disconnect", ({ player }) => {
      console.log(`${player} disconnected`);
    });

    return () => {
      console.log("socket unmount");
      disconnect();
    };
  }, []);

  const cleanSocketListeners = () => {
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("joined_lobby");
    socket.off("lobby_data");
    socket.off("disconnect");
    socket.off("lobby_disconnect");
    socket.off("lobby_created");
    socket.off("lobby_client_joined");
    socket.off("lobby_client_disconnect");
  };

  const createLobby = () => {
    if (socket) {
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
    if (socket) {
      socket.emit("client_disconnect", { lobbyId, socketId: socket.id });

      setSocket(null);
      setIsConnected(false);
      setIsInLobby(false);

      cleanSocketListeners();
      socket.disconnect();
    } else console.error("Socket not connected");
  };

  useEffect(() => {
    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinLobby,
        isConnected,
        startSocket,
        createLobby,
        lobbyId,
        isInLobby,
        lobbyData: lobbyData,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
