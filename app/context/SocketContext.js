import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const socketContext = createContext();

// Hook to use socket context
export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    let newSocket;

    const initSocket = async () => {
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        // newSocket = io("http://192.168.1.10:5000", {
          const newSocket = io("https://api.machinestreets.com", {
          transports: ["websocket", "polling"],
          query: { token }, // use the retrieved token here
          withCredentials: true,
        });

        // console.log("socket reached");
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (users) => {
          if (Array.isArray(users)) {
            setOnlineUsers(users);
          }
        });

        newSocket.on("connect_error", (err) => {
          console.log("Socket connect_error:", err.message);
        });

        newSocket.on("error", (err) => {
          console.log("Socket error:", err);
        });
      } else {
        if (socket) {
          socket.disconnect();
          setSocket(null);
          // console.log("disconnected :");
        }
      }
    };

    initSocket();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
