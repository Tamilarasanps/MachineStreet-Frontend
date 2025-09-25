import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  Animated,
  Platform,
  Pressable,
  Dimensions,
  View,
  Share as NativeShare,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import DesktopPostViewer from "./Desktop.PostViewer";
import MobilePostViewer from "./Mobile.PostViewer";
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
  setSelectedMechanic,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  // const [heartAnimations, setHeartAnimations] = useState({});
  const screenHeight = Dimensions.get("window").height;

  // const animateHeart = (postId) => {
  //   const anim = heartAnimations[postId];
  //   if (!anim) return;

  //   anim.scale.setValue(0);
  //   anim.opacity.setValue(1);

  //   Animated.parallel([
  //     Animated.spring(anim.scale, {
  //       toValue: 1.5,
  //       friction: 3,
  //       tension: 100,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(anim.opacity, {
  //       toValue: 1,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //   ]).start(() => {
  //     Animated.parallel([
  //       Animated.timing(anim.scale, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(anim.opacity, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   });
  // };

  // useEffect(() => {
  //   if (user?.posts) {
  //     const newAnimations = {};
  //     user.posts.forEach((post) => {
  //       newAnimations[post._id] = {
  //         scale: new Animated.Value(0),
  //         opacity: new Animated.Value(0),
  //       };
  //     });
  //     setHeartAnimations(newAnimations);
  //   }
  // }, [user?.posts]);

  // const lastTap = useRef(null);

  // const handleDoubleTap = (post) => {
  //   const now = Date.now();
  //   if (!post || !Array.isArray(post.likes)) return;

  //   if (lastTap.current && now - lastTap.current < 300) {
  //     animateHeart(post._id);
  //     if (!post.likes.includes(userId)) {
  //       setSelectedMechanic((prev) =>
  //         prev
  //           ? {
  //               ...prev,
  //               posts: prev.posts.map((p) =>
  //                 p._id === post._id
  //                   ? {
  //                       ...p,
  //                       likes: p.likes ? [...p.likes, userId] : [userId],
  //                     }
  //                   : p
  //               ),
  //             }
  //           : prev
  //       );
  //       setTimeout(() => {
  //         handleLike({ postId: post._id }, "api/postLikes");
  //       }, 500);
  //     }
  //   } else {
  //     lastTap.current = now;
  //   }
  // };

  const share = useCallback(
    async (post) => {
      try {
        let productUrl;
        if (Platform.OS === "web") {
          productUrl = `https://api.machinestreets.com/E2?id=${userId}&type=user_visit&post=${post._id}`;
        } else {
          productUrl = Linking.createURL("E2", {
            queryParams: { id: userId, type: "user_visit", post: post._id },
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
      } catch (error) {
        Alert.alert("Error", "Unable to share the post.");
      }
    },
    [userId]
  );

  const goPrev = () =>
    setPostModal((prev) => (prev < user.posts.length - 1 ? prev + 1 : prev));
  const goNext = () => setPostModal((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <SafeAreaView className="z-50 flex-1 ">
      {/* Desktop close button */}
      {Platform.OS === "web" && isDesktop && (
        <Pressable
          onPress={() => setPostModal(null)}
          className="bg-gray-100 z-50 p-2 rounded-full absolute right-2 top-2"
        >
          <Icon name="x" size={26} color="white" />
        </Pressable>
      )}
      {!isDesktop && (
        <View
          className="w-full bg-white"
          style={{
            height:
              Platform.OS === "ios"
                ? (screenHeight - (insets.top + insets.bottom)) * 0.1
                : screenHeight * 0.1,
          }}
        >
          <Pressable
            onPress={() => setPostModal(null)}
            className="z-50 bg-black/40 p-2 rounded-full absolute left-2 top-2"
          >
            <Feather name="arrow-left" size={26} color="white" />
          </Pressable>
        </View>
      )}

      {isDesktop && user?.posts[postModal] ? (
        <DesktopPostViewer
          type={type}
          isDesktop={isDesktop}
          userId={userId}
          comment={comment}
          setComment={setComment}
          setModal={setModal}
          handleLike={handleLike}
          // handleDoubleTap={handleDoubleTap}
          // heartAnimations={heartAnimations}
          share={share}
          item={user.posts[postModal]}
          goPrev={goPrev}
          goNext={goNext}
          postModal={postModal}
          width={width}
          totalPosts={user?.posts?.length}
          postDelete={postDelete}
          user={user}
        />
      ) : null}
      {!isDesktop && user?.posts[postModal] && (
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
          // handleDoubleTap={handleDoubleTap}
          // heartAnimations={heartAnimations}
          share={share}
          isDesktop={isDesktop}
          setPostModal={setPostModal}
          insets={insets}
          setSelectedMechanic={setSelectedMechanic}
        />
      )}
    </SafeAreaView>
  );
};
// kjnjh
export default PostViewerModal;
