// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   SafeAreaView,
// } from "react-native";

// const ImageSlider = ({
//   images,
//   onDelete,
//   onChange,
//   currentIndex,
//   setCurrentIndex,
// }) => {
//   const [dynamicWidth, setDynamicWidth] = useState(Dimensions.get("window").width);

//   useEffect(() => {
//     const handleResize = () => {
//       setDynamicWidth(Dimensions.get("window").width);
//     };
//     const subscription = Dimensions.addEventListener("change", handleResize);
//     return () => subscription.remove();
//   }, []);

//   // Responsive sizes
//   const imageWidth = Platform.OS === "web" ? dynamicWidth * 0.6 : dynamicWidth * 0.95;
//   const arrowSize = dynamicWidth > 600 ? 40 : 32;

//   if (!images || images.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>Please upload banners</Text>
//       </View>
//     );
//   }

//   const goLeft = () => {
//     if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
//   };
//   const goRight = () => {
//     if (currentIndex < images.length - 1) setCurrentIndex((prev) => prev + 1);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={[styles.container, { width: imageWidth }]}>
//         {/* Image with Delete Button */}
//         <View style={styles.imageContainer}>
//           <Image
//             source={{
//               uri: `data:image/jpeg;base64,${images[currentIndex]?.bannerImages}`,
//             }}
//             style={styles.image}
//             resizeMode="cover"
//           />
//           {/* Delete Button at Top Right */}
//           <TouchableOpacity
//             onPress={() => onDelete(images[currentIndex]._id)}
//             style={styles.deleteButton}
//           >
//             <Text style={styles.deleteButtonText}>Delete</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Navigation Arrows */}
//         <View style={styles.navigation}>
//           <TouchableOpacity onPress={goLeft} disabled={currentIndex === 0}>
//             <Text
//               style={[
//                 styles.arrow,
//                 { fontSize: arrowSize },
//                 currentIndex === 0 && styles.disabled,
//               ]}
//             >
//               ◀
//             </Text>
//           </TouchableOpacity>
//           <Text style={styles.indexText}>
//             {currentIndex + 1} / {images.length}
//           </Text>
//           <TouchableOpacity
//             onPress={goRight}
//             disabled={currentIndex === images.length - 1}
//           >
//             <Text
//               style={[
//                 styles.arrow,
//                 { fontSize: arrowSize },
//                 currentIndex === images.length - 1 && styles.disabled,
//               ]}
//             >
//               ▶
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ImageSlider;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   container: {
//     alignItems: "center",
//     marginTop: 20,
//   },
//   imageContainer: {
//     width: "100%",
//     aspectRatio: 16 / 9,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "#ccc",
//     position: "relative",
//     marginBottom: 16,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   deleteButton: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "#ff4d4d",
//     borderRadius: 5,
//     padding: 8,
//     zIndex: 2,
//     elevation: 2,
//   },
//   deleteButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   navigation: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 10,
//   },
//   arrow: {
//     color: "#000",
//     paddingHorizontal: 10,
//   },
//   disabled: {
//     color: "#aaa",
//   },
//   indexText: {
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500",
//   },
//   emptyContainer: {
//     alignItems: "center",
//     marginTop: 30,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "gray",
//     fontStyle: "italic",
//   },
// });
