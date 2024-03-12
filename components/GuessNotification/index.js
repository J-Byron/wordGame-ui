import { useContext } from "react";
import NotificationContext from "./guessNotificationManager";

const Notification = () => {
  const { notificationState, notificationText } =
    useContext(NotificationContext);

  return (
    <div className="notification">
      {notificationState ? notificationText : "     "}
    </div>
  );
};

export default Notification;
