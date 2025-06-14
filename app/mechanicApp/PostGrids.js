import React from "react";
import {
  View,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const PostGrid = ({ posts, onPostPress, width, userProfile }) => {
  const columns = width >= 1024 ? 4 : 3;
  // console.log("userprofile post grid:", userProfile?.role);

  if (userProfile?.role === "mechanic") {
    if (!posts) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
  }

  return (
    <View style={{ flexWrap: "wrap", flexDirection: "row", padding: 16 }}>
      {posts?.length > 0 &&
        posts.map((item, index) => {
          const isVideo = item.media.length === 24;

          return (
            <Pressable
              key={item._id}
              onPress={() => onPostPress(index)}
              style={{
                width: width >= 1024 ? "25%" : "33.33%",
                aspectRatio: 1,
                padding: 1,
              }}
            >
              {isVideo ? (
                <VideoGridItem
                  videoId={item.media}
                  onPostPress={onPostPress}
                  index={index}
                />
              ) : (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${item.media}` }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              )}
            </Pressable>
          );
        })}
    </View>
  );
};

const VideoGridItem = ({ videoId, onPostPress, index }) => {
  const player = useVideoPlayer(
    `https://api.machinestreets.com/video/${videoId}`,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  return (
    <Pressable
      onPress={() => onPostPress(index)}
      className="flex justify-center items-center h-full w-full"
    >
      <View className="h-full w-full">
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};

export default PostGrid;
