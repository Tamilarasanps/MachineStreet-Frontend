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
  KeyboardAvoidingView,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import Icon from "react-native-vector-icons/MaterialIcons";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import { BlurView } from "expo-blur";

const UploadPopUp = ({
  selectedMedia,
  fetchPosts,
  setFileUpload,
  fileUpload,
  setSelectedMedia,
}) => {
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(null);
  const { width } = useWindowDimensions();
  const { postJsonApi } = useApi();

  const isDesktop = width >= 768;
  const type = selectedMedia[0]?.mimeType?.split("/")[0];

  const handleUpload = async () => {
    const formdata = new FormData();
    try {
      formdata.append("bio", description);

      selectedMedia.forEach((media) => {
        const field = type === "image" ? "images" : "videos";
        if (Platform.OS === "web") {
          formdata.append(field, media.file);
        } else {
          formdata.append(field, {
            uri: media.uri,
            type: media.mimeType || "image/jpeg",
            name: media.fileName || `upload_${Date.now()}.jpg`,
          });
        }
      });

      const token = await AsyncStorage.getItem("userToken");

      const result = await postJsonApi(
        "mechanicList/postMedia",
        formdata,
        token,
        (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        }
      );

      if (result.status === 200) {
        setFileUpload(false);
        setSelectedMedia([]);
        setProgress(null);
        setTimeout(() => {
          fetchPosts();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const players = useVideoPlayer(selectedMedia[0]?.uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <Modal
      visible={fileUpload}
      animationType="fade"
      transparent
      onRequestClose={() => {
        setFileUpload(false);
        setSelectedMedia([]);
        setProgress(null);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BlurView
          intensity={30}
          tint="dark"
          className="flex-1 justify-center items-center"
        >
          {progress !== null ? (
            <View className="items-center justify-center">
              <Progress.Circle
                size={90}
                showsText={true}
                progress={progress / 100}
                formatText={() => `${progress}%`}
                color="#10B981" // ✅ Bright Green
                borderWidth={2}
                thickness={7}
                textStyle={{ fontWeight: "bold", color: "white" }}
              />
              <Text className="text-white mt-3 font-semibold text-base">
                Uploading...
              </Text>
            </View>
          ) : (
            <View
              className="bg-white rounded-xl p-4 space-y-4 relative"
              style={{ width: isDesktop ? 500 : "90%" }}
            >
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
                className="bg-green-600 p-3 rounded-xl items-center mt-4"
              >
                <Text className="text-white font-semibold">Upload</Text>
              </TouchableOpacity>
            </View>
          )}
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default UploadPopUp;
