import { useGuessNotificationContext } from "./guessNotificationManager";

const Notification = () => {
  const { notificationState, notificationText } = useGuessNotificationContext();

  return <div className="notification">{notificationState ? notificationText : " "}</div>;
};

export default Notification;
