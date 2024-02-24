import "@styles/styles.scss";
import { NotificationProvider } from "@components/Notification/notificationManager";

function Application({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}

export default Application;
