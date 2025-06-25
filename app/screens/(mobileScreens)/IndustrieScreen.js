// import { View, Text, Pressable, SafeAreaView, Platform } from "react-native";
// import React, { useState, useEffect, useContext } from "react";

// import { LoadingContext } from "@/app/context/LoadingContext";

// import { ScrollView } from "react-native-gesture-handler";
// import useApi from "@/app/hooks/useApi";

// export default function IndustrieScreen({ navigation }) {
//   const { getJsonApi } = useApi();
//   const [categoryList, setCategoryList] = useState([]);
//   const {  startLoading, stopLoading } = useContext(LoadingContext);

//   const fetchDetails = async () => {
//     startLoading();
//     try {
//       const data = await getJsonApi(`categoryPage`);
//       setCategoryList(data.data.industries);
//       // console.log("Fetched Categories:", data.data.industries);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       stopLoading();
//     }
//   };

//   useEffect(() => {
//     fetchDetails();
//   }, []);

  

//   return (
//     <SafeAreaView>
//       <View className={`${Platform.OS !== "web" ? "mt-24" : "mt-0"}`}>
//         <View className="items-center mt-5">
//           <Text className="text-lg font-bold">All Industries List</Text>
//         </View>

//         <ScrollView>
//           <View className="flex items-center">
//             {categoryList.map((category, index) => (
//               <Pressable
//                 key={index}
//                 className="mt-3 bg-TealGreen w-[90%] h-[40] rounded-md flex items-center justify-center"
//                 onPress={() =>
//                   navigation.navigate("CategoryList", { industry: category })
//                 }
//               >
//                 <Text className="font-semibold text-xl text-white">
//                   {typeof category === "string" ? category : category.name}
//                 </Text>
//               </Pressable>
//             ))}
//           </View>
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }
