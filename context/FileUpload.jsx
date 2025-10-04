import { useMediaLibraryPermissions } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import { createContext, useContext, useState } from "react";
import { Toast } from "toastify-react-native";

export const FileUpload = createContext();

export const FileUploadProvider = ({ children }) => {
  // read permission status
  const [status, requestPermission] = useMediaLibraryPermissions();
  const [media, setMedia] = useState([]);

  const upload = async (type) => {
    console.log('uc :', type)
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
      aspect: type==='banner' ? [16,9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      // Normalize fileSize for web
      const fileSize =
        asset.fileSize ??
        (asset?.uri
          ? await fetch(asset.uri).then((res) => res.blob().then((b) => b.size))
          : 0);

      if (fileSize > 10 * 1024 * 1024) {
        Toast.info("Media size exceeds 10MB. Please upload media within 10MB", {
          duration: 2000,
          position: "top",
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
