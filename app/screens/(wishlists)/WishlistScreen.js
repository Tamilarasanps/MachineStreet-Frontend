// import React, { useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   Platform,
//   Pressable,
//   SafeAreaView,
// } from "react-native";

// import { FontAwesome } from "@expo/vector-icons"; // ✅ Correct import
// import { useFocusEffect } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import useWishlist from "@/app/hooks/useWishlist";
// import { router } from "expo-router";
// import useApi from "@/app/hooks/useApi";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";

// const WishlistScreen = () => {
//   const { getJsonApi } = useApi();
//   const { addToWishlist } = useWishlist();
//   const [products, setProducts] = useState([]);

//   const navigation = useNavigation();

//   const getWishList = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       if (!token) {
//         if (Platform.OS === "web") {
//           router.replace("/screens/(auth)/(login)/Login");
//         } else {
//           navigation.replace("LoginPage");
//         }
//         return;
//       }
//       const response = await getJsonApi("wishlist", token);

//       setProducts(response.data);
//     } catch (err) {
//       console.error("Failed to fetch wishlist:", err);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       getWishList();
//     }, [])
//   );

//   return (
//     <SafeAreaView>
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <View style={{ flex: 1 }}>
//           <View style={{ zIndex: -1 }}>
//             <Text className="text-xl font-bold my-8 mx-5">
//               My WishList ({products?.length})
//             </Text>

//             {/* Grid structure for wishlist */}
//             <View
//               className="grid gap-4 mt-2 px-4"
//               style={{
//                 gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Responsive grid columns
//               }}
//             >
//               {/* Iterate through the wishlist items */}
//               {products.map((item, index) => (
//                 <View
//                   key={index}
//                   style={{
//                     width: Platform.OS !== "web" ? "90%" : "100%",
//                     maxWidth: 400, // Ensure cards don't stretch too much on wider screens
//                     margin: "auto",
//                   }}
//                   className="bg-white rounded-sm flex flex-col p-4 mb-4 h0max"
//                 >
//                   {/* Image Section */}
//                   <View className="mb-4 w-full bg-blue-300 sm:h-[150px] h-[200px] mx-auto">
//                     <Image
//                       source={{
//                         uri: `data:image/jpeg;base64,${item?.machineImages[0]}`,
//                       }}
//                       style={{
//                         width: "100%",
//                         height: 250,
//                         borderRadius: 3,
//                         objectFit: "cover",
//                       }}
//                     />
//                   </View>

//                   {/* Product Info Section */}
//                   <View className="flex-1 mt-24">
//                     {/* Row 1: Name and Star Icon */}
//                     <View className="flex flex-row items-center justify-between">
//                       <Text className="font-semibold text-lg font-bold text-TealGreen">
//                         {item.category}
//                       </Text>
//                       <View className="flex flex-row  gap-8 justify-end mt-4">
//                         <FontAwesome name="share" size={24} color="gray" />
//                         <Pressable
//                           onPress={async () => {
//                             const f = await addToWishlist(item);
//                             setProducts((prev) => [
//                               ...prev.filter((i) => i._id !== item._id),
//                             ]);
//                           }}
//                         >
//                           <FontAwesome name="star" size={24} color={"red"} />
//                         </Pressable>
//                       </View>
//                     </View>

//                     {/* Row 2: Machine Name and Share Icon */}

//                     {/* Price and Negotiable */}
//                     <View className="flex flex-row gap-8 mt-6">
//                       <View className="h-10 w-[100px] bg-TealGreen rounded-sm justify-center items-center">
//                         <Text className="text-white text-lg">
//                           ${item.price}
//                         </Text>
//                       </View>
//                       <View
//                         className="h-10 w-[100px] rounded-sm justify-center items-center"
//                         style={{ backgroundColor: "#FFD700" }}
//                       >
//                         <Text className="text-lg">Negotiable</Text>
//                       </View>
//                     </View>

//                     {/* Chat Button */}
//                     <View className="mt-8 h-10 w-[100px] bg-TealGreen rounded-sm justify-center items-center">
//                       <Text className="text-white text-lg">Chat</Text>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default WishlistScreen;
