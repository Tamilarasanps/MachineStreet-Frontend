// import {
//   SafeAreaView,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform,
//   Pressable,
//   Text,
//   Image,
//   TextInput,
//   View,
//   useWindowDimensions,
// } from "react-native";
// import { FlatList } from "react-native";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import React from "react";

// import useApi from "@/app/hooks/useApi";
// import ImageAndVideo from "./ImageAndVideo";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Checkbox from "expo-checkbox";
// import { Picker } from "@react-native-picker/picker"; // Import Picker
// // import ImageCarousel from "./ImageCarousel";
// import { router } from "expo-router";
// // import Location from "./Location";
// import Mobile from "../(auth)/(SignIn)/Mobile";
// import Location from "../(Homepage)/Location";
// import DropDownPicker from "react-native-dropdown-picker";
// import useGeoLocation from "@/app/hooks/GeoLocation";

// export default function SellScreen() {
//   const { width } = useWindowDimensions();
//   const { getJsonApi } = useApi();
//   const { postJsonApi } = useApi();

//   const [location, setLocation] = useState({
//     coords: "",
//     country: "",
//     region: "",
//     district: "",
//   });
//   const { geoCoords, address } = useGeoLocation();

//   const [selectedImage, setSelectedImage] = useState([]);
//   const [selectedVideo, setSelectedVideo] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [makes, setMakes] = useState([]);
//   const [price, setPrice] = useState("");
//   const [priceType, setPriceType] = useState("");
//   const [description, setDescription] = useState("");

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [selectedCode, setSelectedCode] = useState("+91");

//   const [condition, setCondition] = useState("");
//   const [imageModal, setImageModal] = useState(false);

//   const years = Array.from(
//     { length: new Date().getFullYear() - 1899 },
//     (_, i) => 2025 - i
//   );
//   const [yearItems, setYearItems] = useState(
//     years.map((year) => ({ label: year.toString(), value: year }))
//   );
//   const [selectedYear, setSelectedYear] = useState("");
//   const [openYear, setOpenYear] = useState(false);

//   // const [openState, setOpenState] = useState(false);
//   // const [openDistrict, setOpenDistrict] = useState(false);
//   // const [selectedState, setSelectedState] = useState(null);
//   // const [selectedDistrict, setSelectedDistrict] = useState(null);
//   // const [openCountry, setOpenCountry] = useState(false);
//   // const [selectedCountry, setSelectedCountry] = useState("India");

//   // search COmponenets
//   const [searchValues, setSearchValues] = useState({
//     industry: "",
//     category: "",
//     subcategory: "",
//     make: "",
//   });

//   // fetching industries
//   useEffect(() => {
//     const fetchIndustries = async () => {
//       try {
//         try {
//           const data = await getJsonApi(`CategoryPage`);
//           setIndustries(data?.data.industries.industries);
//         } catch (error) {
//           console.error(error);
//         }
//       } catch (err) {}
//     };
//     fetchIndustries();
//   }, []);

//   // fetching categories

//   const getCategory = async () => {
//     try {
//       const inputCategory = searchValues.industry.toLowerCase().trim();

//       const isValidCategory = industries.some(
//         (cat) => cat.toLowerCase().trim() === inputCategory
//       );

//       if (isValidCategory && inputCategory.length > 0) {
//         const data = await getJsonApi(
//           `CategoryPage/${searchValues.industry}/sell`
//         );
//         setCategories(data.data.categoryNames);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getSubCategory = async () => {
//     try {
//       const inputCategory = searchValues.category.toLowerCase().trim();

//       const isValidCategory = categories.some(
//         (cat) => cat.toLowerCase().trim() === inputCategory
//       );

//       if (isValidCategory && inputCategory.length > 0) {
//         const data = await getJsonApi(
//           `CategoryPage/subCategoryPage/${searchValues.category}/sell`
//         );

//         setSubCategories(data.data);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // fetching makes
//   const getMakes = async () => {
//     try {
//       const inputCategory = searchValues.subcategory.toLowerCase().trim();

//       const isValidCategory = subCategories.some(
//         (cat) => cat.toLowerCase().trim() === inputCategory
//       );

//       if (isValidCategory && inputCategory.length > 0) {
//         const data = await getJsonApi(
//           `CategoryPage/${searchValues.subcategory}`
//         );
//         setMakes(data.data);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // setting searchValues
//   const handleChange = (key, value) => {
//     setSearchValues((prev) => ({ ...prev, [key]: value }));
//   };

