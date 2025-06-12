// import {
//   SafeAreaView,
//   KeyboardAvoidingView,
//   ScrollView,
//   Platform,
//   Pressable,
//   Text,
//   TextInput,
//   View,
//   useWindowDimensions,
// } from "react-native";
// import { FlatList } from "react-native";
// import { useEffect, useState } from "react";
// import Toast from "react-native-toast-message";
// import React from "react";
// import DropDownPicker from "react-native-dropdown-picker";
// import { allCountries } from "country-telephone-data";
// import useApi from "@/app/hooks/useApi";
// import ImageAndVideo from "./ImageAndVideo";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Checkbox from "expo-checkbox";
// import useGeoLocation from "@/app/hooks/GeoLocation";
// import Mobile from "../(auth)/(SignIn)/Mobile";

// export default function SellPage() {
//   const { width } = useWindowDimensions();
//   const { getJsonApi } = useApi();
//   const { postJsonApi } = useApi();
//   const { geoCoords, errorMsg, address } = useGeoLocation();

//   const [location, setLocation] = useState({
//     coords: "",
//     country: "",
//     region: "",
//     district: "",
//   });
//   const [regions, setRegions] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [countries, setCountries] = useState(["India"]);

//   //other countries input fields
//   const inputFields = [
//     { key: "country", label: "Country" },
//     { key: "region", label: "Region" },
//   ];

//   const [selectedImage, setSelectedImage] = useState([]);
//   const [selectedVideo, setSelectedVideo] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [makes, setMakes] = useState([]);
//   const [price, setPrice] = useState("");
//   const [priceType, setPriceType] = useState("");
//   const [description, setDescription] = useState("");
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [selectedCode, setSelectedCode] = useState("+91");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [districtsWithStates, setDistrictsWithStates] = useState([]);
//   const [india, setIndia] = useState(false);
//   const [condition, setCondition] = useState("");

//   const years = Array.from(
//     { length: new Date().getFullYear() - 1899 },
//     (_, i) => 2025 - i
//   );
//   const [yearItems, setYearItems] = useState(
//     years.map((year) => ({ label: year.toString(), value: year }))
//   );
//   const [selectedYear, setSelectedYear] = useState("");
//   const [openYear, setOpenYear] = useState(false);

//   const [openState, setOpenState] = useState(false);
//   const [openDistrict, setOpenDistrict] = useState(false);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [openCountry, setOpenCountry] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState("India");

//   // search COmponenets
//   const [searchValues, setSearchValues] = useState({
//     industry: "",
//     category: "",
//     subCategory: "",
//     make: "",
//   });

//   useEffect(() => {
//     if (!india) {
//       setLocation((prev) => ({
//         ...prev,
//         region: selectedState,
//         district: selectedDistrict,
//       }));
//     }
//   }, [selectedState, selectedDistrict]);

//   // filter mobile countries

//   const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

//   const filteredCountries = allCountries
//     .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     .map((c) => ({
//       name: cleanCountryName(c.name),
//       dialCode: c.dialCode,
//       iso2: c.iso2,
//     }));

//   // fetching industries
//   useEffect(() => {
//     const fetchIndustries = async () => {
//       try {
//         try {
//           const data = await getJsonApi(`CategoryPage`);
//           setIndustries(data?.data.industries.industries);
//           setRegions(data?.data?.states[0]?.states);
//           setDistrictsWithStates(data?.data?.states[1]?.districts);
//         } catch (error) {
//           console.error(error);
//         }
//       } catch (err) {}
//     };
//     fetchIndustries();
//   }, []);

//   useEffect(() => {
//     if (address?.country) {
//       setLocation({
//         coords: geoCoords || "",
//         country: address.country || "",
//         region: address.state || "",
//         district: address.district || "",
//       });
//     }
//   }, [address, geoCoords]);
//   useEffect(() => {
//     if (location.region) {
//       setDistricts(
//         () =>
//           districtsWithStates
//             .filter(
//               (state) =>
//                 Object.keys(state)[0].toLowerCase().trim() ===
//                 location.region.toLowerCase().trim()
//             ) // Find matching state
//             .flatMap((state) => Object.values(state)[0]) // Flatten directly
//       );
//     }
//   }, [location.region]); // Dependency array

