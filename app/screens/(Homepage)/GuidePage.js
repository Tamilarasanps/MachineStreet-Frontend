// import { View, Text, Image, Pressable, Platform } from "react-native";
// import React from "react";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { responsiveFontSize } from "react-native-responsive-dimensions";
// import { Link, router } from "expo-router";
// import { useNavigation } from "@react-navigation/native";

// export default function GuidePage() {
//   const navigation = useNavigation();
//   return (
//     <View className="bg-gray-200 ">
//       <View>
//         <Text
//           className="font-bold  text-TealGreen mt-3 flex items-center justify-center"
//           style={{ fontSize: responsiveFontSize(1.5) }}
//         >
//           Unlock the Power of Our Marketplace{" "}
//         </Text>

//         <Text
//           className="font-bold  mt-3 flex items-center justify-center"
//           style={{ fontSize: responsiveFontSize(1.5) }}
//         >
//           Get Started With Uploading Your Machine
//         </Text>
//         <View className="flex-1  mt-12 ">
//           {/* Main container */}
//           <View className="flex-col sm:flex-row md:flex-row lg:flex-row p-4">
//             {/* Item 1 */}
//             <View className="flex-1 items-center p-4">
//               <Icon name="rocket" size={60} color="teal" />
//               <Text className="text-xl font-bold mt-3">BE VISIBLE ONLINE</Text>
//               <Text className="mt-3 text-center">
//                 Hundreds of thousands of buyers visit our website each month to
//                 buy used machinery.
//               </Text>
//             </View>

//             {/* Item 2 */}
//             <View className="flex-1 items-center p-4">
//               <Icon name="account-group" size={60} color="teal" />
//               <Text className="text-xl font-bold mt-3">
//                 Get a dedicated partner
//               </Text>
//               <Text className="mt-3 text-center">
//                 From listing to selling, you are always in touch with an agent
//                 to assist you in the process.
//               </Text>
//             </View>

//             {/* Item 3 */}
//             <View className="flex-1 items-center p-4">
//               <Icon name="handshake" size={60} color="teal" />
//               <Text className="text-xl font-bold mt-3">Verified buyers</Text>
//               <Text className="mt-3 text-center">
//                 We filter all incoming inquiries so that you can deal with
//                 serious buyers only.
//               </Text>
//             </View>

//             {/* Item 4 */}
//             <View className="flex-1 items-center p-4">
//               <Icon name="briefcase" size={60} color="teal" />
//               <Text className="text-xl font-bold mt-3">Grow Your Business</Text>
//               <Text className="mt-3 text-center">
//                 Our Marketplace Provides Tools and Support to Help You Succeed!
//               </Text>
//             </View>
//           </View>

//           {/* Call to action button */}
//           <View className="items-center ">
//             <Pressable
//               className="bg-yellow-600 rounded-sm items-center justify-center text-lg text-white mt-4 mx-4 p-3  "
//               style={{ width: 200, marginBottom: 40 }}
//               onPress={() => router.push("/screens/(sellerForm)/SellScreen")}
//             >
//               <Text className="text-white text-lg font-bold">
//                 Sell Your Product
//               </Text>
//             </Pressable>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }
