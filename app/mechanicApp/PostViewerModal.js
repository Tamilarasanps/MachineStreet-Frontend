import {
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  View,
  Modal,
  SafeAreaView,
  Pressable,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import profile from "../assests/machine/profile.jpg";
import { BlurView } from "expo-blur";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useRef, useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import { useSocketContext } from "../context/SocketContext";
import Entypo from "@expo/vector-icons/Entypo";
import { useCallback } from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Share as NativeShare, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostViewerModal = ({
  posts,
  activeIndex,
  setActiveIndex,
  page,
  onClose,
  userProfile,
  width,
  handleLike,
  setPosts,
  handlePostComment,
  comments,
  setComments,
  comment,
  setComment,
  fetchComments,
  deleteApi,
}) => {
  const scrollRef = useRef(null);
  const postOffsets = useRef([]);
  const [isLayoutDone, setIsLayoutDone] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { socket } = useSocketContext();
  const [showDelete, setShowDelete] = useState("");
  const [heartAnimations, setHeartAnimations] = useState({});

  // console.log("postviewmoda", posts);

  useEffect(() => {
    const newAnimations = {};
    posts.forEach((post) => {
      newAnimations[post._id] = {
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
    setHeartAnimations(newAnimations);
  }, [posts]);

  async function deletePostLogic(postId) {
    const token = await AsyncStorage.getItem("userToken");

    try {
      const response = await deleteApi(
        `mechanicList/deletePosts`,
        { postId: postId },
        token
      );
      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      }
    } catch (error) {
      console.error(error.message, "error");
    }
  }

  const handleDeletePost = useCallback(function (postId) {
    try {
      deletePostLogic(postId);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  }, []);
  useEffect(() => {
    const handleLikeUpdate = async (data) => {
      try {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            // console.log("socket");
            if (post._id.toString() === data.postId.toString()) {
              return {
                ...post,
                likes: data.likes,
              };
            }
            return post;
          })
        );
      } catch (error) {
        console.log("Error playing notification sound:", error);
      }
    };
    if (socket) {
      // console.log;
      socket.on("like-updated", handleLikeUpdate);
    }

    return () => {
      if (socket) {
        socket.off("like-updated", handleLikeUpdate);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current && isLayoutDone && activeIndex !== null) {
      const targetY = postOffsets.current[activeIndex] || 0;
      // Delay scroll to allow for layout update
      setTimeout(() => {
        scrollRef.current.scrollTo({ y: targetY, animated: false });
      }, 100); // Adjust timeout duration if needed
    }
  }, [activeIndex, isLayoutDone]);

  const lastTap = useRef(null);

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const handleDoubleTap = (post) => {
    const now = Date.now();
    if (!post || !Array.isArray(post.likes)) return;

    const currentUser = post.userId;

    if (lastTap.current && now - lastTap.current < 300) {
      const userAlreadyLiked = post.likes.includes(currentUser);
      if (!userAlreadyLiked) {
        handleLike(post._id);
      }
      animateHeart(post._id);
    } else {
      lastTap.current = now;
    }
  };

  const animateHeart = (postId) => {
    const { scale, opacity } = heartAnimations[postId];

    scale.setValue(0);
    opacity.setValue(1);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.5,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  const share = useCallback(async () => {
    // console.log(posts);
    const id = posts.map((id) => id._id);
    const bio =
      typeof posts === "string"
        ? "Awesome post by me"
        : posts.map((bio) => bio.bio);

    const productUrl = `https://machinestreets.com/posts/${id}`;

    const message = `Check out this post: ${bio}\n${productUrl}`;

    try {
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: "Check out this product!",
            text: message,
            url: productUrl,
          });
        } else {
          await navigator.clipboard.writeText(message);
          alert("🔗 URL copied to clipboard (Web Share not supported)");
        }
      } else {
        const result = await NativeShare.share({ message });
        if (result.action === NativeShare.sharedAction) {
          // Shared successfully
        } else if (result.action === NativeShare.dismissedAction) {
          // User dismissed the share
        }
      }
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  }, [posts]);

  // Move all hook declarations before any conditional returns
  const renderPosts = () => {
    if (!posts || activeIndex === null) return null;

    return [...posts].reverse().map((post, index) => {
      // const videoSource = `http://192.168.1.9:5000/video/${post.media}`;
      // const player = useVideoPlayer(videoSource, (player) => {
      //   player.loop = true;
      //   player.play();
      // });

      // const { isPlaying } = useEvent(player, "playingChange", {
      //   isPlaying: player.playing,
      // });
      const isVideo = post.media && post.media.length === 24;
      return (
        <View
          key={post._id}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            postOffsets.current[index] = y;
            if (index === posts.length - 1) {
              // Set layout done once last post layout is measured
              setIsLayoutDone(true);
            }
          }}
          style={{
            width: "100%",
            marginBottom: 8,
          }}
        >
          {/* Header */}
          <View
            className="overflow-hidden py-4"
            style={{
              width: "100%",
              backgroundColor: "white",
              zIndex: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <Image
              source={{
                uri: `data:image/jpeg;base64,${userProfile?.profileImage}`,
              }}
              style={{
                height: 56,
                width: 56,
                borderRadius: 9999,
                resizeMode: "cover",
                marginRight: 12,
              }}
            />
            <Text
              style={{
                color: "black",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {userProfile?.username}
            </Text>
            {page != "uservisit" && (
              <Pressable
                onPress={() => setShowDelete(() => post._id)}
                style={{ position: "absolute", right: 8 }}
              >
                <Entypo name="dots-three-vertical" size={24} color="black" />
              </Pressable>
            )}

            {showDelete === post._id && (
              <Pressable
                onPress={() => {
                  handleDeletePost(post._id);
                }}
                style={{
                  position: "absolute",
                  top: 60,
                  right: 8,
                  backgroundColor: "#f8d7da",
                  padding: 8,
                  borderRadius: 4,
                  elevation: 5,
                }}
              >
                <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
              </Pressable>
            )}
          </View>

          {/* Content */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Media Container */}
            <Pressable
              onPress={() => handleDoubleTap(post)}
              style={{
                width: "100%",
                aspectRatio: 1,
                backgroundColor: "#f0f0f0",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 8,
              }}
            >
              {isVideo ? (
                <VideoGridItem videoId={post.media} index={index} />
              ) : (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${post.media}` }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                />
              )}
              <Animated.View
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "40%",
                  transform: [
                    {
                      scale:
                        heartAnimations[post._id]?.scale ||
                        new Animated.Value(0),
                    },
                  ],
                  opacity:
                    heartAnimations[post._id]?.opacity || new Animated.Value(0),
                  zIndex: 1,
                }}
              >
                <Ionicons name="heart" size={100} color="red" />
              </Animated.View>
            </Pressable>

            <View
              style={{
                width: "100%",
                padding: 12,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 16 }}
                className="items-center "
              >
                <>
                  {post.likes.includes(post.userId) ? (
                    <TouchableOpacity onPress={() => handleLike(post._id)}>
                      <FontAwesome name="heart" size={24} color="red" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleLike(post._id)}>
                      <Feather name="heart" size={24} color="black" />
                    </TouchableOpacity>
                  )}
                  <Text>{post?.likes.length}</Text>
                </>
                <>
                  <Icon
                    onPress={() => {
                      fetchComments(post._id);
                      setSelectedPost(post._id);
                      setCommentModal(true);
                    }}
                    name="message-circle"
                    size={24}
                    color="TealGreen"
                    className="cursor-pointer"
                  />
                  <Text>{post?.comments.length}</Text>
                </>
                <Pressable onPress={share}>
                  <Icon
                    name="send"
                    size={24}
                    color="black"
                    className="cursor-pointer"
                  />
                </Pressable>
              </View>
              <Text style={{ color: "black", marginTop: 16, marginLeft: 8 }}>
                {post.bio}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  // Early return after all hooks are declared
  if (activeIndex === null) {
    return null;
  }

  return (
    <Modal
      visible={activeIndex !== null}
      transparent={true}
      animationType="fade"
    >
      <BlurView
        intensity={50}
        tint="light"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <SafeAreaView style={{ width: "100%" }}>
          {/* Back Icon */}
          <View
            className="  bg-gray-300 z-50 flex justify-center"
            style={{ width: "100%", height: "48" }}
          >
            <Pressable
              onPress={onClose}
              className="flex-row items-center h-12 px-4"
            >
              <Icon name="arrow-left" size={24} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>

        <ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          style={{
            backgroundColor: "#ffffff",
            flex: 1,
            width: width >= 1024 ? 500 : "100%",
            alignSelf: "center",
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {renderPosts()}
          {commentModal && (
            <CommentModal
              onClose={() => setCommentModal(false)}
              handlePostComment={handlePostComment}
              comments={comments}
              setComments={setComments}
              comment={comment}
              setComment={setComment}
              selectedPost={selectedPost}
            />
          )}
        </ScrollView>
      </BlurView>
    </Modal>
  );
};

const VideoGridItem = ({ videoId, onPostPress, index }) => {
  const player = useVideoPlayer(
    `https://api.machinestreets.com/video/${videoId}`,
    // `http://192.168.1.10:5000/video/${videoId}`,
    (player) => {
      player.loop = true;
    }
  );

  const handlePress = () => {
    if (player) {
      if (player.isPlaying()) {
        player.pause(); // pause if already playing
      } else {
        player.play(); // play if paused
      }
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex justify-center items-center h-full w-full"
    >
      <View>
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

export default PostViewerModal;
