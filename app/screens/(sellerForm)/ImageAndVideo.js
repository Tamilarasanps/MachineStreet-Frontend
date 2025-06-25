// import React from "react";
// import { View, Text, Platform, Image } from "react-native";
// import { useState } from "react";
// import { MaterialIcons } from "@expo/vector-icons";
// import { ScrollView } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Pressable } from "react-native";
// import Toast from "react-native-toast-message";
// import { VideoView, useVideoPlayer } from "expo-video";

// const ImageAndVideo = ({
//   selectedImage,
//   setSelectedImage,
//   selectedVideo,
//   setSelectedVideo,
//   setImageModal,
//   width,
// }) => {
//   const pickMedia = async (type) => {
//     if (Platform.OS === "android" && Platform.Version < 29) {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         return showToast(
//           "Permission Required",
//           "Please allow access to the gallery."
//         );
//       }
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: type === "image" ? "Images" : "Videos",
//       quality: 0.8,
//       allowsMultipleSelection: type === "image",
//     });

//     if (!result.canceled && result.assets && result.assets?.length > 0) {
//       type === "image"
//         ? handleImages(result.assets)
//         : handleVideo(result.assets[0]);
//     }
//   };

//   const showToast = (text1, text2) => {
//     Toast.show({
//       type: "error",
//       text1,
//       text2,
//       position: "top",
//       topOffset: 0,
//     });
//   };

//   const handleImages = (files) => {
//     if (selectedImage?.length + files?.length > 10) {
//       return showToast(
//         "Image Limit Exceeded",
//         "You can upload a maximum of 10 images."
//       );
//     }

//     const validFiles = files.filter((file) => {
//       if (file.fileSize > 2 * 1024 * 1024) {
//         showToast("File size exceeds 2MB.", "Please select a smaller file.");
//         return false;
//       }
//       return true;
//     });

//     if (validFiles?.length > 0) {
//       setSelectedImage((prev) => [...prev, ...validFiles]);
//     }
//   };

//   const handleVideo = (file) => {
//     // console.log("file :", file);
//     // console.log("file :", file.duration > 16000);
//     if (file.duration > 16000) {
//       return showToast("File duration should be within 15 seconds.");
//     }

//     if (selectedVideo?.length > 1) {
//       return showToast("You can upload only two video");
//     }

//     setSelectedVideo((prev) => [...prev, file]);
//   };

//   //image and video delete

//   const deleteImg = (index) => {
//     const newImg = selectedImage.filter((_, i) => i !== index);
//     setSelectedImage(newImg);
//   };

//   const deleteVid = (index) => {
//     const newVid = selectedVideo.filter((_, i) => i !== index);
//     setSelectedVideo(newVid);
//   };

//   // if(selectedVideo.length>0){
//   const player = useVideoPlayer(selectedVideo[0]?.uri, (player) => {
//     player.loop = true;
//     player.play();
//   });
//   const players = useVideoPlayer(selectedVideo[1]?.uri, (player) => {
//     player.loop = true;
//     player.play();
//   });
//   // }
//   return (
//     <View>
//       <View className="mt-7 bg-gray-100 py-8 w-[100%] mx-auto flex flex-row gap-8 px-4">
//         <MaterialIcons
//           className="my-auto"
//           name="insert-photo"
//           onPress={() => pickMedia("image")}
//           size={50}
//           color="teal"
//         />

//         {/* Display selected images */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={true} // Show scrollbar for better control
//           contentContainerStyle={{
//             paddingHorizontal: 10,
//             alignItems: "center",
//           }}
//         >
//           {selectedImage?.length > 0 ? (
//             selectedImage.map((imageUri, index) => (
//               <Pressable
//                 key={index}
//                 className="relative mr-3 cursor-pointer"
//                 onPress={() => setImageModal(true)}
//               >
//                 <Image
//                   source={{ uri: imageUri.uri }}
//                   style={{ width: 100, height: 100, borderRadius: 8 }}
//                 />
//                 <Pressable
//                   className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md"
//                   onPress={() => deleteImg(index)}
//                 >
//                   <MaterialIcons name="close" size={14} color="white" />
//                 </Pressable>
//               </Pressable>
//             ))
//           ) : (
//             <Text className="text-gray-500 text-sm italic self-center">
//               No images selected
//             </Text>
//           )}
//         </ScrollView>
//       </View>

//       {/* video  */}

//       <Text className="text-lg font-semibold text-teal-600 mt-6">
//         Machine Videos
//       </Text>
//       <View
//         className={`mt-7 bg-gray-100 py-8  w-[100%] mx-auto flex ${
//           width < 640 ? "flex-col " : "flex-row"
//         }  gap-8 px-4`}
//       >
//         <MaterialIcons
//           className={`my-auto ${width < 640 ? "flex-col " : "flex-row"}`}
//           name="videocam"
//           onPress={() => pickMedia("video")}
//           size={50}
//           color="teal"
//         />
//         {/* Display selected videos */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={true} // Show scrollbar for mouse scrolling
//           scrollEventThrottle={16}
//           contentContainerStyle={{
//             paddingHorizontal: 10,
//             alignItems: "center",
//           }}
//         >
//           {selectedVideo?.length > 0 ? (
//             selectedVideo.map((vid, index) => (
//               <View
//                 key={index}
//                 className="relative w-64 h-36 justify-center items-center mr-3 my-auto"
//               >
//                 <VideoView
//                   source={{ uri: vid.uri }}
//                   player={index === 0 ? player : players}
//                   resizeMode="contain"
//                   allowsFullscreen
//                   allowsPictureInPicture
//                   style={{ width: "100%", height: "100%" }}
//                 />
//                 <Pressable
//                   className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md"
//                   onPress={() => deleteVid(index)}
//                 >
//                   <MaterialIcons name="close" size={14} color="white" />
//                 </Pressable>
//               </View>
//             ))
//           ) : (
//             <Text className="text-gray-500 text-sm italic self-center">
//               No Videos selected
//             </Text>
//           )}
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default ImageAndVideo;
