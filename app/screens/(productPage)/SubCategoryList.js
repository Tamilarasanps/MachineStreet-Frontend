// import React from "react";
// import { Image, Platform, Pressable, Text, View } from "react-native";
// const SubCategoryList = ({
//   subCategories,
//   router,
//   selectedCategory,
//   industry,
// }) => {
//   const products =
//     subCategories?.length > 0 ? subCategories[0]?.productsWithFiles : [];

//   function handleProductPress(subCategory) {
//     if (Platform.OS === "web") {
//       router.push(
//         `/screens/(productPage)/ProductList?searchTerms=${subCategory}&category=${selectedCategory}&industry=${industry}`
//       );
//     } else {
//       navigation.navigate("ProductList", {
//         searchTerms: subCategory,
//         category: selectedCategory,
//         industry: industry,
//       });
//     }
//   }

//   return (
//     <View
//       className="grid gap-6 mt-4 px-4"
//       style={{
//         gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//       }}
//     >
//       {products?.length > 0 ? (
//         products.map((subCategory, index) => (
//           <View
//             key={index}
//             className="mb-6 bg-TealGreen rounded-2xl shadow-lg transition-transform transform hover:scale-105"
//             style={{ height: "420px", margin: "auto" }}
//           >
//             <Pressable
//               onPress={() => handleProductPress(subCategory?.subcategory)}
//             >
//               <Image
//                 className="rounded-t-2xl"
//                 source={{
//                   uri: `data:image/jpeg;base64,${subCategory?.machineImages[0]}`,
//                 }}
//                 style={{ width: "100%", height: 280 }}
//               />
//               <View className="p-6 space-y-2">
//                 <Text className="font-extrabold text-2xl text-white tracking-wide mb-1">
//                   {subCategory?.subcategory}
//                 </Text>
//                 <Text className="font-medium text-lg text-gray-200">
//                   {subCategory?.productCount} Listings Available |{" "}
//                   {subCategory?.makeCount} Different Brands
//                 </Text>
//               </View>
//             </Pressable>
//           </View>
//         ))
//       ) : (
//         <View className="col-span-full flex items-center justify-center h-64">
//           <Text className="text-xl font-bold text-gray-500">
//             😅 Oops! Nothing here yet... maybe the machines are on a break!
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default SubCategoryList;
