// import {
//   View,
//   Text,
//   Pressable,
//   Image,
//   Alert,
//   ScrollView,
//   SafeAreaView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import { TextInput } from "react-native-paper";
// import React, { useEffect, useCallback, useState } from "react";
// import { useRouter } from "expo-router";
// import * as ImagePicker from "expo-image-picker";
// import { FontAwesome } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import Icon from "react-native-vector-icons/FontAwesome6";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// import { allCountries } from "country-telephone-data";
// import { useIsFocused } from "@react-navigation/native";
// import useApi from "@/app/hooks/useApi";
// import Mobile from "../(auth)/(SignIn)/Mobile";
// import Password from "../(auth)/(SignIn)/Password";

// const ProfileScreen = ({ navigation }) => {
//   const [userProfile, setUserProfile] = useState(null);
//   const [userProfileImage, setUserProfileImage] = useState(null);
//   const [updateInput, setUpdateInput] = useState(false);
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [selectedCode, setSelectedCode] = useState("+91");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [resetPass, setResetPass] = useState(false);
//   const [password, setPassword] = useState("");
//   const [confirmpass, setConfirmPass] = useState("");
//   const isFocused = useIsFocused();
//   const router = useRouter();
//   const { getJsonApi, postJsonApi } = useApi();

//   const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

//   const filteredCountries = allCountries
//     .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     .map((c) => ({
//       name: cleanCountryName(c.name),
//       dialCode: c.dialCode,
//       iso2: c.iso2,
//     }));

//   const selectImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission Required",
//         "Please allow access to your gallery."
//       );
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: "Images",
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       try {
//         const token = await AsyncStorage.getItem("userToken");
//         const formdata = new FormData();
//         console.log(result);
//         result.assets.forEach((asset) => {
//           formdata.append("images", asset.file);
//         });

//         const response = await postJsonApi(
//           `profile/updateProfileImage`,
//           formdata,
//           token
//         );
//         setUserProfileImage(result.assets[0].uri);
//       } catch (error) {
//         console.error(error.message, "error");
//       }
//     }
//   };

//   useEffect(() => {
//     const userData = async () => {
//       try {
//         const storedToken = await AsyncStorage.getItem("userToken");
//         if (!storedToken) {
//           if (Platform.OS === "web") {
//             router.replace("/screens/(auth)/(login)/Login");
//           }
//           return;
//         }

//         const response = await getJsonApi(`profile`, storedToken);
//         setUserProfile(response.data);
//         setPhoneNumber(response.data.mobile);
//         setEmail(response.data.email);
//         setUsername(response.data.username);
//         setUserProfileImage(
//           `data:image/png;base64,${response.data.profileImage?.[0]?.machineImages}`
//         );
//       } catch (error) {
//         console.error(error.message, "error");
//       }
//     };
//     if (isFocused) {
//       userData();
//     }
//   }, [isFocused]);

//   // updated function
//   const update = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await postJsonApi(
//         `profile/update`,
//         {
//           username: username,
//           mobile: phoneNumber,
//           email: email,
//         },
//         token
//       );
//       setUserProfile(response.data);
//     } catch (error) {
//       console.error(error.message, "error");
//     }
//   };

//   // pasword reset function
//   const passwordReset = async () => {
//     if (password !== confirmpass) alert("password should not match");
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await postJsonApi(
//         `profile/passwordReset`,
//         { password: password },
//         token
//       );
//     } catch (error) {
//       console.error(error.message, "error");
//     }
//   };

//   // logout function
//   const handleLogout = useCallback(async () => {
//     Alert.alert("Logout", "Are you sure you want to logout?");

//     console.log("Logout initiated");

//     try {
//       await AsyncStorage.removeItem("userToken");
//       await AsyncStorage.removeItem("username");
//       await AsyncStorage.removeItem("email");

//       setUsername("");
//       setEmail("");
//       setUserProfile(null);

//       // Navigation
//       if (Platform.OS === "web") {
//         router.push("/"); // For web
//       } else {
//         navigation.navigate("HomePage"); // For mobile
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   }, [navigation]);

//   return (
//     <ScrollView>
//       <SafeAreaView>
//         <View className={`${Platform.OS !== "web" ? "mt-24" : ""}`}>
//           <View className="">
//             {/* Profile Picture Section */}
//             <View className="flex-1 items-center ">
//               <View
//                 className="items-center mt-10 "
//                 style={{ position: "relative" }}
//               >
//                 <View
//                   className="bg-TealGreen items-center justify-center"
//                   style={{
//                     width: 200,
//                     height: 200,
//                     borderRadius: 100,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <View
//                     className="justify-center items-center"
//                     style={{ width: "100%", height: "100%" }}
//                   >
//                     {userProfileImage ? (
//                       <Image
//                         source={{ uri: userProfileImage }}
//                         className="w-full h-full rounded-full"
//                       />
//                     ) : (
//                       <FontAwesome name="user" size={100} color="white" />
//                     )}
//                   </View>
//                 </View>

//                 {/* Edit Icon */}
//                 <View
//                   className="bg-white items-center justify-center"
//                   style={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: 50,
//                     position: "absolute",
//                     bottom: 10,
//                     right: 10,
//                     elevation: 5,
//                   }}
//                 >
//                   <Pressable onPress={selectImage}>
//                     <MaterialIcons name="edit" size={24} color="teal" />
//                   </Pressable>
//                 </View>
//               </View>
//             </View>

