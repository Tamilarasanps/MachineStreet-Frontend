import React, { useEffect, useState } from "react";
import { Platform, ScrollView, View, Text, Image } from "react-native";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QrPage = () => {
  const { getJsonApi } = useApi();
  const [qr, setQr] = useState([]);

  useEffect(() => {
    console.log("jfnevnjc");
    const fetchQr = async () => {
      console.log("uiuiu");
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await getJsonApi("adminApproval/adminQr", token);
        console.log("response :", response);
        if (response.status === 200) {
          setQr(response?.data?.qrCodes);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchQr();
  }, []);

  return (
    <ScrollView className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-100 px-4 py-6 ">
      {qr?.map((qrItem, index) => {
        // const cleanBase64 = qrItem.qr.replace(/^"|"$/g, ""); // remove outer quotes
        const cleanBase64 = qrItem.qr.replace(/^["']+|["']+$/g, "");


        return (
          <View
            key={index}
            className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-purple-400 mt-4"
          >
            <View className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Image
                source={`data:image/png;base64,${cleanBase64}`}
                alt="QR Code"
                className="h-48 w-48"
              />

              <View className="flex-1 space-y-1 h-full justify-center">
                <Text className="text-2xl font-extrabold text-purple-700 tracking-wide">
                  {qrItem.name}
                </Text>
                <Text className="text-base text-gray-700 font-medium">
                  {qrItem.address.street}
                </Text>
                <Text className="text-base text-gray-600 italic">
                  {qrItem.address}
                </Text>
                <Text className="text-sm text-gray-600">
                  📞{" "}
                  <Text className="font-medium text-black">
                    {qrItem.contact}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default QrPage;
