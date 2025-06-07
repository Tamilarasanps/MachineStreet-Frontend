import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSocketContext } from "../context/SocketContext";
import { FormatTime } from "../context/FormatTime";
import { useContext } from "react";

export default function CommentModal({
  onClose,
  comment,
  setComment,
  comments,
  setComments,
  handlePostComment,
  selectedPost,
}) {
  const { width, height } = Dimensions.get("window");
  const { socket } = useSocketContext();
  const { formatTime } = useContext(FormatTime); // ✅ correct way to use
  console.log("comment :", comment);

  useEffect(() => {
    const handleCommentsUpdate = (data) => {
      // console.log('@data :', data)
      setComments((prev) => [...prev, data.comment]);
    };

    if (socket) {
      // console.log('@socke ')
      socket.on("comments-updated", handleCommentsUpdate);
    }

    return () => {
      if (socket) {
        socket.off("comments-updated", handleCommentsUpdate);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket && socket.connected && selectedPost) {
      // console.log('@triggered :', selectedPost)
      socket.emit("join-post-room", selectedPost);
      return () => {
        socket.emit("leave-post-room", selectedPost);
      };
    }
  }, [socket?.connected, selectedPost]);

  // useEffect(()=>{
  //   if(postId) fectchComments(postId)
  // },[postId])

  return (
    <Modal animationType="slide" transparent={true}>
      <BlurView intensity={50} tint="light" style={styles.blurContainer}>
        <View
          style={[
            styles.modalWrapper,
            {
              width: width >= 1024 ? 500 : "90%",
              height: height * 0.75,
              marginBottom: 20,
            },
          ]}
        >
          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <View style={{ flex: 1, marginTop: 16 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {comments && comments.length > 0 ? (
                [...comments].reverse().map((cmt, index) => (
                  <View key={index} style={{ marginBottom: 16 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          overflow: "hidden",
                          marginRight: 10,
                          backgroundColor: "#eee",
                        }}
                      >
                        <Image
                          source={{
                            uri: `data:image/jpeg;base64,${cmt.userId.profileImage}`,
                          }}
                          style={{ width: 40, height: 40 }}
                          resizeMode="cover"
                        />
                      </View>
                      <View className="flex flex-row items-center gap-4">
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                          {cmt.userId.username}
                        </Text>
                        <Text
                          style={{
                            // marginLeft: 50,
                            color: "#888",
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {formatTime(cmt.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ marginTop: 4, marginLeft: 50 }}>
                      {cmt.comment}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={{ textAlign: "center", marginTop: 20, color: "#aaa" }}
                >
                  No comments yet.
                </Text>
              )}
            </ScrollView>
          </View>

          {/* Comment Input */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Write a comment..."
              placeholderTextColor="#888"
              value={comment}
              onChangeText={(text) => setComment(text)}
              style={{
                flex: 1,
                height: 45,
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                paddingHorizontal: 12,
                textAlignVertical: "center", // Vertically centers placeholder
              }}
            />

            <TouchableOpacity
              onPress={() => handlePostComment(selectedPost, comment)}
              style={styles.sendButton}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalWrapper: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#000",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});
