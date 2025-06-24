// import React, { useState } from "react";
// import { View, Text, ScrollView } from "react-native";
// import ChatBubble from "./ChatBubble";
// import useGetMessages from "@/app/context/useGetMessages";
// import useConversation from "@/app/stateManagement/useConversation";
// import useGetSocketMessage from "@/app/context/useGetSocketMessage";
// const Message = () => {
//   const { messages, userNotFound } = useGetMessages(); // Get messages from API
//   const { selectedConversation } = useConversation();
//   let prevDate;
//   const today = new Date().toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//   });

//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);

//   const yesterdayStr = yesterday.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//   });
//   useGetSocketMessage();

//   return (
//     <ScrollView style={{ padding: 16 }}>
//       {messages?.length > 0 ? (
//         messages.map((msg) => {
//           const msgDate = new Date(msg.createdAt).toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//           });

//           let displayDate =
//             msgDate === today
//               ? "Today"
//               : msgDate === yesterdayStr
//               ? "Yesterday"
//               : msgDate;

//           const showDate = msgDate !== prevDate;
//           prevDate = msgDate;

//           return (
//             <ChatBubble
//               key={msg._id}
//               message={msg.message}
//               sender={
//                 msg.receiverId === selectedConversation ? "user" : "other"
//               }
//               createdAt={showDate ? displayDate : ""}
//               time={msg.createdAt}
//               seen={msg.seen}
//             />
//           );
//         })
//       ) : (
//         <View className="flex items-center justify-center ">
//           <Text>Say Hi!</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// export default Message;