//   const sentData = async (e) => {
//     e.preventDefault();

//     if (
//       !searchValues?.industry?.trim() ||
//       !searchValues?.category?.trim() ||
//       !searchValues?.subcategory?.trim() ||
//       !searchValues?.make?.trim() ||
//       !price?.trim() ||
//       !description?.trim() ||
//       !priceType?.trim() ||
//       !phoneNumber?.trim() ||
//       !condition?.trim() ||
//       !selectedYear ||
//       !String(location?.coords || "").trim() ||
//       !String(location?.region || "").trim() ||
//       !String(location?.country || "").trim()
//     ) {
//       Toast.show({
//         type: "error",
//         text1: "Missing Fields",
//         text2: "Please fill all required fields before submitting.",
//         position: "top",
//         topOffset: 0,
//       });
//       return;
//     }
//     if (
//       (!Array.isArray(selectedImage) || selectedImage.length === 0) &&
//       (!Array.isArray(selectedVideo) || selectedVideo.length === 0)
//     ) {
//       Toast.show({
//         type: "error",
//         text1: "No Media Selected",
//         text2: "Please upload at least one image or video.",
//         position: "top",
//         topOffset: 0,
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("industry", searchValues.industry);
//     formData.append("category", searchValues.category);
//     formData.append("subcategory", searchValues.subcategory);
//     formData.append("make", searchValues.make);
//     formData.append("price", price);
//     formData.append("priceType", priceType);
//     formData.append("description", description);
//     formData.append("countryCode", selectedCode);
//     formData.append("number", phoneNumber.trim("0"));
//     formData.append("condition", condition);
//     formData.append("yearOfMake", selectedYear);
//     formData.append("location", JSON.stringify(location));
//     // Append all images
//     selectedImage.forEach((image) => {
//       formData.append("images", image.file);
//     });

//     // Append all videos
//     selectedVideo.forEach((video, index) => {
//       formData.append("videos", video.file);
//     });

//     const token = await AsyncStorage.getItem("userToken");

//     try {
//       const response = await postJsonApi("productupload", formData, token);

//       // axios.post(
//       //   "http://192.168.1.5:5000/productupload",
//       //   formData,
//       //   {
//       //     headers: { "Content-Type": "multipart/form-data" },
//       //   }
//       // );
//       if (response.status === 201 || response.status === 200) {
//         // Toast.show({
//         //   type: "success",
//         //   text1: "Success",
//         //   text2: response.data.message || "Data uploaded successfully!",
//         //   position: "top",
//         //   topOffset: 0,
//         // });

//         setTimeout(() => {
//           setSearchValues({
//             industry: "",
//             category: "",
//             subcategory: "",
//             make: "",
//           });
//           setPrice("");
//           setPriceType("");
//           setDescription("");
//           setSelectedImage([]);
//           setCondition("");
//           setSubCategories([]);
//           setSelectedYear("");
//           setLocation({
//             coords: geoCoords || "",
//             country: address.country || "",
//             region: address.state || "",
//             district: address.district || "",
//           });
//           setPhoneNumber("");
//           setSelectedVideo([]);
//         }, 1000);
//       }
//       // else {
//       //   // Toast.show({
//       //   //   type: "error",
//       //   //   text1: "Upload Failed",
//       //   //   text2: "Something went wrong. Please try again.",
//       //   //   position: "top",
//       //   //   topOffset: 0,
//       //   // });
//       // }
//     } catch (error) {
//       // if(error.error.name === 'TokenExpiredError'){
//       //   console.log(error.error.name)
//       //   await AsyncStorage.removeItem('userToken')
//       //   router.push('/(Screens)/(LogIn)/LogIn')
//       // }
//       // Toast.show({
//       //   type: "error",
//       //   text1: "Error",
//       //   text2: "Failed to send data. Please check your connection.",
//       //   position: "top",
//       //   topOffset: 0,
//       // });
//       // console.log("Error in sending data:", error.response.data.message);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1">
//       <View className="absolute top-10 left-0 right-0 z-50 ">
//         <Toast />
//       </View>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         {/* {imageModal && (
//           <ImageCarousel
//             selectedImage={selectedImage}
//             setImageModal={setImageModal}
//           />
//         )} */}

