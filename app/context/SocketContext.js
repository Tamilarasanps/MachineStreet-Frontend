import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/app/context/AuthProvider";
import io from "socket.io-client";

const socketContext = createContext();

// Hook to use socket context
export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser, setAuthUser] = useContext(AuthContext);

  useEffect(() => {
    if (authUser) {  // ✅ Checking if authUser is valid
      const newSocket = io("https://api.machinestreets.com", {
        transports: ["websocket", "polling"],
        query: {
          token : authUser,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        console.log('users :', users)
        if (Array.isArray(users)) {   
          setOnlineUsers(users);
        }
      });

      return () => newSocket.disconnect();
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
