// components/Notification.js
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

const Notification = ({ message, type, timeout, onRemove }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout]);

  console.log(message);
  return (
    <CSSTransition
      appear
      in={show}
      timeout={300}
      classNames={{
        appear: "notificationEnter",
        appearActive: "notificationEnterActive",
        enter: "notificationEnter",
        enterActive: "notificationEnterActive",
        exit: "notificationExit",
        exitActive: "notificationExitActive",
      }}
      unmountOnExit
      onExited={onRemove}
    >
      <div className={`notification ${type}`}>{message}</div>
    </CSSTransition>
  );
};

export default Notification;