//         <ScrollView
//           className={`bg-white z-10 py-8 rounded-lg shadow-lg mx-auto mt-8 ${
//             Platform.OS === "web"
//               ? width < 1024
//                 ? "max-w-[90%] min-w-[90%] px-8"
//                 : "w-[50%] px-24"
//               : "max-w-[90%] min-w-[90%] px-8"
//           } mb-8`}
//         >
//           {/* form header */}
//           <Text className="text-3xl font-bold text-center text-teal-600">
//             Upload Form
//           </Text>

//           {/* image field */}

//           <ImageAndVideo
//             setImageModal={setImageModal}
//             selectedImage={selectedImage}
//             setSelectedImage={setSelectedImage}
//             selectedVideo={selectedVideo}
//             setSelectedVideo={setSelectedVideo}
//             width={width}
//           />
//           {/* industry, category and make */}

//           <View className="z-50">
//             <SearchComponent
//               data={industries}
//               getCategory={getCategory}
//               getMakes={getMakes}
//               handleChange={handleChange}
//               label="Industry"
//               value={searchValues.industry}
//               onChange={(value) => handleChange("industry", value)}
//             />
//           </View>

//           <View className="z-40">
//             <SearchComponent
//               data={categories}
//               getCategory={getCategory}
//               handleChange={handleChange}
//               getMakes={getMakes}
//               label="Category"
//               value={searchValues.category}
//               onChange={(value) => handleChange("category", value)}
//             />
//           </View>
//           <View className="z-30">
//             <SearchComponent
//               data={subCategories}
//               getSubCategory={getSubCategory}
//               handleChange={handleChange}
//               getMakes={getMakes}
//               label="subCategory"
//               value={searchValues.subcategory}
//               onChange={(value) => handleChange("subcategory", value)}
//             />
//           </View>
//           <View className="z-20">
//             <SearchComponent
//               getCategory={getCategory}
//               getMakes={getMakes}
//               handleChange={handleChange}
//               data={makes}
//               label="Make"
//               value={searchValues.make}
//               onChange={(value) => handleChange("make", value)}
//             />
//           </View>

//           {/* Radio Buttons for Condition */}

//           <Text className="text-lg font-semibold text-teal-600 mt-6">
//             Condition:
//           </Text>
//           <View className="flex flex-row gap-10 mt-4">
//             {["Running", "Dismantled"].map((item) => (
//               <Pressable
//                 key={item.id}
//                 onPress={() => setCondition(item)}
//                 className={`px-4 py-2 rounded-sm ${
//                   condition === item
//                     ? "bg-teal-600"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 <Text
//                   className={`text-sm ${
//                     condition === item ? "text-white" : "text-gray-600"
//                   }`}
//                 >
//                   {item}
//                 </Text>
//               </Pressable>
//             ))}
//           </View>

//           {/* year of make */}
//           <Text className="text-lg font-semibold text-teal-600 mt-6">
//             Year of Make:
//           </Text>
//           {/* <View className="border border-gray-300 h-[50] rounded-lg mt-4 justify-center px-2"> */}
//           {/* <Picker
//               className="outline-none cursor-pointer h-full"
//               selectedValue={selectedYear}
//               onValueChange={(itemValue) => setSelectedYear(itemValue)}
//             >
//               <Picker.Item label="Select Year" value="" />
//               {years.map((year) => (
//                 <Picker.Item key={year} label={year.toString()} value={year} />
//               ))}
//             </Picker> */}
//           {/* </View> */}
//           <View style={{ zIndex: 5000 }}>
//             <DropDownPicker
//               open={openYear}
//               value={selectedYear}
//               items={yearItems}
//               setOpen={setOpenYear}
//               setValue={setSelectedYear}
//               setItems={setYearItems}
//               placeholder="Select Year"
//               listMode="SCROLLVIEW"
//               style={{
//                 borderColor: "#D1D5DB",
//                 height: 50,
//                 borderRadius: 8,
//                 paddingHorizontal: 8,
//               }}
//               dropDownContainerStyle={{
//                 borderColor: "#D1D5DB",
//                 backgroundColor: "white",
//                 zIndex: 5000, // Needed for Android
//               }}
//               textStyle={{ color: "#000" }}
//               placeholderStyle={{ color: "#9CA3AF" }}
//             />
//           </View>

//           {/* Price */}

