// import { View, Text, Pressable } from "react-native";
// import React, { useState } from "react";
// import { TextInput } from "react-native-paper";
// import { responsiveFontSize } from "react-native-responsive-dimensions";
// import useApi from "@/app/hooks/useApi";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function Contact() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const {postJsonApi} = useApi();

//   async function formSubmit() {
//     try {
//       const token = await AsyncStorage.getItem('userToken')
//       const result = await postJsonApi('supportTicket',{
//         email : email,
//         message : message
//       },token)
//        if(result.status===200){
//         setEmail("")
//         setMessage("")
//        }
      
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   return (
//     <View className="bg-gray-200 mt-">
//       <Text
//         className="text-2xl font-bold flex justify-center items-center mt-8 mb-8 text-TealGreen"
//         style={{ fontSize: responsiveFontSize(1.5) }}
//       >
//         Ask Us Anything – We’ve Got You!
//       </Text>
//       <View className="items-center">
//         <TextInput
//           label="Enter your mail"
//           mode="outlined"
//           outlineColor="teal"
//           activeOutlineColor="teal"
//           style={{ width: "80%" }}
//           value={email}
//           onChangeText={setEmail}
//         />

//         <TextInput
//           label="Description"
//           mode="outlined"
//           outlineColor="teal"
//           activeOutlineColor="teal"
//           multiline
//           numberOfLines={6}
//           style={{ width: "80%", marginTop: 20 }}
//           value={message}
//           onChangeText={setMessage}
//         />
//       </View>
//       <View className="items-center">
//         <Pressable 
//         onPress={()=>formSubmit()}
//         className="bg-TealGreen mt-8 px-4 py-2 rounded-lg mb-8">
//           <Text className="text-white text-lg font-semibold">
//             Send a Message
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }
