// components/NotificationManager.js
import React from "react";
import Notification from "./index";

const NotificationManager = ({ notifications, onRemove }) => {
  return (
    <div className="notificationManager">
      {notifications.map((notif) => (
        <Notification
          type={notif.type}
          key={notif.id}
          message={notif.message}
          timeout={notif.timeout}
          onRemove={() => onRemove(notif.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;