//   // fetching categories

//   const getCategory = async () => {
//     try {
//       if (searchValues.industry.length > 0) {
//         const data = await getJsonApi(
//           `CategoryPage/${searchValues.industry}/sell`
//         );
//         setCategories(data?.data?.industries?.categories);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   const getSubcategory = async () => {
//     try {
//       if (searchValues.industry.length > 0) {
//         const data = await getJsonApi(
//           `CategoryPage/${searchValues.industry}/sell`
//         );
//         setSubCategories(data?.data?.industries?.subcategories);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // fetching makes
//   const getMakes = async () => {
//     try {
//       if (searchValues.category.length > 0) {
//         const data = await getJsonApi(`CategoryPage/${searchValues.category}`);
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

//   // sending data to backend

//   const sentData = async (e) => {
//     e.preventDefault();
//     console.log(selectedVideo + "after");

//     if (
//       !searchValues?.industry?.trim() ||
//       !searchValues?.category?.trim() ||
//       !searchValues?.subCategories?.trim() ||
//       !searchValues?.make?.trim() ||
//       !price?.trim() ||
//       !description?.trim() ||
//       !priceType?.trim() ||
//       !phoneNumber?.trim() ||
//       !condition?.trim() ||
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
//     formData.append("subcategory", searchValues.subCategories);
//     formData.append("make", searchValues.make);
//     formData.append("price", price);
//     formData.append("priceType", priceType);
//     formData.append("description", description);
//     formData.append(
//       "mobile",
//       JSON.stringify({
//         number: phoneNumber.trim("0"),
//         countryCode: selectedCode,
//       })
//     );
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
//       if (response.status === 201 || response.status === 200) {
//         Toast.show({
//           type: "success",
//           text1: "Success",
//           text2: response.data.message || "Data uploaded successfully!",
//           position: "top",
//           topOffset: 0,
//         });

//         setTimeout(() => {
//           setSearchValues({
//             industry: "",
//             category: "",
//             make: "",
//           });
//           setPrice("");
//           setPriceType("");
//           setDescription("");
//           setSelectedImage([]);
//           setCondition("");
//           setLocation({
//             coords: geoCoords || "",
//             country: address.country || "",
//             region: address.state || "",
//             district: address.district || "",
//           });
//           setPhoneNumber("");
//           setSelectedVideo([]);
//         }, 1000);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Upload Failed",
//           text2: "Something went wrong. Please try again.",
//           position: "top",
//           topOffset: 0,
//         });
//       }
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: "Failed to send data. Please check your connection.",
//         position: "top",
//         topOffset: 0,
//       });
//       console.log("Error in sending data:", error.response.data.message);
//     }
//   };

//   const dropdownFields = [
//     { key: "region", label: "State", data: regions },
//     { key: "district", label: "district", data: districts },
//     { key: "country", label: "Country", data: countries },
//   ];
//   console.log("industries :", industries);
//   return (
//     <SafeAreaView className="flex-1">
//       <View className="absolute top-10 left-0 right-0 z-50 ">
//         <Toast />
//       </View>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
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
//             selectedImage={selectedImage}
//             setSelectedImage={setSelectedImage}
//             selectedVideo={selectedVideo}
//             setSelectedVideo={setSelectedVideo}
//           />
//           {/* industry, category and make */}

//           <View>
//             <SearchComponent
//               data={industries}
//               getCategory={getCategory}
//               getMakes={getMakes}
//               handleChange={handleChange}
//               label="Industry"
//               value={searchValues.industry}
//               onChange={(value) => handleChange("industry", value)}
//             />

//             <SearchComponent
//               data={categories}
//               getCategory={getCategory}
//               handleChange={handleChange}
//               getMakes={getMakes}
//               label="Category"
//               value={searchValues.category}
//               onChange={(value) => handleChange("category", value)}
//             />
//             <SearchComponent
//               data={subCategories}
//               getSubcategory={getSubcategory}
//               handleChange={handleChange}
//               getMakes={getMakes}
//               label="Subcategory"
//               value={searchValues.subCategories}
//               onChange={(value) => handleChange("subCategories", value)}
//             />

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
//                 key={item}
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
//           {/* <View className="border border-gray-300 h-[50] rounded-lg mt-4 justify-center px-2">
//             <Picker
//               className="outline-none cursor-pointer h-full"
//               selectedValue={selectedYear}
//               onValueChange={(itemValue) => setSelectedYear(itemValue)}
//             >
//               <Picker.Item label="Select Year" value="" />
//               {years.map((year) => (
//                 <Picker.Item key={year} label={year.toString()} value={year} />
//               ))}
//             </Picker>
//           </View> */}

//           <DropDownPicker
//             open={openYear}
//             value={selectedYear}
//             items={yearItems}
//             setOpen={setOpenYear}
//             setValue={setSelectedYear}
//             setItems={setYearItems}
//             placeholder="Select Year"
//             listMode="SCROLLVIEW"
//             style={{
//               borderColor: "#D1D5DB",
//               height: 50,
//               borderRadius: 8,
//               paddingHorizontal: 8,
//             }}
//             // dropDownContainerStyle={{
//             //   borderColor: "#D1D5DB",
//             //   backgroundColor: "red",
//             // }}
//             textStyle={{ color: "#000" }}
//             placeholderStyle={{ color: "#9CA3AF" }}
//           />

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
//               dropdownVisible={dropdownVisible}
//               setDropdownVisible={setDropdownVisible}
//               selectedCode={selectedCode}
//               setSelectedCode={setSelectedCode}
//               phoneNumber={phoneNumber}
//               setPhoneNumber={setPhoneNumber}
//               searchQuery={searchQuery}
//               setSearchQuery={setSearchQuery}
//               filteredCountries={filteredCountries}
//             />
//           </View>

//           {/* Location Section with Suggestions */}
//           {/* Location Section with Suggestions */}
//           {/* Location Section with Suggestions */}
//           <View className="relative mt-10">
//             {/* Checkbox to Toggle India or Other Countries */}
//             <View className="flex flex-row items-center justify-end">
//               <View className="flex flex-row items-center">
//                 <Checkbox
//                   value={india}
//                   onValueChange={() => {
//                     if (!india) {
//                       setLocation({
//                         coords: geoCoords,
//                         country: "",
//                         region: "",
//                         district: "",
//                       });
//                     } else {
//                       setLocation({
//                         coords: geoCoords,
//                         country: address.country || "",
//                         region: address.state || "",
//                         district: address.district || "",
//                       });
//                     }
//                     setIndia(!india);
//                   }}
//                   className="w-5 h-5 border-gray-400 cursor-pointer"
//                   color={india ? "#008080" : undefined}
//                 />
//                 <Text className="ml-2 text-gray-700">Other than India</Text>
//               </View>
//             </View>

//             {!india ? (
//               // Display dropdowns

//               <>
//                 <View
//                   style={{ zIndex: openState ? 2000 : 1000, marginBottom: 20 }}
//                 >
//                   <Text className="text-lg font-semibold text-teal-600">
//                     State
//                   </Text>
//                   <DropDownPicker
//                     open={openState}
//                     value={selectedState}
//                     items={regions.map((region) => ({
//                       label: region,
//                       value: region,
//                     }))}
//                     setOpen={setOpenState}
//                     setValue={setSelectedState}
//                     setItems={() => {}}
//                     placeholder="Select State"
//                     listMode="SCROLLVIEW"
//                     style={{
//                       borderColor: "#D1D5DB",
//                       height: 50,
//                       borderRadius: 8,
//                       paddingHorizontal: 8,
//                     }}
//                     dropDownContainerStyle={{
//                       borderColor: "#D1D5DB",
//                       backgroundColor: "#fff",
//                       maxHeight: 200,
//                     }}
//                     textStyle={{ color: "#000" }}
//                     placeholderStyle={{ color: "#9CA3AF" }}
//                   />
//                 </View>

