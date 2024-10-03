// context/NotificationContext.js
import React, { createContext, useContext, useState } from "react";
import NotificationManager from "./NotificationManager";

const NotificationContext = createContext();

const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addSuccessNotification = (message, timeout = 3000) => {
    const newNotification = {
      id: Date.now(),
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      timeout,
    };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  const addErrorNotification = (message, timeout = 3000) => {
    const newNotification = {
      id: Date.now(),
      type: NOTIFICATION_TYPES.ERROR,
      message,
      timeout,
    };
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addSuccessNotification, addErrorNotification }}>
      <NotificationManager notifications={notifications} onRemove={removeNotification} />
      {children}
    </NotificationContext.Provider>
  );
};
