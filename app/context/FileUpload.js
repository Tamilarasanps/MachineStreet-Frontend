import React, { createContext, useState } from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export const FileUpload = createContext();

export const FileUploadProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const pickMedia = async (type, page) => {

    if (Platform.OS === "android" && Platform.Version < 29) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return showToast(
          "Permission Required",
          "Please allow access to the gallery."
        );
      }
    }

    // Set mediaTypes based on the passed `type`
    let mediaTypes;
    if (type === "image") {
      mediaTypes = ImagePicker.MediaTypeOptions.Images;
    } else if (type === "video") {
      mediaTypes = ImagePicker.MediaTypeOptions.Videos;
    } else if (type === "image" && page === "profile") {
      mediaTypes = ImagePicker.MediaTypeOptions.Images;
    } else {
      mediaTypes = ImagePicker.MediaTypeOptions.All; // Both image and video
    }
// console.log(page === "banner")
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      quality: 0.8,
      allowsMultipleSelection: type === "image" && page === "sell", // optional
      allowsEditing: true, // Disable editing on web
      aspect: page === "banner" ? [16,9] : [1, 1], // Set the aspect ratio to 1:1
      base64:true
    });

    const showToast = (text1, text2) => {
      Toast.show({
        type: "error",
        text1,
        text2,
        position: "top",
        topOffset: 0,
      });
    };

    const handleImages = (files) => {
      if (page === "sell") {
        if (selectedImage.length + files.length > 10) {
          return showToast(
            "Image Limit Exceeded",
            "You can upload a maximum of 10 images."
          );
        }
        const validFiles = files.filter((file) => {
          if (file.fileSize > 2 * 1024 * 1024) {
            showToast(
              "File size exceeds 2MB.",
              "Please select a smaller file."
            );
            return false;
          }
          return true;
        });
        if (validFiles.length > 0) {
          setSelectedImage((prev) => [...prev, ...validFiles]);
        }
      } else {
        setSelectedMedia([files[0]]);
      }
    };

    const handleVideo = (file) => {
      const duration = page === "sell" ? 16000 : 41000;
      if (file.duration > duration) {
        return showToast(
          `File duration should be within ${page === "sell" ? 15 : 30} seconds.`
        );
      }

      if (selectedVideo.length > 1) {
        return showToast("You can upload only two videos.");
      }
      page === "sell"
        ? setSelectedVideo((prev) => [...prev, file])
        : setSelectedMedia([file]);
    };

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const type = result.assets[0].mimeType.split("/")[0];

      if (type === "image") {
        // console.log("type image")
        handleImages(result.assets);
      } else {
        handleVideo(result.assets[0]);
      }
    }

    return result;
  };

  return (
    <FileUpload.Provider
      value={{
        pickMedia,
        selectedImage,
        selectedVideo,
        selectedMedia,
        setSelectedMedia,
      }}
    >
      {children}
    </FileUpload.Provider>
  );
};