//           <Text className="text-lg font-semibold text-teal-600 mt-6">
//             Price:
//           </Text>
//           <View className="flex flex-row items-center mt-4">
//             <TextInput
//               className="border border-gray-300 rounded-lg w-[50%] p-3 focus:border-teal-600 outline-teal-600"
//               placeholder="Enter price"
//               keyboardType="numeric"
//               value={price}
//               onChangeText={(item) => setPrice(item)}
//             />
//           </View>

//           {/* machine condition */}
//           <Text className="text-lg font-semibold text-teal-600 mt-6">
//             Price Type:
//           </Text>
//           <View className="flex flex-row gap-10 mt-4">
//             {["Negotiable", "Fixed"].map((item) => (
//               <Pressable
//                 key={item.id}
//                 onPress={() => setPriceType(item)}
//                 className={`px-4 py-2 rounded-sm ${
//                   priceType === item
//                     ? "bg-teal-600"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 <Text
//                   className={`text-sm ${
//                     priceType === item ? "text-white" : "text-gray-600"
//                   }`}
//                 >
//                   {item}
//                 </Text>
//               </Pressable>
//             ))}
//           </View>
//           {/* description */}

//           <Text className="text-lg font-semibold text-teal-600 mt-6">
//             Description:
//           </Text>

//           <TextInput
//             className="border border-gray-300 rounded-lg h-48 w-full mt-4 p-3 text-gray-500 focus:border-teal-600"
//             placeholder="Type about your product"
//             value={description}
//             onChangeText={(item) => setDescription(item)}
//             placeholderTextColor="gray"
//             multiline={true}
//           />

//           {/* mobile */}

//           <Text className="text-lg font-semibold text-teal-600 mt-6">
//             Contact
//           </Text>

//           <View className="w-full z-50">
//             <Mobile
//               // dropdownVisible={dropdownVisible}
//               // setDropdownVisible={setDropdownVisible}
//               selectedCode={selectedCode}
//               setSelectedCode={setSelectedCode}
//               phoneNumber={phoneNumber}
//               setPhoneNumber={setPhoneNumber}
//               // searchQuery={searchQuery}
//               // setSearchQuery={setSearchQuery}
//               // filteredCountries={filteredCountries}
//             />
//           </View>

//           <Location location={location} setLocation={setLocation} />

//           <Pressable
//             onPress={sentData}
//             className="bg-teal-600 w-max px-4 py-2 rounded-md mx-auto mt-12 mb-24"
//           >
//             <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
//               Post
//             </Text>
//           </Pressable>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const SearchComponent = ({
//   data,
//   label,
//   value,
//   onChange,
//   getCategory,
//   getSubCategory,
//   getMakes,
//   handleChange,
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [delayedFocus, setDelayedFocus] = useState(false);

//   const filteredData =
//     data?.length > 0
//       ? data.filter((item) =>
//           item?.toLowerCase().includes(value?.toLowerCase())
//         )
//       : data;

//   useEffect(() => {
//     if (isFocused) {
//       const timer = setTimeout(() => setDelayedFocus(true), 1000); // 1-second delay
//       return () => clearTimeout(timer); // Clear timeout on unmount
//     } else {
//       setDelayedFocus(false);
//     }
//   }, [isFocused]);

//   return (
//     <View>
//       <Text className="text-lg font-semibold text-teal-600 mt-6 z-10">
//         {label}
//       </Text>
//       <View className="flex items-center">
//         <TextInput
//           className="border outline-teal-600 rounded-lg h-12 w-full z-40 mt-4 p-3 text-gray-500 focus:border-teal-600"
//           placeholder={`Search ${label}...`}
//           value={value}
//           onFocus={() => {
//             setIsFocused(true);
//             if (label === "Category") getCategory();
//             if (label === "subCategory") getSubCategory();
//             if (label === "Make") getMakes();
//           }}
//           onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Hide FlatList with delay
//           onChangeText={onChange}
//           style={{ borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 }}
//         />

//         {delayedFocus && (
//           <View
//             className="absolute left-0 right-0 bg-white border border-teal-500 mt-16 rounded-md shadow-md z-50"
//             style={{ maxHeight: 200 }} // Adjusted marginTop for higher visibility
//           >
//             <FlatList
//               data={filteredData}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <Pressable
//                   onPress={() => {
//                     handleChange(label.toLowerCase(), item);
//                     setTimeout(() => setIsFocused(false), 200);
//                   }}
//                 >
//                   <Text style={{ padding: 5 }}>{item}</Text>
//                 </Pressable>
//               )}
//             />
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };
