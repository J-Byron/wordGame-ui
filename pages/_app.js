import "@styles/styles.scss";
import { GuessNotificationProvider } from "@components/GuessNotification/guessNotificationManager";
import { SocketProvider } from "@components/Socket/SocketContext";

function Application({ Component, pageProps }) {
  return (
    <SocketProvider>
      <GuessNotificationProvider>
        <Component {...pageProps} />
      </GuessNotificationProvider>
    </SocketProvider>
  );
}

export default Application;
