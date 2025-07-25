import React, { useEffect, useRef, useContext } from "react";
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
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSocketContext } from "../context/SocketContext";
import { FormatTime } from "../context/FormatTime";

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
  const { formatTime } = useContext(FormatTime);
  const inputRef = useRef(null);

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, []);

  useEffect(() => {
    const handleCommentsUpdate = (data) => {
      setComments((prev) => [...prev, data.comment]);
    };
    if (socket) {
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
      socket.emit("join-post-room", selectedPost);
      return () => {
        socket.emit("leave-post-room", selectedPost);
      };
    }
  }, [socket?.connected, selectedPost]);

  // Helper to send comment and clear input
  const sendComment = () => {
    if (comment.trim().length === 0) return;
    handlePostComment(selectedPost, comment);
    Keyboard.dismiss();
    // inputRef.current && inputRef.current.focus();
  };

  // const addTodo = () => {
  //   if (!input.trim()) return;
  //   setTodos([
  //     ...todos,
  //     { id: Date.now().toString(), title: input.trim(), done: false },
  //   ]);
  //   setInput("");
  //   inputRef.current?.clear();
  // };
  return (
    <Modal animationType="slide" transparent={true}>
      <BlurView intensity={50} tint="light" style={styles.blurContainer}>
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > */}
        <View
          style={[
            styles.modalWrapper,
            {
              width: width >= 1024 ? 500 : "90%",
              height: height * 0.75,
              marginBottom: 10,
            },
          ]}
        >
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          <View style={{ flex: 1, marginTop: 2 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            >
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
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                          {cmt.userId.username}
                        </Text>
                        <Text
                          style={{
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
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: "#aaa",
                  }}
                >
                  No comments yet.
                </Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Add a comment"
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={sendComment}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.addButton} onPress={sendComment}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* </KeyboardAvoidingView> */}
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
    paddingTop: 40,
  },
  modalWrapper: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 0,
    elevation: 5,
    flex: 1,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#eee",
    borderTopWidth: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    height: 44,
  },
  addButtonText: { color: "#fff", fontSize: 24 },
});
