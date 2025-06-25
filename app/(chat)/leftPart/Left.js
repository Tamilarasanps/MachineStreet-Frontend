// import React, { useState } from "react";
// import { View } from "react-native";
// import Search from "./Search";
// import User from "./User";
// import { Text } from "react-native-paper";
// import { ScrollView } from "react-native-gesture-handler";
// import useGetAllUsers from "@/app/context/useGetAllUsers";

// const Left = ({ width, setUserClick, userClick }) => {
//   const [allUser] = useGetAllUsers();
//   const [searchKey, setSearchKey] = useState("");

//   return (
//     <View
//       className={`h-screen  ${
//         width >= 1024
//           ? "w-[30%]"
//           : userClick
//           ? "w-full hidden"
//           : "w-full visible"
//       } bg-blue-300`}
//     >
//       <View className='h-[15%] "w-full bg-TealGreen'>
//         <Search searchKey={searchKey} setSearchKey={setSearchKey} />
//       </View>
//       <ScrollView className="h-[85%] bg-gray-200">
//         <User
//           allUser={allUser}
//           setUserClick={setUserClick}
//           searchKey={searchKey}
//         />
//       </ScrollView>
//     </View>
//   );
// };

// export default Left;
