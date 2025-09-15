import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  Animated,
  Platform,
  Pressable,
  Dimensions,
  View,
  Share as NativeShare,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import DesktopPostViewer from "./Desktop.PostViewer";
import MobilePostViewer from "./Mobile.PostViewer";
import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { Feather } from "@expo/vector-icons";

const PostViewerModal = ({
  type,
  postDelete,
  comment,
  setComment,
  userId,
  setPostModal,
  user,
  modal,
  setModal,
  postModal,
  width,
  isDesktop,
  handleLike,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [heartAnimations, setHeartAnimations] = useState({});
  const screenHeight = Dimensions.get("window").height;

  // Setup heart animations for each post
  useEffect(() => {
    if (user?.posts) {
      const newAnimations = {};
      user.posts.forEach((post) => {
        newAnimations[post._id] = {
          scale: new Animated.Value(0),
          opacity: new Animated.Value(0),
        };
      });
      setHeartAnimations(newAnimations);
    }
  }, [user?.posts]);

  // Double tap + heart animation
  const lastTap = useRef(null);

  const handleDoubleTap = (post) => {
    const now = Date.now();
    if (!post || !Array.isArray(post.likes)) return;

    if (lastTap.current && now - lastTap.current < 300) {
      animateHeart(post._id);
      if (!post.likes.includes(userId)) {
        setTimeout(() => {
          handleLike({ postId: post._id }, "api/postLikes");
        }, 1000); // ✅ use 200 (not [200])
      }
    } else {
      lastTap.current = now;
    }
  };

  const animateHeart = (postId) => {
    const { scale, opacity } = heartAnimations[postId] || {};
    if (!scale || !opacity) return;

    scale.setValue(0);
    opacity.setValue(1);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.5,
        friction: 3,
        tension: 100,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  // Share functionality

  const share = useCallback(
    async (post) => {
      console.log("Triggered:", post);

      try {
        let productUrl;

        if (Platform.OS === "web") {
          // Use your dev server URL for web
          productUrl = `https://api-machinestreets.onrender.com/E2?id=${userId}&type=user_visit&post=${post._id}`;
        } else {
          // Use Expo Linking for native deep link
          productUrl = Linking.createURL("E2", {
            queryParams: {
              id: userId,
              type: "user_visit",
              post: post._id,
            },
          });
        }

        const message = `Check out this post: ${post.bio || ""}\n${productUrl}`;

        if (Platform.OS === "web") {
          if (navigator.share) {
            await navigator.share({
              title: "Check out this post!",
              text: message,
              url: productUrl,
            });
          } else {
            await navigator.clipboard.writeText(message);
            alert("🔗 URL copied to clipboard (Web Share not supported)");
          }
        } else {
          await NativeShare.share({ message });
        }

        console.log("Shared URL:", productUrl);
      } catch (error) {
        console.error("Sharing failed:", error);
        Alert.alert("Error", "Unable to share the post.");
      }
    },
    [userId]
  );

  const goPrev = () =>
    setPostModal((prev) => (prev < user.posts.length - 1 ? prev + 1 : prev));

  const goNext = () => setPostModal((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <View className="z-50 flex-1">
      {/* Close button for desktop */}
      {Platform.OS === "web" && isDesktop && (
        <Pressable
          onPress={() => setPostModal(null)}
          className="z-50 bg-black/40 p-2 rounded-full absolute right-2 top-2"
        >
          <Icon name="x" size={26} color="white" />
        </Pressable>
      )}
      {!isDesktop && (
        <View className="w-full bg-gray" style={{ height: screenHeight * 0.1 }}>
          <Pressable
            onPress={() => setPostModal(null)}
            className="z-50 bg-black/40 p-2 rounded-full absolute left-2 top-2"
          >
            <Feather name="arrow-left" size={26} color="white" />
          </Pressable>
        </View>
      )}

      {isDesktop ? (
        <DesktopPostViewer
          type={type}
          isDesktop={isDesktop}
          userId={userId}
          comment={comment}
          setComment={setComment}
          setModal={setModal}
          handleLike={handleLike}
          handleDoubleTap={handleDoubleTap} // ✅ added
          heartAnimations={heartAnimations} // ✅ added
          share={share} // ✅ added
          item={user?.posts[postModal]}
          goPrev={goPrev}
          goNext={goNext}
          postModal={postModal}
          width={width}
          totalPosts={user?.posts?.length}
          postDelete={postDelete}
        />
      ) : (
        <MobilePostViewer
          screenHeight={screenHeight}
          type={type}
          postDelete={postDelete}
          comment={comment}
          setComment={setComment}
          setModal={setModal}
          modal={modal}
          userId={userId}
          user={user}
          postModal={postModal}
          scrollY={scrollY}
          handleLike={handleLike}
          handleDoubleTap={handleDoubleTap} // ✅ added
          heartAnimations={heartAnimations} // ✅ added
          share={share} // ✅ added
          isDesktop={isDesktop}
          setPostModal={setPostModal}
          insets={insets}
        />
      )}
    </View>
  );
};

export default PostViewerModal;
