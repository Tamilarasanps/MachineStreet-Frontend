import { useMediaLibraryPermissions } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import { createContext, useContext, useState } from "react";
import Toast from "react-native-toast-message";

export const FileUpload = createContext();

export const FileUploadProvider = ({ children }) => {
  // read permission status
  const [status, requestPermission] = useMediaLibraryPermissions();
  const [media, setMedia] = useState([]);

  const upload = async () => {
    if (!status?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert("Permission is required to access media library.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      console.log('result :', result)
      // Normalize fileSize for web
      const fileSize =
        asset.fileSize ??
        (asset?.uri
          ? await fetch(asset.uri).then((res) => res.blob().then((b) => b.size))
          : 0);

      if (fileSize > 10 * 1024 * 1024) {
        Toast.show({
          type: "info",
          text1: "Media size exceeds 10MB",
          text2: "Please upload media within 10MB",
          position: "top",
          visibilityTime: 2000,
        });
        return;
      }
      
      setMedia([asset]);
    }
  };

  return (
    <FileUpload.Provider value={{ upload, media, setMedia }}>
      {children}
    </FileUpload.Provider>
  );
};

export const useFileUploadContext = () => useContext(FileUpload);
