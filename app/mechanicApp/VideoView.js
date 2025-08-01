import { Pressable, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const VideoGridItem = ({ videoId, onPostPress, index }) => {
  const player = useVideoPlayer(
    `https://api.machinestreets.com/video/${videoId}`,
    // `http://192.168.1.10:5000/video/${videoId}`,
    (player) => {
      player.loop = false;
      player.play();
    }
  );

  return (
    <Pressable
      onPress={() => onPostPress(index)}
      className="flex justify-center items-center h-full w-full"
    >
      <View className="w-full h-full">
        <VideoView
          player={player}
          crossOrigin="anonymous" // this is important
          style={{ width: "100%", height: "100%" }}
          controls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
};

export default VideoGridItem;
