// import { useState, useEffect } from "react";
// import { View, Pressable, Text, TextInput } from "react-native";
// import useGeoLocation from "@/app/hooks/GeoLocation";
// import { Picker } from "@react-native-picker/picker"; // Import Picker
// import Checkbox from "expo-checkbox";
// import useApi from "@/app/hooks/useApi";

// const Location = ({ location, setLocation }) => {
//   const [india, setIndia] = useState(false);
//   const [regions, setRegions] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [countries, setCountries] = useState(["India"]);
//   const [districtsWithStates, setDistrictsWithStates] = useState([]);
//   const { geoCoords, errorMsg, address } = useGeoLocation();
//   const { getJsonApi } = useApi();

//   //other countries input fields
//   const inputFields = [
//     { key: "country", label: "Country" },
//     { key: "region", label: "Region" },
//   ];

//   const dropdownFields = [
//     { key: "region", label: "State", data: regions },
//     { key: "district", label: "district", data: districts },
//     { key: "country", label: "Country", data: countries },
//   ];

//   const useCurrentLocation = () => {
//     setLocation({
//       coords: geoCoords || "",
//       country: address.country || "",
//       region: address.state || "",
//       district: address.district || "",
//     });
//   };

//   useEffect(() => {
//     if (address?.country) {
//       useCurrentLocation();
//     }
//   }, [address, geoCoords]);

//   useEffect(() => {
//     fetchIndustries();

//     if (location.region) {
//       setDistricts(
//         () =>
//           districtsWithStates
//             ?.filter(
//               (state) =>
//                 Object.keys(state)[0].toLowerCase().trim() ===
//                 location.region.toLowerCase().trim()
//             ) // Find matching state
//             .flatMap((state) => Object.values(state)[0]) // Flatten directly
//       );
//     }
//   }, [location.region]); // Dependency array

//   const fetchIndustries = async () => {
//     try {
//       try {
//         const data = await getJsonApi(`CategoryPage`);
//         console.log("data 12345 :", data?.data?.states[0]?.states);
//         setRegions(data?.data?.states[0]?.states);
//         setDistrictsWithStates(data?.data?.states[1]?.districts);
//       } catch (error) {
//         console.error(error);
//       }
//     } catch (err) {}
//   };
//   console.log("regions :", regions);
//   return (
//     <>
//       {/* Location Section with Suggestions */}
//       <View className="relative mt-10">
//         {/* Checkbox to Toggle India or Other Countries */}
//         <View className="flex flex-row items-center justify-end">
//           <View className="flex flex-row items-center">
//             <Checkbox
//               value={india}
//               onValueChange={() => {
//                 if (!india) {
//                   setLocation({
//                     coords: geoCoords,
//                     country: "",
//                     region: "",
//                     district: "",
//                   });
//                 } else {
//                   useCurrentLocation();
//                 }
//                 setIndia(!india);
//               }}
//               className="w-5 h-5 border-gray-400 cursor-pointer"
//               color={india ? "#008080" : undefined}
//             />
//             <Text className="ml-2 text-gray-700">Other than India</Text>
//           </View>
//         </View>

//         {!india
//           ? // Display dropdowns
//             dropdownFields?.map(({ key, label, data }) => (
//               <View key={key} className="mt-4">
//                 <View className="flex flex-row items-center gap-4">
//                   <Text className="text-lg font-semibold text-teal-600">
//                     {label}
//                   </Text>
//                   {label === "State" ? (
//                     <Pressable
//                       onPress={() => {
//                         // useCurrentLocation()
//                       }}
//                     >
//                       <Text className="text-blue-500 underline text-gray-500">
//                         Use my Current Loction
//                       </Text>
//                     </Pressable>
//                   ) : (
//                     ""
//                   )}
//                 </View>
//                 <View className="border border-gray-300 h-[50] rounded-lg mt-4 justify-center px-2 ">
//                   <Picker
//                     className="outline-none cursor-pointer h-full"
//                     selectedValue={location[key]}
//                     onValueChange={(value) => {
//                       setLocation((prev) => {
//                         if (key === "region") {
//                           return { ...prev, region: value, district: "" };
//                         }
//                         return { ...prev, [key]: value };
//                       });
//                     }}
//                   >
//                     <Picker.Item label={location[key]} value="" />
//                     {/* <Picker.Item
//                           label={`Use my Current Location`}
//                           value=""
//                         /> */}
//                     {data?.map((item, index) => {
//                       // console.log("data : ", item)
//                       return (
//                         <Picker.Item key={index} label={item} value={item} />
//                       );
//                     })}
//                   </Picker>
//                 </View>
//               </View>
//             ))
//           : // Display input fields
//             inputFields.map(({ key, label }) => (
//               <View key={key} className="mt-4">
//                 <Text className="text-lg font-semibold text-teal-600">
//                   {label}
//                 </Text>
//                 <TextInput
//                   className="border border-gray-300 h-[50] rounded-lg w-full p-3 focus:border-teal-600 outline-teal-600"
//                   placeholder={`Enter your ${label}`}
//                   value={location[key]}
//                   onChangeText={(text) =>
//                     setLocation({ ...location, [key]: text })
//                   }
//                 />
//               </View>
//             ))}
//       </View>
//     </>
//   );
// };

// export default Location;