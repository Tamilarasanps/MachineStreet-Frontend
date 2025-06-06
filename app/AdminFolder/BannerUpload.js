import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Pressable,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import ImageSlider from "../component/(mobileHeader)/ImageSlider";

export default function BannerUpload() {
  const [selectedImage, setSelectedImage] = useState([]);
  const [banner, setBanner] = useState([]); // ✅ Fixed: initialize as empty array
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  const { width } = useWindowDimensions();
  const { postJsonApi, getJsonApi, deleteApi } = useApi();

  // ---------------- Image Picking ----------------
  const pickMedia = async (type) => {
    if (Platform.OS === "android" && Platform.Version < 29) {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return alert("Please allow access to the gallery.");
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      allowsMultipleSelection: type === "image",
    });

    if (!result.canceled && result.assets?.length > 0) {
      type === "image"
        ? handleImages(result.assets)
        : handleVideo(result.assets[0]);
    }
  };

  const handleImages = (files) => {
    if ((selectedImage?.length || 0) + files.length > 10) {
      return alert("You can upload a maximum of 10 images.");
    }
    setSelectedImage((prev) => [...(prev || []), ...files]);
  };

  const deleteImg = (index) => {
    setSelectedImage((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- Fetch Banners ----------------
  const getBanners = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const result = await getJsonApi("adminApproval/getbanners", token);
// console.log('@result :', result)
      if (result.status === 200) {
        const bannerList = result.data.result || [];
        setBanner(bannerList);
        setCurrentIndex(0); // ✅ Always reset index
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  // ---------------- Submit Handler ----------------
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // console.log(selectedImage);
      if (Platform.OS === "web") {
        selectedImage.forEach((image) => {
          formData.append("images", image.file);
        });
      } else {
        selectedImage.forEach((image) => {
          formData.append("images", {
            uri: image.uri,
            name: image.fileName || "banner.jpg",
            type: image.type || "image/jpeg",
          });
        });
      }

      const token = await AsyncStorage.getItem("userToken");
      const result = await postJsonApi(
        "adminApproval/bannerupload",
        formData,
        token
      );

      if (result.status === 200) {
        setSelectedImage([]);
        getBanners(); // Refresh banners after upload
      }
    } catch (err) {
      console.error("Error submitting images:", err);
    }
  };

  // ---------------- Delete Handler ----------------
  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const result = await deleteApi(
        "adminApproval/deletebanners",
        { id },
        token
      );

      if (result.status === 200) {
        setBanner((prev) => {
          const updated = prev.filter((item) => item._id !== id);
          if (currentIndex >= updated.length) {
            setCurrentIndex(Math.max(updated.length - 1, 0));
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
    }
  };

  // ---------------- Render ----------------
  return (
    <ScrollView>

    <View className="items-center">
      <Text className="text-xl font-bold my-4">Banner Upload</Text>

      <Pressable
        onPress={() => pickMedia("image")}
        className="bg-blue-500 px-4 py-2 rounded-md shadow-sm"
      >
        <Text className="font-semibold text-white">Upload</Text>
      </Pressable>

      <View
        className="mt-7 bg-gray-100 py-8 w-full mx-auto gap-8 px-4"
        style={{
          flexDirection: width < 768 ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScrollView
          horizontal={width >= 768}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{
            paddingHorizontal: 10,
            alignItems: "center",
            flexWrap: width < 768 ? "wrap" : "nowrap",
          }}
          style={{
            maxHeight: width < 768 ? 300 : 500,
          }}
        >
          {selectedImage?.length > 0 ? (
            selectedImage.map((imageUri, index) => (
              <Pressable key={index} className="relative mr-3 mb-3">
                <Image
                  source={{ uri: imageUri.uri }}
                  style={{
                    width: width < 768 ? width * 0.9 : 300,
                    height: 200,
                    // borderRadius: 40 ,
                    resizeMode: "cover",
                  }}
                />
                <Pressable
                  onPress={() => deleteImg(index)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                >
                  <MaterialIcons name="close" size={14} color="white" />
                </Pressable>
              </Pressable>
            ))
          ) : (
            <Text className="text-gray-500 text-sm italic self-center">
              Select a Banner
            </Text>
          )}
        </ScrollView>
      </View>

      {selectedImage.length > 0 && (
        <Pressable
          onPress={handleSubmit}
          className="bg-blue-500 px-4 py-2 rounded-md shadow-sm mt-4"
        >
          <Text className="font-semibold text-white">Submit</Text>
        </Pressable>
      )}

      {/* Banners Preview */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : banner.length > 0 ? (
        <View >
        <ImageSlider
          images={banner}
          onDelete={handleDelete}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onChange={(index) => {
            // Optional change button logic
            // console.log("Change image at index:", index);
          }}
          
        />
        </View>
      ) : (
        <Text style={{ marginTop: 20, fontStyle: "italic", color: "gray" }}>
          No banners found. Please upload banners.
        </Text>
      )}
    </View>
    </ScrollView>
  );
}