//                 <View style={{ zIndex: openDistrict ? 2000 : 1000 }}>
//                   <Text className="text-lg font-semibold text-teal-600">
//                     district
//                   </Text>
//                   <DropDownPicker
//                     open={openDistrict}
//                     value={selectedDistrict}
//                     items={districts.map((district) => ({
//                       label: district,
//                       value: district,
//                     }))}
//                     setOpen={setOpenDistrict}
//                     setValue={setSelectedDistrict}
//                     setItems={() => {}}
//                     placeholder="Select District"
//                     disabled={!selectedState}
//                     listMode="SCROLLVIEW"
//                     style={{
//                       borderColor: "#D1D5DB",
//                       height: 50,
//                       borderRadius: 8,
//                       paddingHorizontal: 8,
//                     }}
//                     dropDownContainerStyle={{
//                       borderColor: "#D1D5DB",
//                       backgroundColor: "#fff",
//                       maxHeight: 200,
//                     }}
//                     textStyle={{ color: "#000" }}
//                     placeholderStyle={{ color: "#9CA3AF" }}
//                   />
//                 </View>

//                 {/* Country Dropdown */}
//                 <Text className="text-lg font-semibold text-teal-600 mt-6">
//                   Country:
//                 </Text>
//                 <View
//                   style={{
//                     zIndex: openCountry ? 3000 : 1000,
//                     marginBottom: 20,
//                   }}
//                 >
//                   <DropDownPicker
//                     open={openCountry}
//                     value={selectedCountry}
//                     items={[{ label: "India", value: "India" }]}
//                     setOpen={setOpenCountry}
//                     setValue={setSelectedCountry}
//                     setItems={() => {}}
//                     placeholder="Select Country"
//                     listMode="SCROLLVIEW"
//                     disabled={true} // make it non-editable
//                     style={{
//                       borderColor: "#D1D5DB",
//                       height: 50,
//                       borderRadius: 8,
//                       paddingHorizontal: 8,
//                       backgroundColor: "#f3f4f6",
//                     }}
//                     dropDownContainerStyle={{
//                       borderColor: "#D1D5DB",
//                       backgroundColor: "#fff",
//                     }}
//                     textStyle={{ color: "#000" }}
//                     placeholderStyle={{ color: "#9CA3AF" }}
//                   />
//                 </View>
//               </>
//             ) : (
//               // Display input fields
//               inputFields.map(({ key, label }) => (
//                 <View key={key} className="mt-4">
//                   <Text className="text-lg font-semibold text-teal-600">
//                     {label}
//                   </Text>
//                   <TextInput
//                     className="border border-gray-300 h-[50] rounded-lg w-full p-3 focus:border-teal-600 outline-teal-600"
//                     placeholder={`Enter your ${label}`}
//                     value={location[key]}
//                     onChangeText={(text) =>
//                       setLocation({ ...location, [key]: text })
//                     }
//                   />
//                 </View>
//               ))
//             )}
//           </View>

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
// // search componentsimport { useState, useEffect } from "react";
// const SearchComponent = ({
//   data,
//   label,
//   value,
//   onChange,
//   getCategory,
//   getMakes,
//   handleChange,
// }) => {
//   console.log("data:", data);
//   const [isFocused, setIsFocused] = useState(false);
//   const [delayedFocus, setDelayedFocus] = useState(false);

//   const filteredData =
//     data?.length > 0
//       ? data.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
//       : data;
//   console.log("value:", value);
//   console.log("filteredDatar:", filteredData);

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
//       <Text className="text-lg font-semibold text-teal-600 mt-6">{label}</Text>
//       <TextInput
//         className="border outline-teal-600 rounded-lg h-12 w-full mt-4 p-3 text-gray-500 focus:border-teal-600"
//         placeholder={`Search ${label}...`}
//         value={value}
//         onFocus={() => {
//           setIsFocused(true);
//           if (label === "Category") getCategory();
//           if (label === "Make") getMakes();
//         }}
//         onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Hide FlatList with delay
//         onChangeText={onChange}
//         style={{ borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 }}
//       />
//       {delayedFocus && (
//         <View className="w-full bg-white border border-gray-300 rounded-md shadow-md mt-2 z-10">
//           <FlatList
//             data={filteredData}
//             keyExtractor={(item, index) => item + index}
//             renderItem={({ item }) => (
//               <Pressable
//                 onPress={() => {
//                   handleChange(label.toLowerCase(), item);
//                   setTimeout(() => setIsFocused(false), 200);
//                 }}
//               >
//                 <Text style={{ padding: 5 }}>{item}</Text>
//               </Pressable>
//             )}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  Text,
  Image,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";
