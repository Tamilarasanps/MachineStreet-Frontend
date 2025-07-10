import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../../hooks/useApi";
import qrPoster from "../../../assets/images/qrPoster.png";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const QrPosterMobile = () => {
  const { getJsonApi } = useApi();
  const [qr, setQr] = useState([]);
  const posterRefs = useRef([]);

  const screenWidth = Dimensions.get("window").width;
  const containerWidth = Math.min(screenWidth, 350);
  const containerHeight = containerWidth * (16 / 9);

  const qrSize = containerWidth * 0.54;
  const qrLeft = containerWidth * 0.23;
  const qrBottom = containerHeight * 0.2;

  useEffect(() => {
    const fetchQr = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const response = await getJsonApi("adminApproval/adminQr", token);
      if (response.status === 200) {
        setQr(response?.data?.qrCodes);
      }
    };
    fetchQr();
  }, []);

  const handleDownload = async (index) => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Allow media access to download.");
      return;
    }

    try {
      const uri = await posterRefs.current[index].capture();
      const fileName = `${FileSystem.documentDirectory}poster-${index + 1}.png`;

      await FileSystem.moveAsync({
        from: uri,
        to: fileName,
      });

      await MediaLibrary.saveToLibraryAsync(fileName);
      Alert.alert("Success", "Poster saved to gallery.");
    } catch (err) {
      Alert.alert("Error", "Failed to download the poster.");
    }
  };
  // console.log("render");
  return (
    <ScrollView className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-100 px-4 py-6 space-y-10">
      {qr?.map((qrItem, index) => {
        const cleanBase64 = qrItem.qr.replace(/\s+/g, "");

        return (
          <SafeAreaView
            key={index}
            className="w-full flex flex-col items-center bg-white shadow-md rounded-xl overflow-hidden mb-8"
          >
            <ViewShot
              ref={(ref) => (posterRefs.current[index] = ref)}
              onError={(e) =>
                console.log("iOS image error →", e.nativeEvent.error)
              }
              options={{ format: "png", quality: 1, result: "tmpfile" }}
              style={{
                width: containerWidth,
                height: containerHeight,
                backgroundColor: "#eee",
              }}
            >
              <Image
                source={qrPoster}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                }}
              />
              <Image
                source={{ uri: `data:image/png;base64,${cleanBase64}` }}
                style={{
                  width: qrSize,
                  height: qrSize,
                  position: "absolute",
                  bottom: qrBottom,
                  left: qrLeft,
                  borderRadius: 10,
                }}
              />
            </ViewShot>

            <View className="w-full p-6 space-y-3">
              <Text className="text-xl font-bold text-purple-800 break-words">
                {qrItem.name}
              </Text>
              <Text className="text-gray-700 text-base">
                {qrItem.address?.street}
              </Text>
              <Text className="text-gray-600 text-base italic">
                {qrItem.address?.city}, {qrItem.address?.pincode}
              </Text>
              <Text className="text-black font-semibold text-sm">
                📞 {qrItem.contact}
              </Text>

              <TouchableOpacity
                onPress={() => handleDownload(index)}
                className="mt-4 bg-purple-600 px-4 py-2 rounded-md w-max"
              >
                <Text className="text-white font-semibold">
                  Download Poster
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      })}
    </ScrollView>
  );
};

export default QrPosterMobile;

//  <SafeAreaView>

//     <ScrollView>
//       <Text>Test Render</Text>
//       <View className="items-center">
//         <Image
//           source={qrPoster}
//           style={{ width: 470, height: 700, padding: 60 }}
//         />
//         <Image
//           source={qrPoster}
//           style={{ width: 470, height: 700, padding: 60 }}
//         />
//         <Image
//           source={qrPoster}
//           style={{ width: 470, height: 700, padding: 60 }}
//         />
//         <Image
//           source={qrPoster}
//           style={{ width: 470, height: 700, padding: 60 }}
//         />
//       </View>
//       <View>
//       <View className="w-full p-6 space-y-3">
//         <Text className="text-xl font-bold text-purple-800 break-words">
//           {qrItem.name}
//         </Text>
//         <Text className="text-gray-700 text-base">
//           {qrItem.address?.street}
//         </Text>
//         <Text className="text-gray-600 text-base italic">
//           {qrItem.address?.city}, {qrItem.address?.pincode}
//         </Text>
//         <Text className="text-black font-semibold text-sm">
//           📞 {qrItem.contact}
//         </Text>

//         <TouchableOpacity
//           onPress={() => handleDownload(index)}
//           className="mt-4 bg-purple-600 px-4 py-2 rounded-md w-max"
//         >
//           <Text className="text-white font-semibold">Download Poster</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//     </ScrollView>
//   </SafeAreaView>;
