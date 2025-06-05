import { Pressable, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const VideoGridItem = ({ videoId, onPostPress, index }) => {
  const player = useVideoPlayer(
    `http://192.168.1.9:4000/video/${videoId}`,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  console.log('video :' , videoId)

  return (
    <Pressable
      onPress={() => onPostPress(index)}
      className="flex justify-center items-center h-full w-full"
    >
      <View>
        <VideoView
          player={player}
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