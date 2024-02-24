import { useContext } from "react";
import NotificationContext from "./notificationManager";

const Notification = () => {
  const notificationCtx = useContext(NotificationContext);
  return <div>{notificationCtx.notificationText}</div>;
};

export default Notification;
