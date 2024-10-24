import { createContext, useContext, useState } from "react";

const GuessNotificationContext = createContext({
  notificationState: null,
  notificationText: null,
  success: (string) => {},
  error: (string) => {},
  clear: () => {},
});

const STATES = {
  SUCCESS: "success",
  ERROR: "ERROR",
};

const GuessNotificationProvider = (props) => {
  const [notificationState, setNotificationState] = useState(null);
  const [notificationText, setNotificationText] = useState(null);

  const success = (text) => {
    setNotificationText(text);
    setNotificationState(STATES.SUCCESS);
  };

  const error = (text) => {
    setNotificationText(text);
    setNotificationState(STATES.ERROR);
  };

  const clear = () => {
    setNotificationText(null);
    setNotificationState(null);
  };

  return (
    <GuessNotificationContext.Provider
      value={{
        success,
        error,
        clear,
        notificationState,
        notificationText,
      }}
    >
      {props.children}
    </GuessNotificationContext.Provider>
  );
};

// const SocketContext = createContext();
export const useGuessNotificationContext = () =>
  useContext(GuessNotificationContext);
export { GuessNotificationProvider };
