import React, { useContext, useRef } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { FormatTime } from "@/context/FormatTime";
import PostFooterIcons from "./PostFooterIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

const CommentSection = ({
  visible,
  setModal,
  userId,
  isDesktop,
  comment,
  setComment,
  handleLike,
  post,
  comments,
  share,
  screenHeight,
  insets,
}) => {
  const { formatTime } = useContext(FormatTime);
  const scrollRef = useRef(null);

  const ITEM_HEIGHT =
    Platform.OS === "ios" ? screenHeight - insets.bottom : screenHeight;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} // ✅ background can be styled
      statusBarTranslucent
    >
      <SafeAreaView
        // edges={Platform.OS === "ios" ? [] : ["top", "bottom"]}
        className="justify-end bg-[rgba(0,0,0,0.5)]"
        style={{ height: ITEM_HEIGHT }}
      >
        {/* Bottom sheet container */}
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0} // adjust as needed
          className="h-[90%] bg-white rounded-t-2xl overflow-hidden"
        >
          {/* Close button */}
          {!isDesktop && (
            <Pressable
              className="w-full mb-2 items-end px-4 pt-4"
              onPress={() => setModal("")}
            >
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          )}

          {/* Comments list */}
          <ScrollView
            ref={scrollRef}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollToEnd({ animated: true });
              }
            }}
          >
            {comments?.length > 0 ? (
              comments
                ?.slice()
                .reverse()
                .map((c) => (
                  <View key={c._id} className="flex-row items-start mb-4">
                    {c.userId?.profileImage ? (
                      <Image
                        source={{
                          uri: `https://api.machinestreets.com/api/mediaDownload/${c?.userId?.profileImage}`,
                        }}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-3">
                        <Icon name="user" size={20} color="red" />
                      </View>
                    )}
                    <View className="flex-1">
                      <View className="flex-row justify-between">
                        <Text className="font-semibold text-gray-800">
                          {c.userId?.username || "Guest User"}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {formatTime(c.createdAt)}
                        </Text>
                      </View>
                      <Text className="text-gray-700">{c.comment}</Text>
                    </View>
                  </View>
                ))
            ) : (
              <Text className="text-gray-500 text-center mt-4">
                No comments yet
              </Text>
            )}
          </ScrollView>

          {isDesktop && (
            <View className="p-4">
              <PostFooterIcons
                item={post}
                userId={userId}
                isDesktop={isDesktop}
                handleLike={handleLike}
                share={share}
              />
            </View>
          )}

          {/* Footer input */}
          <View className="border-t border-gray-300 bg-white px-4 py-2 flex-row items-center">
            <TextInput
              className="flex-1 h-12 border border-gray-300 rounded-lg px-3 text-gray-800"
              placeholder="Write a comment..."
              placeholderTextColor="#9CA3AF"
              value={comment.comment}
              onChangeText={(value) =>
                setComment((prev) => ({ ...prev, comment: value }))
              }
            />
            <Pressable
              className="ml-3 p-2 rounded-full bg-gray-100"
              onPress={() => {
                if (comment.comment?.trim()) {
                  handleLike({ comment, postId: post?._id }, "api/postComment");
                  setComment((prev) => ({ ...prev, comment: "" }));
                }
              }}
            >
              <Icon name="send" size={20} color="#4B5563" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default CommentSection;
