import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import useConversation from "../stateManagement/useConversation";


const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessage } = useConversation();

  useEffect(() => {
    const handleNewMessage = async (newMessage) => {
      try {
        // const { sound } = await Audio.Sound.createAsync(
        //   require("../assets/notification.mp3")
        // );
        // await sound.playAsync();
        setMessage([...messages, newMessage]);
      } catch (error) {
        console.log("Error playing notification sound:", error);
      }
    };

    if (socket) {
      socket.on("newMessage", handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket, messages, setMessage]);
};

export default useGetSocketMessage;
