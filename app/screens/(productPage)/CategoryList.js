// import {
//   View,
//   Text,
//   Image,
//   useWindowDimensions,
//   Pressable,
//   ScrollView,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import React, { useState } from "react";

// import Icon from "react-native-vector-icons/Ionicons";
// import { useLocalSearchParams } from "expo-router";
// import { useEffect } from "react";
// import { useRoute } from "@react-navigation/native";
// import { useRouter } from "expo-router";
// import useApi from "@/app/hooks/useApi";
// import Footer from "@/app/component/(footer)/Footer";
// import GuidePage from "../(Homepage)/GuidePage";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import All from "@/app/component/(subMenu)/All";
// import { Link } from "expo-router";
// import SubCategoryList from "./SubCategoryList";

// export default function CategoryList() {
//   const { width } = useWindowDimensions();
//   const router = useRouter();
//   const isScreen = width > 1024;
//   const [isOpen, setIsOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [IndustriesData, setIndustriesData] = useState([]);
//   const [totalCount, setTotalCount] = useState(null);
//   const route = useRoute();
//   const { getJsonApi } = useApi();
//   const navigation = useNavigation();
//   const geoCoords = { latitude: 11.0788608, longitude: 76.9327104 };
//   const [subCategories, setSubategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [industry, setIndustry] = useState("");

//   const { industry: webIndustry, category: webCategory } =
//     useLocalSearchParams();
//   useEffect(() => {
//     if (Platform.OS === "web") {
//       setIndustry(webIndustry);
//       if (webCategory) {
//         handleProductPress(webCategory);
//       }
//     } else {
//       industry = route?.params?.industry;
//     }
//   }, [webCategory, webIndustry, route]);
//   useEffect(() => {
//     if (industry) {
//       fetchCategories();
//     }
//   }, [industry]);
//   // useEffect(() => {
//   //   fetchDetails();
//   // }, []);

//   const fetchCategories = async () => {
//     try {
//       const data = await getJsonApi(`CategoryPage/${industry}/categoryPage`);
//       console.log( "check", data);
//       setCategories(data.data.categoryProducts.productsWithFiles);
//       setIndustriesData(() => data.data.industries.map((i) => i.name));
//       setTotalCount(data.data.categoryProducts.totalProductCount);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // const fetchDetails = async () => {
//   //   try {
//   //     const queraystring = new URLSearchParams(geoCoords).toString();
//   //     const data = await getJsonApi(`homepage/?${queraystring}`);

//   //     setIndustriesData(data.data.category);

//   //     // const apiData = await getJsonApi(`CategoryPage`);
//   //     // console.log("apidat", apiData);
//   //     // console.log(apiData.data.industries.industries);
//   //     // setIndustriesData(apiData.data.industries.industries);
//   //     // setIndustriesData(data.data.industries.industries || []);

//   //     console.log(data, "data categroypage");
//   //     console.log(queraystring);
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };

//   // const filterIndustry=IndustriesData.filter((item)=>item.industry.to)
//   // console.log("industry :", industry);
//   // const filteredIndustries = IndustriesData.filter(
//   //   (item) => item.toLowerCase().trim() === industry?.toLowerCase().trim()
//   // );
//   // console.log(filteredIndustries, "filterd");
//   // const handleProductPress = (category) => {
//   async function handleProductPress(category) {
//     setSelectedCategory(category);
//     try {
//       const data = await getJsonApi(
//         `CategoryPage/subCategoryPage/${category}/subCategoryPage`
//       );
//       if (data.status === 200) {
//         setSubategories([data.data]);
//         setTotalCount(data.data.totalProductCount);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   // console.log("cccc :", category);
//   // if (Platform.OS === "web") {
//   //   router.push(`/screens/(productPage)/ProductList?searchTerms=${category}`);
//   // } else {
//   //   navigation.navigate("ProductList", { searchTerms: category });
//   // }
//   // };

//   // const [subCategories, setSubCategories] = useState([]);
//   const [isSubCategoryView, setIsSubCategoryView] = useState(false);

//   // const handleProductPress = async (categoryName) => {
//   //   try {
//   //     const data = await getJsonApi(
//   //       `CategoryPage/subCategoryPage/${categoryName}&page=subCategoryPage`
//   //     );
//   //     setSubCategories(data || []);
//   //     setIsSubCategoryView(true);
//   //   } catch (error) {
//   //     setSubCategories([]);
//   //     setIsSubCategoryView(true);
//   //   }
//   // };

//   const handleBack = () => {
//     setSubategories([]);
//     setIsSubCategoryView(false);
//   };

//   return (
//     <ScrollView>
//       <SafeAreaView>
//         <View>
//           <All />
//           <View
//             className="flex flex-row p-2 mt-1 bg-zinc-100 shadow items-center "
//             style={{ zIndex: -1 }}
//           >
//             <Text className="">Home</Text>
//             <Ionicons
//               name="chevron-forward"
//               size={13}
//               color="black"
//               style={{ marginTop: 3 }} // Align chevron with "Home"
//             />

//             {IndustriesData?.filter(
//               (item) =>
//                 item.trim().toLowerCase() === industry?.trim().toLowerCase()
//             ).map((item, index) => (
//               <Text key={index} className="text-TealGreen font-bold">
//                 {item}
//               </Text>
//             ))}
//           </View>