import Toast from "react-native-toast-message";
import React from "react";
// import Mobile from "../(SignIn)/Mobile";

import useApi from "@/app/hooks/useApi";
import ImageAndVideo from "./ImageAndVideo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker"; // Import Picker
// import ImageCarousel from "./ImageCarousel";

import Mobile from "../(auth)/(SignIn)/Mobile";
import Location from "../(Homepage)/Location";
// import Location from "./Location";
export default function SellPage() {
  const { width } = useWindowDimensions();
  const { getJsonApi } = useApi();
  const { postJsonApi } = useApi();

  const [location, setLocation] = useState({
    coords: "",
    country: "",
    region: "",
    district: "",
  });

  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [makes, setMakes] = useState([]);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("");
  const [description, setDescription] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [condition, setCondition] = useState("");
  const [imageModal, setImageModal] = useState(false);

  const years = Array.from(
    { length: new Date().getFullYear() - 1899 },
    (_, i) => 1900 + i
  );
  const [selectedYear, setSelectedYear] = useState("");

  // search COmponenets
  const [searchValues, setSearchValues] = useState({
    industry: "",
    category: "",
    subcategory: "",
    make: "",
  });

  // fetching industries
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        try {
          const data = await getJsonApi(`CategoryPage`);
          "data:", data;
          setIndustries(data?.data.industries.industries);
        } catch (error) {
          console.error(error);
        }
      } catch (err) {}
    };
    fetchIndustries();
  }, []);

  // fetching categories

  const getCategory = useCallback(async () => {
    try {
      if (searchValues.industry.length > 0) {
        const data = await getJsonApi(
          `CategoryPage/${searchValues.industry}/sell`
        );
        setCategories(data.data);
        // console.log("data :", data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [searchValues.category]);
  const getSubCategory = useCallback(async () => {
    // console.log("triggered", searchValues.category);
    try {
      if (searchValues.category.length > 0) {
        const data = await getJsonApi(
          `CategoryPage/subCategoryPage/${searchValues.category}/sell`
        );
        // console.log("data :", data.data);
        setSubCategories(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [searchValues.category]);

  // fetching makes
  const getMakes = useCallback(async () => {
    try {
      if (searchValues.category.length > 0) {
        const data = await getJsonApi(
          `CategoryPage/${searchValues.subcategory}`
        );
        // console.log("data :", data);
        setMakes(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  },[searchValues.category]);

  // setting searchValues
  const handleChange = (key, value) => {
    setSearchValues((prev) => ({ ...prev, [key]: value }));
  };

  // sending data to backend

  const sentData = async (e) => {
    e.preventDefault();

    if (
      !searchValues?.industry?.trim() ||
      !searchValues?.category?.trim() ||
      !searchValues?.subcategory?.trim() ||
      !searchValues?.make?.trim() ||
      !price?.trim() ||
      !description?.trim() ||
      !priceType?.trim() ||
      !phoneNumber?.trim() ||
      !condition?.trim() ||
      !String(location?.coords || "").trim() ||
      !String(location?.region || "").trim() ||
      !String(location?.country || "").trim()
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill all required fields before submitting.",
        position: "top",
        topOffset: 0,
      });
      return;
    }
    if (
      (!Array.isArray(selectedImage) || selectedImage.length === 0) &&
      (!Array.isArray(selectedVideo) || selectedVideo.length === 0)
    ) {
      Toast.show({
        type: "error",
        text1: "No Media Selected",
        text2: "Please upload at least one image or video.",
        position: "top",
        topOffset: 0,
      });
      return;
    }

    const formData = new FormData();
    formData.append("industry", searchValues.industry);
    formData.append("category", searchValues.category);
    formData.append("subcategory", searchValues.subcategory);
    formData.append("make", searchValues.make);
    formData.append("price", price);
    formData.append("priceType", priceType);
    formData.append("description", description);
    formData.append("mobile", phoneNumber.trim("0"));
    formData.append("condition", condition);
    formData.append("yearOfMake", selectedYear);
    formData.append("location", JSON.stringify(location));

    // Append all images
    selectedImage.forEach((image) => {
      formData.append("images", image.file);
    });

    // Append all videos
    selectedVideo.forEach((video, index) => {
      formData.append("videos", video.file);
    });

    const token = await AsyncStorage.getItem("userToken");

    try {
      const response = await postJsonApi("productupload", formData, token);

      // axios.post(
      //   "http://192.168.1.5:5000/productupload",
      //   formData,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
      // );
      if (response.status === 201 || response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message || "Data uploaded successfully!",
          position: "top",
          topOffset: 0,
        });

        setTimeout(() => {
          setSearchValues({
            industry: "",
            category: "",
            make: "",
          });
          setPrice("");
          setPriceType("");
          setDescription("");
          setSelectedImage([]);
          setCondition("");
          setLocation({
            coords: geoCoords || "",
            country: address.country || "",
            region: address.state || "",
            district: address.district || "",
          });
          setPhoneNumber("");
          setSelectedVideo([]);
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Upload Failed",
          text2: "Something went wrong. Please try again.",
          position: "top",
          topOffset: 0,
        });
      }
    } catch (error) {
      // if(error.error.name === 'TokenExpiredError'){
      //   console.log(error.error.name)
      //   await AsyncStorage.removeItem('userToken')
      //   router.push('/(Screens)/(LogIn)/LogIn')
      // }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send data. Please check your connection.",
        position: "top",
        topOffset: 0,
      });
      // console.log("Error in sending data:", error.response.data.message);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="absolute top-10 left-0 right-0 z-50 ">
        <Toast />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* {imageModal && (
          <ImageCarousel
            selectedImage={selectedImage}
            setImageModal={setImageModal}
          />
        )} */}

        <ScrollView
          className={`bg-white z-10 py-8 rounded-lg shadow-lg mx-auto mt-8 ${
            Platform.OS === "web"
              ? width < 1024
                ? "max-w-[90%] min-w-[90%] px-8"
                : "w-[50%] px-24"
              : "max-w-[90%] min-w-[90%] px-8"
          } mb-8`}
        >
          {/* form header */}
          <Text className="text-3xl font-bold text-center text-teal-600">
            Upload Form
          </Text>

          {/* image field */}

          <ImageAndVideo
            setImageModal={setImageModal}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
            width={width}
          />
          {/* industry, category and make */}

          <View>
            <SearchComponent
              data={industries}
              getCategory={getCategory}
              getMakes={getMakes}
              handleChange={handleChange}
              label="Industry"
              value={searchValues.industry}
              onChange={(value) => handleChange("industry", value)}
            />

            <SearchComponent
              data={categories}
              getCategory={getCategory}
              handleChange={handleChange}
              getMakes={getMakes}
              label="Category"
              value={searchValues.category}
              onChange={(value) => handleChange("category", value)}
            />
            <SearchComponent
              data={subCategories}
              getSubCategory={getSubCategory}
              handleChange={handleChange}
              getMakes={getMakes}
              label="subCategory"
              value={searchValues.subcategory}
              onChange={(value) => handleChange("subCategory", value)}
            />

            <SearchComponent
              getCategory={getCategory}
              getMakes={getMakes}
              handleChange={handleChange}
              data={makes}
              label="Make"
              value={searchValues.make}
              onChange={(value) => handleChange("make", value)}
            />
          </View>

          {/* Radio Buttons for Condition */}

          <Text className="text-lg font-semibold text-teal-600 mt-6">
            Condition:
          </Text>
          <View className="flex flex-row gap-10 mt-4">
            {["Running", "Dismantled"].map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setCondition(item)}
                className={`px-4 py-2 rounded-sm ${
                  condition === item
                    ? "bg-teal-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <Text
                  className={`text-sm ${
                    condition === item ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* year of make */}
          <Text className="text-lg font-semibold text-teal-600 mt-6">
            Year of Make:
          </Text>
          <View className="border border-gray-300 h-[50] rounded-lg mt-4 justify-center px-2">
            <Picker
              className="outline-none cursor-pointer h-full"
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              <Picker.Item label="Select Year" value="" />
              {years.map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year} />
              ))}
            </Picker>
          </View>

          {/* Price */}

          <Text className="text-lg font-semibold text-teal-600 mt-6">
            Price:
          </Text>
          <View className="flex flex-row items-center mt-4">
            <TextInput
              className="border border-gray-300 rounded-lg w-[50%] p-3 focus:border-teal-600 outline-teal-600"
              placeholder="Enter price"
              keyboardType="numeric"
              value={price}
              onChangeText={(item) => setPrice(item)}
            />
          </View>

          {/* machine condition */}
          <Text className="text-lg font-semibold text-teal-600 mt-6">
            Price Type:
          </Text>
          <View className="flex flex-row gap-10 mt-4">
            {["Negotiable", "Fixed"].map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setPriceType(item)}
                className={`px-4 py-2 rounded-sm ${
                  priceType === item
                    ? "bg-teal-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <Text
                  className={`text-sm ${
                    priceType === item ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          {/* description */}

          <Text className="text-lg font-semibold text-teal-600 mt-6">
            Description:
          </Text>

          <TextInput
            className="border border-gray-300 rounded-lg h-48 w-full mt-4 p-3 text-gray-500 focus:border-teal-600"
            placeholder="Type about your product"
            value={description}
            onChangeText={(item) => setDescription(item)}
            placeholderTextColor="gray"
            multiline={true}
          />

          {/* mobile */}

          <Text className="text-lg font-semibold text-teal-600 mt-6">
            Contact
          </Text>

          <View className="w-full z-50">
            <Mobile
              // dropdownVisible={dropdownVisible}
              // setDropdownVisible={setDropdownVisible}
              // selectedCode={selectedCode}
              // setSelectedCode={setSelectedCode}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              // searchQuery={searchQuery}
              // setSearchQuery={setSearchQuery}
              // filteredCountries={filteredCountries}
            />
          </View>

          <Location location={location} setLocation={setLocation} />

          <Pressable
            onPress={sentData}
            className="bg-teal-600 w-max px-4 py-2 rounded-md mx-auto mt-12 mb-24"
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Post
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// search componentsimport { useState, useEffect } from "react";
const SearchComponent = ({
  data,
  label,
  value,
  onChange,
  getCategory,
  getSubCategory,
  getMakes,
  handleChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [delayedFocus, setDelayedFocus] = useState(false);

  const filteredData =
    data?.length > 0
      ? data.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      : data;

  useEffect(() => {
    if (isFocused) {
      const timer = setTimeout(() => setDelayedFocus(true), 1000); // 1-second delay
      return () => clearTimeout(timer); // Clear timeout on unmount
    } else {
      setDelayedFocus(false);
    }
  }, [isFocused]);

  return (
    <View>
      <Text className="text-lg font-semibold text-teal-600 mt-6">{label}</Text>
      <TextInput
        className="border outline-teal-600 rounded-lg h-12 w-full mt-4 p-3 text-gray-500 focus:border-teal-600"
        placeholder={`Search ${label}...`}
        value={value}
        onFocus={() => {
          setIsFocused(true);
          if (label === "Category") getCategory();
          if (label === "subCategory") getSubCategory();
          if (label === "Make") getMakes();
        }}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Hide FlatList with delay
        onChangeText={onChange}
        style={{ borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 }}
      />
      {delayedFocus && (
        <View className="w-full bg-white border border-gray-300 rounded-md shadow-md mt-2 z-10">
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  handleChange(label.toLowerCase(), item);
                  setTimeout(() => setIsFocused(false), 200);
                }}
              >
                <Text style={{ padding: 5 }}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
};
