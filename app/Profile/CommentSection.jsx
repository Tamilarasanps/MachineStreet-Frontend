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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { FormatTime } from "@/context/FormatTime";
import PostFooterIcons from "./PostFooterIcons";

const CommentSection = ({
  userId,
  isDesktop,
  onclose,
  comment,
  setComment,
  handleLike,
  post,
  comments,
}) => {
  const { formatTime } = useContext(FormatTime);
  const scrollRef = useRef();

  return (
    <View className="flex-1 bg-white py-4">
      {/* Close button */}
      {!isDesktop && (
        <Pressable className="w-full mb-4 items-end px-4" onPress={onclose}>
          <Icon name="x" size={24} color="gray" />
        </Pressable>
      )}

      {/* Comments list */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current.scrollToEnd({ animated: true })
        }
      >
        {comments?.length > 0 ? (
          comments
            ?.slice()
            .reverse()
            .map((c) => (
              <View key={c._id} className="flex-row items-start mb-4">
                {c.userId?.profileImage ? (
                  <Image
                    source={{ uri: c.userId.profileImage }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-3">
                    <Icon name="user" size={20} color="gray" />
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
          />
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
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
                setComment({ comment: "" });
              }
            }}
          >
            <Icon name="send" size={20} color="#4B5563" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CommentSection;
