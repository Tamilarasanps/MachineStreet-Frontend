import React, { useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import VideoGridItem from "./VideoGridItem";
import CommentSection from "./CommentSection";
import PostFooterIcons from "./PostFooterIcons";
import DeleteIcon from "./DeleteIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureDetector } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const MobilePostViewer = React.memo((props) => {
  const {
    type,
    postDelete,
    comment,
    setComment,
    userId,
    user,
    postModal, // selected post index
    handleLike,
    isDesktop,
    setModal,
    modal,
    screenHeight,
    insets,
    share,
    setSelectedMechanic,
    animatedStyle,
    doubleTap,
    handleTap,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(postModal || 0);
  const [deleteIcon, setDeleteIcon] = useState("");
  const [heartPostId, setHeartPostId] = useState(null);

  const ITEM_HEIGHT =
    Platform.OS === "ios"
      ? (screenHeight - (insets.top + insets.bottom)) * 0.9
      : screenHeight * 0.9;

  const handleScrollEnd = ({ nativeEvent }) => {
    const offsetY = nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / ITEM_HEIGHT);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  const renderMobilePost = (item, index) => (
    <View
      key={item._id}
      style={{ height: ITEM_HEIGHT, width: "100%", backgroundColor: "white" }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e5e5",
          height: "10%",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        {user?.profileImage ? (
          <Image
            source={{
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

      {/* Media with double-tap */}
      <GestureDetector gesture={doubleTap}>
        <Pressable
          onPress={() => {
            setHeartPostId(null);
            setTimeout(() => setHeartPostId(item._id), 0);
            handleTap(item);
          }}
          style={{
            height: "75%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item?.contentType === "video" ? (
            <VideoGridItem
              source={`https://api.machinestreets.com/api/mediaDownload/${item?.media}`}
              page="pvm"
              isVisible={index === currentIndex}
            />
          ) : (
            <Image
              source={{
                uri: `https://api.machinestreets.com/api/mediaDownload/${item?.media}`,
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          )}

          {/* Heart Animation */}
          {heartPostId === item._id && (
            <Animated.View
              key={`${item._id}-${Date.now()}`}
              style={[
                { position: "absolute", top: "40%", left: "40%" },
                animatedStyle,
              ]}
            >
              <AntDesign name="heart" size={100} color="red" />
            </Animated.View>
          )}
        </Pressable>
      </GestureDetector>

      {/* Footer */}
      <View
        style={{
          height: "15%",
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
          user={user}
          setModal={setModal}
          handleLike={handleLike}
          share={share}
          setSelectedMechanic={setSelectedMechanic}
        />
        {item?.bio && (
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
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        pagingEnabled={modal !== "comment"}
        scrollEnabled={modal !== "comment"}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        contentOffset={{ x: 0, y: ITEM_HEIGHT * (postModal || 0) }} // 👈 Start from clicked post
      >
        {user?.posts?.map((item, index) => renderMobilePost(item, index))}
        {modal === "comment" && (
          <CommentSection
            setModal={setModal}
            handleLike={handleLike}
            comment={comment}
            setComment={setComment}
            post={user?.posts?.[currentIndex]} // 👈 Pass only active post
            comments={user?.posts?.[currentIndex]?.comments}
            screenHeight={screenHeight}
            insets={insets}
          />
        )}
      </ScrollView>
      {/* Render comment modal only once */}
    </SafeAreaView>
  );
});

export default MobilePostViewer;
