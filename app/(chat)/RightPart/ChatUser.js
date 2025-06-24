// import React from "react";
// import { View, Text } from "react-native";
// import { Avatar } from "@rneui/themed";
// import useGetAllUsers from "@/app/context/useGetAllUsers";
// import useConversation from "@/app/stateManagement/useConversation";
// import { Pressable } from "react-native-gesture-handler";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useSocketContext } from "@/app/context/SocketContext";
// import { router } from "expo-router";
// import { goBack } from "expo-router/build/global-state/routing";
// import { SafeAreaView } from "react-native-safe-area-context";

// const ChatUser = ({ setUserClick, width }) => {
//   const [allUsers] = useGetAllUsers();
//   const { selectedConversation } = useConversation();
//   const receiver = allUsers.find((user) => user._id === selectedConversation);
//   const { onlineUsers } = useSocketContext();
// // console.log("chats reacvhed")
// //   console.log('onlineUsers :', onlineUsers)

//   return (
//     <SafeAreaView
//       edges={["top"]}
//       className="bg-yellow-500 w-full h-[12%] flex flex-row p-2 gap-8 items-center"
//     >
//       <Pressable onPress={() => router.push(goBack)}>
//         <Ionicons
//           name="arrow-back"
//           size={24}
//           color="white"
//           className={`${width >= 1024 ? "hidden" : "visible"}`}
//         />
//       </Pressable>
//       <Avatar
//         size={64}
//         rounded
//         source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
//       />
//       <View className="gap-1">
//         <Text className="text-lg font-bold">{receiver?.username}</Text>
//         <Text className="">
//           {onlineUsers.includes(selectedConversation) ? "online" : ""}
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChatUser;
