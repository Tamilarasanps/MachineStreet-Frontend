import React, { useState } from "react";
import { View, Image, Pressable, Animated } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import VideoGridItem from "./VideoGridItem";
import CommentSection from "./CommentSection";
import DeleteIcon from "./DeleteIcon";

const DesktopPostViewer = ({
  type,
  postDelete,
  userId,
  isDesktop,
  comment,
  setComment,
  handleLike,
  setModal,
  item,
  goPrev,
  goNext,
  postModal,
  totalPosts,
  width,
  handleDoubleTap, // ✅ from parent
  heartAnimations, // ✅ from parent
  share,
  user, // ✅ from parent
}) => {
  const [deleteIcon, setDeleteIcon] = useState("");
  const anim = heartAnimations[item._id] || {
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
  };
  console.log('postModal :', postModal)
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
      <View
        className="flex-1 flex-row items-center justify-center relative m-auto"
        style={{ width: width * 0.8 }}
      >
        {/* Media */}
        <View className="bg-gray-100 w-3/5 h-[80%] flex items-center justify-center relative">
          <View className="w-full h-12 bg-gray-100 relative">
            <DeleteIcon
              deleteIcon={deleteIcon}
              type={type}
              item={item}
              postDelete={postDelete}
              setDeleteIcon={setDeleteIcon}
              isDesktop={isDesktop}
            />
          </View>
          <Pressable
            onPress={() => handleDoubleTap(item)}
            className="h-[90%] w-full justify-center items-center py-4"
          >
            {item?.contentType === "video" ? (
              <VideoGridItem
                // source={`http://192.168.1.10:5000/api/mediaDownload/${item?.media}`}
                source={`https://api.machinestreets.com/api/mediaDownload/${item?.media}`}
                isVisible={true}
                page={"pvm"}
              />
            ) : (
              <Image
                source={{
                  uri: `https://api.machinestreets.com/api/mediaDownload/${item?.media}`,
                  // uri: `http://192.168.1.10:5000/api/mediaDownload/${item?.media}`,
                }}
                className="w-full h-full"
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
        </View>

        {/* Comments */}
        <View className="bg-white w-2/5 h-[80%] flex flex-col justify-between">
          <CommentSection
            user={user}
            userId={userId}
            isDesktop={isDesktop}
            onclose={() => setModal("")}
            handleLike={handleLike}
            comment={comment}
            setComment={setComment}
            post={item}
            comments={item?.comments}
            share={share} // ✅ pass share support
          />
        </View>
      </View>

      {/* Arrows */}
      {postModal  > 0  && (
        <Pressable
          onPress={goNext }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full"
        >
          <Icon name="chevron-left" size={28} color="white" />
        </Pressable>
      )}
      {postModal < totalPosts - 1 && (
        <Pressable
          onPress={goPrev}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full"
        >
          <Icon name="chevron-right" size={28} color="white" />
        </Pressable>
      )}
    </View>
  );
};

export default DesktopPostViewer;
