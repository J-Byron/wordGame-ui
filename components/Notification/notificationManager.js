import { useState, createContext } from "react";

const NotificationContext = createContext({
  notificationState: null,
  notificationText: null,
  success: () => {},
  error: () => {},
});

const STATES = {
  SUCCESS: "success",
  ERROR: "ERROR",
};

const NotificationProvider = (props) => {
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
    <NotificationContext.Provider
      value={{
        success,
        error,
        clear,
        notificationState,
        notificationText,
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider };
export default NotificationContext;
