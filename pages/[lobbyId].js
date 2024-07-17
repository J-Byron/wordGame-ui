import React from "react";
import { useSocket } from "@components/Socket/SocketContext";

const lobbyId = () => {
  const { lobbyId, lobbyData } = useSocket();
  return (
    <div>
      <div>{lobbyId}</div>
      <div>{lobbyData.players}</div>
    </div>
  );
};

export default lobbyId;
