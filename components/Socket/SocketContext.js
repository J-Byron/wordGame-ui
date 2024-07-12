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

    newSocket.on("joinedLobby", ({ player, data }) => {
      console.log();
      setLobbyData({ ...data });
      //   router.push(`/${lobbyId}`);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setSocket(null);
      setIsConnected(false);
      setIsInLobby(false);
    });

    newSocket.on("lobby_disconnect", ({ player }) => {
      console.log(`${player} Left.`); // notifcation
    });

    newSocket.on("lobbyCreated", ({ lobbyId }) => {
      console.log("lobby created", lobbyId);
      console.log("lobby joined", lobbyId);
      setIsInLobby(true);
      setLobbyId(lobbyId);
      //   router.push(`/${lobbyId}`);
    });

    newSocket.on("lobby_joinedLobby", ({ player, data }) => {
      console.log(`${player} joined.`); // notification
      setLobbyData({ ...data });
    });

    return () => {
      if (players.length > 2) {
        socket.emit("disconnecting", { lobbyId, socket: socket.id });
      }
      newSocket.disconnect();
    };
  }, []);

  const createLobby = () => {
    if (socket) {
      console.log("...creating lobby");
      socket.emit("createLobby");
    } else console.error("Socket not connected");
  };

  useEffect(() => {
    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        if (lobbyData?.players?.length > 1) {
          // let other players know you are disconnecting
          socket.emit("disconnecting", { lobbyId, socket: socket.id });
        }
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, startSocket, createLobby, lobbyId, isInLobby, lobbyData: lobbyData }}
    >
      {children}
    </SocketContext.Provider>
  );
};
