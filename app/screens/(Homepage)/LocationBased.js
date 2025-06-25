// import {
//   View,
//   Text,
//   Image,
//   useWindowDimensions,
//   Platform,
//   ScrollView,
//   Pressable,
// } from "react-native";
// import React from "react";
// import { useRouter } from "expo-router";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";

// export default function LocationBased({ locationProducts }) {
//   const { width } = useWindowDimensions();
//   const navigation = useNavigation();
//   const isLargeScreen = width > 600;
//   const router = useRouter();

//   const handleProductPress = (product) => {
//     if (Platform.OS === "web") {
//       router.push({
//         pathname: "/screens/(productPage)/SelectProduct",
//         params: { id: product },
//       });
//     } else {
//       navigation.navigate("SelectProduct", { id: product });
//     }
//   };

//   return (
//     <View className="bg-gray-100 mb-10">
//       <View className="flex flex-row items-center w-full px-2 mt-4 mb-4">
//         <Text className="text-xl font-bold text-TealGreen">Location</Text>
//       </View>

//       <ScrollView
//         horizontal={isLargeScreen}
//         showsHorizontalScrollIndicator={Platform.OS === "web"}
//       >
//         <View
//           className={`gap-4 mb-6 px-4 ${
//             isLargeScreen ? "flex-row" : "flex-col"
//           }`}
//         >
//           {locationProducts?.map((product) => (
//             <Pressable
//               key={product._id}
//               className="bg-white rounded-md p-4 border-2 border-gray-300"
//               style={{ width: isLargeScreen ? 350 : "100%" }}
//               onPress={() => handleProductPress(product._id)}
//             >
//               <Image
//                 className="rounded-sm"
//                 style={{ width: "100%", height: 200 }}
//                 source={{
//                   uri: `data:image/jpeg;base64,${product.machineImages[0]}`,
//                   obejectFit: "cover",
//                 }}
//               />
//               <View className="flex flex-row items-center mt-3 justify-between">
//                 <View className="p-2 w-[100px] bg-TealGreen rounded-sm justify-center items-center">
//                   <Text className="text-white text-lg font-bold">
//                     ₹ {product.price}
//                   </Text>
//                 </View>
//                 <Text className="type text-TealGreen font-bold text-lg ml-3">
//                   {product.condition}
//                 </Text>
//               </View>
//               <Text className="name text-TealGreen font-semibold mt-2">
//                 {product.category}
//               </Text>

//               <Text className="year text-gray-600 font-semibold mt-2">
//                 {`${product.yearOfMake} (Manufactured Year)`}
//               </Text>

//               <View className="flex flex-row mt-2 ">
//                 <Icon
//                   name="location-on"
//                   size={30}
//                   color="grey"
//                   style={{ marginLeft: -8 }}
//                 />
//                 <Text className="year text-gray-600 font-semibold mt-2">
//                   {product.district || product.region || "Tirupur"}
//                 </Text>
//               </View>
//             </Pressable>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
