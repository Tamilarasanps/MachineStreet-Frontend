import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import FadeSlideView from "@/components/FadeSlideView";

const VideoGridItem = ({ source, page, isVisible, setPostModal }) => {
  const player = useVideoPlayer(
    { uri: source, headers: { Origin: "*" } },
    (player) => {
      player.setIsLooping?.(true); // keep looping
    }
  );

  const [showControls, setShowControls] = useState(false);
  const wasVisible = useRef(false); // track previous state

  // 🔹 Auto play/pause + restart when visible again
  useEffect(() => {
    if (isVisible) {
      // if it was hidden before and is now visible → restart from beginning
      if (!wasVisible.current) {
        player.seekTo?.(0);
      }
      player.play?.();
      wasVisible.current = true;
      player.loop = true
    } else {
      player.pause?.();
      wasVisible.current = false;
    }
  }, [isVisible]);

  // 🔹 Pause on unmount
  useEffect(() => {
    return () => {
      player.pause?.();
    };
  }, []);

  const handleTap = () => {
    if (player.playing) player.pause?.();
    else player.play?.();

    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  };

  return (
    <Pressable
      onPress={() => (page === "pvm" ? handleTap() : setPostModal())}
      className="h-full cursor-pointer aspect-video rounded-xl overflow-hidden items-center justify-center"
    >
      <View className="w-full h-full">
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          nativeControls={false}
          resizeMode="contain"
        />

        {showControls && (
          <View className="absolute top-1/2 left-1/2 -mt-8 -ml-8 bg-black/50 rounded-full p-3 z-10">
            <FadeSlideView>
              <MaterialIcons
                name={player.playing ? "pause" : "play-arrow"}
                size={36}
                color="white"
              />
            </FadeSlideView>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default VideoGridItem;
