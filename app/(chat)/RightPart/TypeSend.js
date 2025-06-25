// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Pressable,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import useApi from "@/app/hooks/useApi";
// import useConversation from "@/app/stateManagement/useConversation";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const TypeSend = () => {
//   const [msg, setMsg] = useState("");
//   const { selectedConversation } = useConversation();
//   const { postJsonApi } = useApi();

//   // console.log("selectedCnversation :", selectedConversation)

//   const postMsg = async () => {
//     if (!msg.trim()) return; // Prevent sending empty messages

//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       const data = await postJsonApi(
//         `message/send/${selectedConversation}`,
//         { message: msg },
//         token
//       );
//       setMsg(""); // Clear the input after sending
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={100}
//      className="bg-TealGreen"
//     >
//       <View className="w-[90%] mx-auto h-16 mb-4 px-4 mt-4 flex-row items-center bg-white rounded-full">
//         <TextInput
//           value={msg}
//           className="flex-1 px-4 h-full"
//           placeholder="Type a message..."
//           placeholderTextColor="#A0AEC0"
//           onChangeText={setMsg}
//           keyboardType="default"
//           onSubmitEditing={postMsg}
//           returnKeyType="send"
//         />
//         <Pressable
//           className="px-2"
//           onPress={() => {
//             postMsg();
//           }}
//         >
//           <MaterialIcons name="send" size={24} color="black" />
//         </Pressable>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default TypeSend;
