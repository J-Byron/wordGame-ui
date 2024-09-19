import React, { useState, useEffect } from "react";
import { useSocket } from "./Socket/SocketContext";
import { useRouter } from "next/router";

const JoinModal = () => {
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
      <form
        name="joinForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleJoinClick();
        }}
      >
        <input
          className="joinLayout_input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={`type lobbyId here ...`}
        />
      </form>
      <div className="joinLayout_joinButton" onClick={handleJoinClick}>
        Join
      </div>
    </div>
  );
};

export default JoinModal;
