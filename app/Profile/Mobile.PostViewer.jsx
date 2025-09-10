import React, { useRef, useState, useEffect } from "react";
import { Animated, View, Image, Text, Platform, Pressable } from "react-native";
import VideoGridItem from "./VideoGridItem";
import CommentSection from "./CommentSection";
import PostFooterIcons from "./PostFooterIcons";
import DeleteIcon from "./DeleteIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const MobilePostViewer = React.memo((props) => {
  const {
    type,
    postDelete,
    comment,
    setComment,
    userId,
    user,
    postModal,
    scrollY,
    handleLike,
    isDesktop,
    setModal,
    modal,
    screenHeight,
    insets,
    handleDoubleTap,
    heartAnimations,
    share,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(postModal);
  const [deleteIcon, setDeleteIcon] = useState("");
  const flatListRef = useRef(null);

  // sync external postModal
  useEffect(() => {
    if (postModal !== null) {
      setCurrentIndex(postModal);
    }
  }, [postModal]);

  // if comment modal is open, disable tracking
  useEffect(() => {
    if (modal === "comment") setCurrentIndex(-1);
  }, [modal]);

  // ✅ scroll offset -> currentIndex
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const itemHeight =
          Platform.OS === "ios"
            ? (screenHeight - (insets.top + insets.bottom)) * 0.9
            : screenHeight * 0.9;

        const newIndex = Math.round(offsetY / itemHeight);
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      },
    }
  );

  const renderMobilePost = ({ item, index }) => {
    const anim = heartAnimations[item._id] || {
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    };

  console.log('mobile :', comment)

    return (
      <SafeAreaView className="flex-1">
        {/* main container */}
        <View
          style={{
            height:
              Platform.OS === "ios"
                ? screenHeight - (insets.top + insets.bottom) * 0.9
                : screenHeight * 0.9,
            backgroundColor: "white",
          }}
        >
          {/* header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#e5e5e5",
              height:
                (Platform.OS === "ios"
                  ? screenHeight - (insets.top + insets.bottom)
                  : screenHeight) * 0.1,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            {user?.profileImage ? (
              <Image
                source={{
                  uri: `http://localhost:5000/api/mediaDownload/${user?.profileImage}`,
                }}
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                  resizeMode: "cover",
                  marginRight: 12,
                }}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={48} color="gray" />
            )}

            <Text
              style={{
                color: "black",
                fontWeight: "600",
                fontSize: 16,
                marginLeft: 20,
              }}
            >
              {user?.username}
            </Text>

            <DeleteIcon
              deleteIcon={deleteIcon}
              type={type}
              item={item}
              postDelete={postDelete}
              setDeleteIcon={setDeleteIcon}
              isDesktop={isDesktop}
            />
          </View>

          {/* media with double-tap */}
          <Pressable
            onPress={() => handleDoubleTap(item)}
            style={{
              height:
                (Platform.OS === "ios"
                  ? screenHeight - (insets.top + insets.bottom)
                  : screenHeight) * 0.7,
              width: "100%",
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item?.contentType === "video" ? (
              <VideoGridItem
                source={`http://localhost:5000/api/mediaDownload/${item?.media}`}
                page="pvm"
                isVisible={index === currentIndex}
              />
            ) : (
              <Image
                source={{
                  uri: `http://localhost:5000/api/mediaDownload/${item?.media}`,
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            )}

            {/* ❤️ heart animation */}
            <Animated.View
              style={{
                position: "absolute",
                alignSelf: "center",
                opacity: anim.opacity,
                transform: [{ scale: anim.scale }],
              }}
            >
              <Ionicons name="heart" size={120} color="white" />
            </Animated.View>
          </Pressable>

          {/* footer */}
          <View
            style={{
              height:
                (Platform.OS === "ios"
                  ? screenHeight - (insets.top + insets.bottom)
                  : screenHeight) * 0.1,
              width: "100%",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: "#e5e5e5",
              backgroundColor: "white",
            }}
          >
            <PostFooterIcons
              item={item}
              userId={userId}
              setModal={setModal}
              handleLike={handleLike}
              share={share}
            />
            {item?.bio ? (
              <Text
                style={{
                  color: "black",
                  paddingHorizontal: 16,
                  paddingBottom: 8,
                  marginTop: 2,
                }}
              >
                {item?.bio}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Comments modal */}
        {modal === "comment" && (
          <View
            className="absolute bottom-0 rounded-2xl pt-2 px-4 shadow-lg right-0 left-0"
            style={{
              height: "95%",
              width: isDesktop ? 500 : "100%",
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <CommentSection
                onclose={() => setModal("")}
                handleLike={handleLike}
                comment={comment}
                setComment={setComment}
                post={item}
                comments={item?.comments}
              />
            </SafeAreaView>
          </View>
        )}
      </SafeAreaView>
    );
  };
  const ITEM_HEIGHT = Platform.OS === "ios" 
  ? (screenHeight - (insets.top + insets.bottom)) * 0.9 
  : screenHeight * 0.9;

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={user?.posts}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={renderMobilePost}
      initialScrollIndex={postModal}
      pagingEnabled={modal !== "comment"}
      scrollEnabled={modal !== "comment"}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll} // ✅ scroll offset tracking
      scrollEventThrottle={16}
      windowSize={3}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews
    />
  );
});

export default MobilePostViewer;
