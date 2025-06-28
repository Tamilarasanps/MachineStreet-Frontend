import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as htmlToImage from "html-to-image";
import useApi from "../../hooks/useApi";
import qrPoster from "../../../assets/images/qrPoster.png";

const QrPosterWeb = () => {
  const { getJsonApi } = useApi();
  const [qr, setQr] = useState([]);
  const posterRefs = useRef([]);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const fetchQr = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const response = await getJsonApi("adminApproval/adminQr", token);
      console.log("response :", response);
      if (response.status === 200) {
        setQr(response?.data?.qrCodes);
      }
    };
    fetchQr();
  }, []);

  const handleDownload = async (index) => {
    const node = posterRefs.current[index];
    if (!node) return;

    const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 4 }); // Increase pixelRatio for HD
    const link = document.createElement("a");
    link.download = `poster-${index + 1}.png`;
    link.href = dataUrl;
    link.click();
  };

  // const handleDownload = async (index) => {
  //   const node = posterRefs.current[index];
  //   if (!node) return;

  //   // Increase scale for higher resolution
  //   const canvas = await html2canvas(node, {
  //     scale: 5, // Higher scale for better quality
  //     useCORS: true, // Enable CORS for external images
  //     allowTaint: false, // Prevent tainted canvas
  //     logging: true, // Optional: logs for debugging
  //   });
  //   const link = document.createElement("a");
  //   link.download = `poster-${index + 1}.png`;
  //   link.href = canvas.toDataURL("image/png", 1.0); // 1.0 for max quality
  //   link.click();
  // };

  return (
    <ScrollView className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-100 px-4 py-6 space-y-10">
      {qr?.map((qrItem, index) => {
        const cleanBase64 = qrItem.qr.replace(/^["']+|["']+$/g, "");

        return (
          <View
            key={index}
            className="w-full flex flex-col md:flex-row items-center bg-white shadow-md rounded-xl overflow-hidden mb-8 p-6"
          >
            <View
              ref={(el) => (posterRefs.current[index] = el)}
              onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: 9 / 16,
                maxWidth: 350,
                backgroundColor: "#f3f4f6", // bg-gray-100
              }}
            >
              <Image
                source={qrPoster}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />

              {containerWidth > 0 && (
                <Image
                  source={{ uri: `data:image/png;base64,${cleanBase64}` }}
                  style={{
                    width: containerWidth * 0.54, // 54% of container width (190/350)
                    height: containerWidth * 0.54, // Keep square
                    position: "absolute",
                    bottom: containerWidth * 0.36, // 125/350 = 36%
                    left: containerWidth * 0.23, // 80/350 = 23%
                  }}
                />
              )}
            </View>

            <View className="w-full md:w-1/2 p-6 space-y-3">
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
          </View>
        );
      })}
    </ScrollView>
  );
};

export default QrPosterWeb;
