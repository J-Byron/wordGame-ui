import "@styles/styles.scss";
import { GuessNotificationProvider } from "@components/GuessNotification/guessNotificationManager";

function Application({ Component, pageProps }) {
  return (
    <GuessNotificationProvider>
      <Component {...pageProps} />
    </GuessNotificationProvider>
  );
}

export default Application;