//           <View
//             className="flex flex-row w-full relative flex items-center justify-center mt-2"
//             style={{ zIndex: -1 }}
//           >
//             <View
//               className={`bg-gray-200 transition-all duration-300 absolute  ${
//                 isOpen || isScreen ? "flex" : "hidden"
//               }`}
//               style={{
//                 width: isScreen ? "30%" : "90%",
//                 height: "100%",
//                 position: isScreen ? "relative" : "absolute",
//                 top: 0,
//               }}
//             >
//               <View className="flex items-center mt-4 z-50">
//                 {!isScreen && (
//                   <Pressable onPress={() => setIsOpen(false)} className="mb-4">
//                     <Icon name="close" size={30} color="black" />
//                   </Pressable>
//                 )}
//                 {IndustriesData?.length > 0 &&
//                   IndustriesData?.map((category, index) => (
//                     // <Pressable key={index}>
//                     <Link
//                       key={industry?.id || index}
//                       href={`/screens/CategoryList/?industry=${encodeURIComponent(
//                         category
//                       )}`}
//                       asChild
//                       className="mt-3 w-[90%] h-[40px] rounded-md flex p-2 items-center justify-start ml-8"
//                     >
//                       <Text className="font-semibold text-lg text-black text-left w-full cursor-pointer hover:text-red-600 hover:underline">
//                         {category}
//                       </Text>
//                     </Link>

//                     // </Pressable>
//                   ))}
//               </View>
//             </View>
//             <View
//               className="bg-zinc-200 ms-4 md:flex mb-4 py-8"
//               style={{ width: isScreen ? "70%" : "100%" }}
//             >
//               {!isScreen && (
//                 <Pressable
//                   onPress={() => setIsOpen(!isOpen)}
//                   className="mt-4 p-3"
//                 >
//                   <Icon name="menu" size={30} color="black" />
//                 </Pressable>
//               )}

//               <View className="flex-1 justify-center items-center ">
//                 <View className="p-4 w-[90%]">
//                   <Text className="bg-white shadow-md text-lg font-semibold md:text-2xl text-black p-3 rounded-lg">
//                     All Machine is ready for Sale (
//                     {totalCount ? totalCount : ""})
//                   </Text>
//                 </View>
//               </View>

//               {/* ✅ Product List */}
//               {subCategories?.length === 0 && categories?.length === 0 && (
//                 <View className="flex items-center justify-center h-64">
//                   <Text className="text-xl font-bold text-gray-500 text-center">
//                     😅 Oops! Nothing here yet... maybe the machines are on a
//                     break!
//                   </Text>
//                 </View>
//               )}

//               {subCategories?.length === 0 && categories?.length > 0 && (
//                 <View
//                   className="grid gap-6 mt-4 px-4"
//                   style={{
//                     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//                   }}
//                 >
//                   {categories?.map((category, index) => (
//                     <View
//                       key={index}
//                       className="mb-6 bg-TealGreen rounded-2xl shadow-lg transition-transform transform hover:scale-105"
//                       style={{ height: 420, margin: "auto" }}
//                     >
//                       <Pressable
//                         onPress={() => handleProductPress(category?.category)}
//                       >
//                         <Image
//                           className="rounded-t-2xl"
//                           source={{
//                             uri: `data:image/jpeg;base64,${category?.machineImages[0]}`,
//                           }}
//                           style={{ width: "100%", height: 280 }}
//                         />
//                         <View className="p-6 space-y-2">
//                           <Text className="font-extrabold text-2xl text-white tracking-wide mb-1">
//                             {category?.category}
//                           </Text>
//                           <Text className="font-medium text-lg text-gray-200">
//                             {category?.productCount} Listings Available |{" "}
//                             {category?.makeCount} Different Brands
//                           </Text>
//                         </View>
//                       </Pressable>
//                     </View>
//                   ))}
//                 </View>
//               )}

//               {subCategories?.length === 0 &&
//                 categories?.length > 0 &&
//                 isSubCategoryView && (
//                   <>
//                     <Pressable
//                       onPress={() => handleBack()}
//                       className="ml-4 mt-4 bg-gray-200 px-4 py-2 rounded"
//                     >
//                       <Text className="text-gray-800 font-semibold">
//                         ← Back to Categories
//                       </Text>
//                     </Pressable>
//                     <View className="flex items-center justify-center h-64">
//                       <Text className="text-xl font-bold text-gray-500 text-center">
//                         😅 Oops! Nothing here yet... maybe the machines are on a
//                         break!
//                       </Text>
//                     </View>
//                   </>
//                 )}

//               {subCategories?.length > 0 && (
//                 <>
//                   <Pressable
//                     onPress={() => handleBack()}
//                     className="ml-4 mt-4 bg-gray-200 px-4 py-2 rounded"
//                   >
//                     <Text className="text-gray-800 font-semibold">
//                       ← Back to Categories
//                     </Text>
//                   </Pressable>
//                   <View
//                     className="grid gap-6 mt-4 px-4"
//                     style={{
//                       gridTemplateColumns:
//                         "repeat(auto-fit, minmax(250px, 1fr))",
//                     }}
//                   >
//                     <SubCategoryList
//                       subCategories={subCategories}
//                       router={router}
//                       selectedCategory={selectedCategory}
//                       industry={industry}
//                     />
//                   </View>
//                 </>
//               )}
//             </View>
//           </View>

//           {Platform.OS === "web" && <GuidePage />}
//           {Platform.OS === "web" && <Footer />}
//         </View>
//       </SafeAreaView>
//     </ScrollView>
//   );
// }
