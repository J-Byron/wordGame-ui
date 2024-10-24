import { useGuessNotificationContext } from "./guessNotificationContext";

const GuessNotification = () => {
  const { notificationState, notificationText } = useGuessNotificationContext();

  return (
    <div className="guessNotification">
      {notificationState ? notificationText : " "}
    </div>
  );
};

export default GuessNotification;
