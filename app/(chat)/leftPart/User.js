// import React from "react";
// import { View, Text, FlatList, Pressable } from "react-native";
// import { Avatar } from "@rneui/themed";
// import useConversation from "@/app/stateManagement/useConversation";

// const User = ({ allUser, setUserClick, setSearchKey, searchKey }) => {
//   const { selectedConversation, setSelectedConversation } = useConversation();
// // console.log('allUser :', allUser)
//   // Filter users based on searchKey
//   const filteredUsers = allUser.filter(
//     (user) =>
//       user.username?.toLowerCase().includes(searchKey.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchKey.toLowerCase()) ||
//       user.mobile?.number?.includes(searchKey) // Assuming mobile is a string
//   );

//   return (
//     <FlatList
//       data={filteredUsers} // Use filtered data
//       keyExtractor={(item) => item._id.toString()}
//       renderItem={({ item }) => {
//         const isSelected = selectedConversation === item._id;
//         return (
//           <Pressable
//             onPress={() => {
//               setUserClick(true);
//               setSelectedConversation(item._id);
//             }}
//             className={`p-4 duration-300 ${
//               isSelected ? "bg-slate-500" : "bg-blue-300 hover:bg-slate-500"
//             }`}
//           >
//             <View className="flex flex-row gap-8">
//               <Avatar
//                 size={64}
//                 rounded
//                 source={{
//                   uri: item.userImage
//                     ? item.userImage
//                     : "https://randomuser.me/api/portraits/men/36.jpg",
//                 }}
//               />
//               <View className="gap-1">
//                 <Text className="text-lg font-bold">{item.username}</Text>
//                 <Text>{item.email}</Text>
//               </View>
//             </View>
//           </Pressable>
//         );
//       }}
//     />
//   );
// };

// export default User;
