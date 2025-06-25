// import React from "react";
// import { View, Text } from "react-native";

// const ChatBubble = ({ message, sender, createdAt, time, seen }) => {
//   const isUser = sender === "user";

//   const formattedTime = new Date(time).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <>
//       {createdAt && <Text className="text-center text-gray-500 text-xs my-2">{createdAt}</Text>}
//       <View
//         className={`max-w-[80%] px-4 py-2 my-1 rounded-lg ${
//           isUser ? "bg-green-300 self-end" : "bg-gray-300 self-start"
//         }`}
//       >
//         <Text className={`${isUser ? "text-black" : "text-gray-800"}`}>{message}</Text>
//         <Text className="text-xs text-gray-600 mt-1 self-end">{formattedTime}</Text>
//       </View>
//       {seen && isUser && <Text className="text-xs text-gray-600 self-end">Seen</Text>}
//     </>
//   );
// };

// export default ChatBubble;
