// contexts/NotificationContext.js
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [refreshNotifications, setRefreshNotifications] = useState(false);

  const triggerRefresh = () => {
    setRefreshNotifications(true);
    // Se puede resetear con un timeout para que siempre vuelva a estar disponible
    setTimeout(() => setRefreshNotifications(false), 100);
  };

  return (
    <NotificationContext.Provider
      value={{ refreshNotifications, triggerRefresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
