import "@styles/styles.scss";
import { GuessNotificationProvider } from "@components/GuessNotification/guessNotificationManager";
import { SocketProvider } from "@components/Socket/SocketContext";

function Application({ Component, pageProps }) {
  return (
    <GuessNotificationProvider>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </GuessNotificationProvider>
  );
}

export default Application;
