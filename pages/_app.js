import "@styles/styles.scss";
import { GuessNotificationProvider } from "@components/GuessNotification/guessNotificationContext";
import { SocketProvider } from "@components/Socket/SocketContext";
import { NotificationProvider } from "@components/Notification/NotificationContext";

function Application({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <GuessNotificationProvider>
        <SocketProvider>
          <Component {...pageProps} />
        </SocketProvider>
      </GuessNotificationProvider>
    </NotificationProvider>
  );
}

export default Application;