//             {/* User Details */}
//             <View className="items-center justify-center mt-6 mb-10">
//               <Text className="text-TealGreen font-bold text-2xl">
//                 {userProfile?.username}
//               </Text>
//             </View>

//             {/* Contact Info */}
//             <View className="items-center mt-6">
//               <View className="flex flex-row items-center gap-2 w-[300px] justify-center">
//                 <Icon name="phone-volume" size={20} color="teal" />
//                 <Text className="font-bold text-lg text-TealGreen flex-1 text-center ">
//                   {userProfile?.mobile || "Update your mobile"}
//                 </Text>
//               </View>
//               <View className="w-[300px] h-1 bg-TealGreen mt-3"></View>
//             </View>

//             <View className="items-center mt-6">
//               <View className="flex flex-row items-center gap-2 w-[300px] justify-center">
//                 <MaterialCommunityIcons name="email" size={24} color="teal" />
//                 <Text className="font-bold text-lg text-TealGreen flex-1 text-center ">
//                   {userProfile?.email || "Update your email"}
//                 </Text>
//               </View>
//               <View className="w-[300px] h-1 bg-TealGreen mt-3"></View>
//             </View>

//             {/* Buttons */}
//             <View className="flex flex-row justify-center gap-10 mt-10">
//               <Pressable
//                 className="bg-TealGreen h-10 w-[100] items-center justify-center rounded-sm"
//                 onPress={handleLogout}
//               >
//                 <Text className="text-white text-lg font-semibold">
//                   Log Out
//                 </Text>
//               </Pressable>
//               <Pressable
//                 className="bg-TealGreen h-10 w-[100] items-center justify-center rounded-sm"
//                 onPress={() => setUpdateInput(true)}
//               >
//                 <Text className="text-white text-lg font-semibold">Update</Text>
//               </Pressable>
//             </View>

//             {/* Update Input Section */}
//             {updateInput && (
//               <View className="items-center ">
//                 <View
//                   style={{
//                     marginTop: -400,
//                   }}
//                   className="bg-white   flex-1 transition duration-500 ease-in-out z-50  w-[370px] p-5 itmes-center justify-center"
//                 >
//                   <Pressable
//                     onPress={() => setUpdateInput(false)}
//                     className="absolute h-10 w-10 justify-center items-center top-2 right-2 bg-gray-200 p-2 rounded-full"
//                   >
//                     <Text className="text-lg font-bold text-gray-600">✕</Text>
//                   </Pressable>
//                   <View className="items-center mt-8 ">
//                     <TextInput
//                       label="UserName"
//                       value={username}
//                       onChangeText={setUsername}
//                       mode="outlined"
//                       theme={{ colors: { primary: "teal" } }}
//                       style={{
//                         height: "50px",
//                         width: 300,
//                         backgroundColor: "white",
//                         marginBottom: 10,
//                       }}
//                     />
//                     <TextInput
//                       label="E-mail"
//                       value={email}
//                       onChangeText={setEmail}
//                       mode="outlined"
//                       keyboardType="email-address"
//                       theme={{ colors: { primary: "teal" } }}
//                       style={{
//                         height: "50px",
//                         width: 300,
//                         backgroundColor: "white",
//                         marginBottom: 10,
//                         marginTop: 20,
//                       }}
//                     />
//                     <Mobile
//                       dropdownVisible={dropdownVisible}
//                       setDropdownVisible={setDropdownVisible}
//                       selectedCode={selectedCode}
//                       setSelectedCode={setSelectedCode}
//                       phoneNumber={phoneNumber}
//                       setPhoneNumber={setPhoneNumber}
//                       searchQuery={searchQuery}
//                       setSearchQuery={setSearchQuery}
//                       filteredCountries={filteredCountries}
//                     />

//                     <View className="flex flex-row gap-4">
//                       <Pressable
//                         onPress={() => setResetPass(true)}
//                         className="my-5 bg-TealGreen h-10 items-center justify-center w-[150px] mt-12 rounded-sm"
//                       >
//                         <Text className="text-lg font-bold text-white">
//                           Reset Password
//                         </Text>
//                       </Pressable>
//                       <Pressable
//                         onPress={() => update()}
//                         className="my-5 bg-TealGreen h-10 items-center justify-center w-[150px] mt-12 rounded-sm"
//                       >
//                         <Text className="text-lg font-bold text-white">
//                           Update
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             )}
//             {resetPass && (
//               <View className="items-center justify-center flex z-50">
//                 <View
//                   className="bg-white flex-1 w-[370px] p-5 items-center justify-center relative"
//                   style={{ marginTop: -400 }}
//                 >
//                   {/* Close Button */}
//                   <Pressable
//                     onPress={() => setResetPass(false)}
//                     className="absolute h-10 w-10 justify-center items-center top-2 right-2 bg-gray-200 p-2 rounded-full"
//                   >
//                     <Text className="text-lg font-bold text-gray-600">✕</Text>
//                   </Pressable>

//                   {/* Password Reset Form */}
//                   <Password
//                     password={password}
//                     confirmpass={confirmpass}
//                     setPassword={setPassword}
//                     setConfirmPass={setConfirmPass}
//                     formSubmit={passwordReset}
//                     buttonLabel="Reset Password"
//                     headerLabel="Reset Password"
//                   />
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>
//       </SafeAreaView>
//     </ScrollView>
//   );
// };
// export default ProfileScreen;
