// import React, { useRef, useState, useEffect } from "react";
// import { Animated, View, Text, Platform } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
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
  const flatListRef = useRef(null);

  const [deleteIcon, setDeleteIcon] = useState("");

  // ✅ Define ITEM_HEIGHT once
  const ITEM_HEIGHT =
    Platform.OS === "ios"
      ? (screenHeight - (insets.top + insets.bottom)) * 0.9
      : screenHeight * 0.9;

  // ✅ Scroll to initial index after FlatList mounts
  useEffect(() => {
    if (flatListRef.current && postModal !== null) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: postModal,
          animated: false,
        });
      }, 50); // small delay to allow layout
    }
  }, [postModal]);

  // ✅ Update currentIndex after scroll ends
  const handleMomentumScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / ITEM_HEIGHT);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  const renderMobilePost = ({ item,index }) => {
    const anim = heartAnimations[item._id] || {
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    };
    // khbhkb
    return (
      <View
        style={{
          height: ITEM_HEIGHT,
          width: "100%",
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
            height:'10%',
            width: "100%",
            backgroundColor: "white",
          }}
        >
          {user?.profileImage ? (
            <Image
              source={{
                // uri: `http://192.168.43.158:5000/api/mediaDownload/${user?.profileImage}`,
                uri: `https://api.machinestreets.com/api/mediaDownload/${user?.profileImage}`,
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
          className="bg-gray-100"
          style={{
            height:'75%',
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item?.contentType === "video" ? (
            <View className="h-full w-full">
              <VideoGridItem
              // source={`http://192.168.43.158:5000/api/mediaDownload/${item?.media}`}
              source={`https://api.machinestreets.com/api/mediaDownload/${item?.media}`}
              page="pvm"
              isVisible={index === currentIndex}
            />
            </View>
          ) : (
            <Image
              source={{
                // uri: `http://192.168.43.158:5000/api/mediaDownload/${item?.media}`,
                uri: `https://api.machinestreets.com/api/mediaDownload/${item?.media}`,
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
            height:'15%',
            width: "100%",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "#e5e5e5",
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
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
  initialScrollIndex={0} // ✅ set correctly
  pagingEnabled={modal !== "comment"}
  scrollEnabled={modal !== "comment"}
  showsVerticalScrollIndicator={false}
  onMomentumScrollEnd={handleMomentumScrollEnd}
  scrollEventThrottle={16}
  windowSize={3}
  initialNumToRender={3}
  maxToRenderPerBatch={3}
  removeClippedSubviews={false}
/>

    </SafeAreaView>
  );
});

export default MobilePostViewer;
