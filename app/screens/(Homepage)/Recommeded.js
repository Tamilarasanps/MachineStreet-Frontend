// import {
//   View,
//   Text,
//   Image,
//   Pressable,
//   ScrollView,
//   Platform,
// } from "react-native";
// import React from "react";
// import { useNavigation } from "@react-navigation/native";
// import { useRouter } from "expo-router";

// export default function Recommeded({ recommendedProducts }) {
//   const navigation = useNavigation();
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
//     <View>
//       <View className="bg-gray-200 mt-5">
//         <View className="flex flex-row items-center w-full px-2 mt-4">
//           <Text className="text-xl font-bold text-TealGreen">
//             Recommended For You
//           </Text>
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <View className="flex flex-row p-4 gap-4 items-center">
//             {recommendedProducts && recommendedProducts?.length > 0 ? (
//               recommendedProducts.map((product) => (
//                 <View
//                   className="rounded-md p-3 bg-white border-2 border-gray-300"
//                   key={product._id}
//                 >
//                   <Pressable onPress={() => handleProductPress(product._id)}>
//                     <View style={{ position: "relative" }}>
//                       <Image
//                         className="rounded-sm"
//                         source={
//                           product.machineImages?.[0]
//                             ? {
//                                 uri: `data:image/jpeg;base64,${product.machineImages[0]}`,
//                               }
//                             : ""
//                         }
//                         style={{ width: 250, height: 200 }}
//                       />
//                       <View className="flex flex-row items-center justify-between mt-4 mb-2">
//                         <View className="p-2 w-[100px] bg-TealGreen rounded-sm justify-center items-center">
//                           <Text className="text-white text-lg font-bold">
//                             ₹ {product.price}
//                           </Text>
//                         </View>
//                         <Text className="text-TealGreen font-bold text-lg">
//                           {product.condition}
//                         </Text>
//                       </View>
//                     </View>
//                     <View>
//                       <Text className="text-TealGreen font-semibold mt-2 mb-1">
//                         {product.category}
//                       </Text>
//                       <Text className="text-gray-600 font-semibold mt-1">
//                         {product.description?.length > 25
//                           ? product.description.slice(0, 25) + "...."
//                           : product.description}
//                       </Text>
//                     </View>
//                   </Pressable>
//                 </View>
//               ))
//             ) : (
//               <Text className="text-gray-600">
//                 No recommended products available
//               </Text>
//             )}
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// }
