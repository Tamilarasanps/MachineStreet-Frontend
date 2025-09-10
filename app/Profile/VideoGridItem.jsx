import FadeSlideView from "@/components/FadeSlideView";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { AppState, Pressable, View } from "react-native";

const VideoGridItem = ({ source, page, isVisible, setPostModal }) => {
  const player = useVideoPlayer({ uri: source }, (player) => {
    player.setIsLooping?.(true); // keep looping
  });

  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // <-- mute state
  const wasVisible = useRef(false); // track previous state

  useEffect(() => {
    if (isVisible) {
      player.seekTo?.(0);
      player.replay?.();
      player.loop=true;
      wasVisible.current = true;
    } else {
      player.pause?.();
      player.seekTo?.(0);
      wasVisible.current = false;
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      player.pause?.();
      player.seekTo?.(0);
    };
  }, []);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        player.pause?.();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleTap = () => {
    if (player.playing) player.pause?.();
    else player.play?.();

    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      player.muted = !prev; // directly mute/unmute the video
      return !prev;
    });
  };

  return (
    <Pressable
      onPress={() => (page === "pvm" ? handleTap() : setPostModal())}
      className="h-full cursor-pointer  overflow-hidden items-center justify-center"
    >
      <View className="w-full h-full">
        <VideoView
          player={player}
          style={{ width: "100%", height: "100%" }}
          nativeControls={false}
          resizeMode="contain"
          crossOrigin="use-credentials"
        />

        {/* Play/Pause Control */}
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

        {/* Mute/Unmute Button */}
       {page==='pvm' && <Pressable
          onPress={toggleMute}
          className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 z-10"
        >
          <MaterialIcons
            name={isMuted ? "volume-off" : "volume-up"}
            size={24}
            color="white"
          />
        </Pressable>}
      </View>
    </Pressable>
  );
};

export default VideoGridItem;
