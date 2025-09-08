import React, { createContext } from "react";

export const FormatTime = createContext();

export const FormatTimeProvider = ({ children }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return timeString;
    } else if (isYesterday) {
      return `Yesterday • ${timeString}`;
    } else {
      const dayMonth = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      return `${dayMonth} • ${timeString}`;
    }
  };

  return (
    <FormatTime.Provider value={{ formatTime }}>
      {children}
    </FormatTime.Provider>
  );
};
