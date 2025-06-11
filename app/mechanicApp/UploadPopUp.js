import React, { useState } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  useWindowDimensions,
  Platform,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import Icon from "react-native-vector-icons/MaterialIcons";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UploadPopUp = ({
  selectedMedia,
  fetchPosts,
  setFileUpload,
  fileUpload,
  setSelectedMedia,
}) => {
  const [description, setDescription] = useState("");
  const { width } = useWindowDimensions();
  const { postJsonApi } = useApi();

  const isDesktop = width >= 768; // adjust as needed

  const handleUpload = async () => {
    const formdata = new FormData();
    try {
      const type = selectedMedia[0].mimeType.split("/")[0];
      // console.log("object:", selectedMedia)
      formdata.append("bio", description);
      selectedMedia.forEach((media) => {
      if(Platform.OS === 'web'){
        formdata.append(
          `${type === "image" ? "images" : "videos"}`,
          media.file
        );
      }
      else{
        //  if (Platform.OS === "web") {
        //         result.assets.forEach((asset) => {
        //           formdata.append("images", asset.file);
        //         });
        //       } else {
        //         result.assets.forEach((asset) => {
        //           formdata.append("images", {
                    
        //           });
        //         });
        //       }
        formdata.append(
          `${type === "image" ? "images" : "videos"}`,
         {
          uri: media.uri,
          type: media.mimeType || "image/jpeg", // use default if mimeType is missing
          name: media.fileName || `upload_${Date.now()}.jpg`, // fallback name
          }
        );
      }
      });

      const token = await AsyncStorage.getItem("userToken");
      const result = await postJsonApi(
        "mechanicList/postMedia",
        formdata,
        token
      );
      if (result.status === 200) {
        setFileUpload(false);
        setSelectedMedia([]);

        // Delay fetchPosts by 1 second (1000 milliseconds)
        setTimeout(() => {
          fetchPosts();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const type = selectedMedia[0]?.mimeType?.split("/")[0];

  const players = useVideoPlayer(selectedMedia[0]?.uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <Modal
      visible={fileUpload}
      animationType="fade"
      transparent
      onRequestClose={() => setFileUpload(false)}
    >
      <View className="flex-1 items-center justify-center bg-black/30">
        <View
          className="bg-white rounded-xl p-4 space-y-4 relative"
          style={{ width: isDesktop ? 500 : "90%" }}
        >
          {/* Close Button */}
          <TouchableOpacity
            className="absolute top-2 right-2 z-10 bg-gray-200 rounded-full w-8 h-8 items-center justify-center"
            onPress={() => {
              setFileUpload(false);
              setSelectedMedia([]);
            }}
          >
            <Icon name="close" size={20} color="black" />
          </TouchableOpacity>

          {selectedMedia && type === "image" && (
            <Image
              source={{ uri: selectedMedia[0]?.uri }}
              className="w-full h-60 rounded-xl mt-2"
              resizeMode="contain"
            />
          )}

          {selectedMedia && type === "video" && (
            <View className="w-full aspect-video rounded-xl overflow-hidden items-center justify-center mt-2">
              <VideoView
                source={{ uri: selectedMedia[0]?.uri }}
                player={players}
                resizeMode="contain"
                allowsFullscreen
                allowsPictureInPicture
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          )}

          <TextInput
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            maxLength={100}
            className="border border-gray-300 rounded-xl p-3 h-24 text-base mt-4"
            multiline
          />

          <TouchableOpacity
            onPress={handleUpload}
            className="bg-blue-500 p-3 rounded-xl items-center mt-4"
          >
            <Text className="text-white font-semibold">Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UploadPopUp;
