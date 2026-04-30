import React, { useMemo, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import CryptoJS from "react-native-crypto-js";

export default function FollowersFloatingCard({
  visible,
  onClose,
  followingList, // should be null initially from parent
  fetchFollwers,
  setSelectedMechanic,
  followRequest,
}) {
  const { width, height } = useWindowDimensions();
  const isDesktop = width > 768;

  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  // ❌ removed default [] → important for UX
  const followers = useMemo(() => followingList, [followingList]);

  useEffect(() => {
    if (visible && !hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);

      fetchFollwers()
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [visible]);

  if (!visible) return null;

  const handleSelect = (mechanic) => {
    onClose(); // ✅ fixed typo
    setSelectedMechanic(mechanic._id);

    const encrypted = CryptoJS.AES.encrypt(
      "user_visit",
      "f9b7nvctr72942chh39h9rc"
    ).toString();

    router.push({
      pathname: "/E2",
      params: {
        id: mechanic._id,
        type: encrypted,
      },
    });
  };

  const renderItem = ({ item }) => {
    const imageUrl = item?.profileImage
      ? `https://api.machinestreets.com/api/mediaDownload/${item.profileImage}`
      : "https://i.pravatar.cc/150?img=12";

    return (
      <Pressable style={styles.userRow} onPress={() => handleSelect(item)}>
        <Image source={{ uri: imageUrl }} style={styles.avatar} />

        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>

        <Pressable
          onPress={() => followRequest(item._id)}
          style={styles.followBtn}
        >
          <Text style={styles.followText}>
            {item.follow ? "Following" : "Follow"}
          </Text>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View
        style={[
          styles.card,
          isDesktop
            ? { width: 420, maxHeight: height * 0.8 }
            : { width: "92%", maxHeight: height * 0.75 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Following</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={followers || []}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => {
            // 🔄 Not loaded OR loading
            if (loading || followers === null || followers === undefined) {
              return (
                <Text style={styles.centerText}>Loading...</Text>
              );
            }

            // 📭 Loaded but empty
            return (
              <Text style={styles.centerText}>
                No following yet
              </Text>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  header: {
    height: 56,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  close: {
    fontSize: 18,
    color: "#888",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  centerText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  username: {
    fontSize: 13,
    color: "#8e8e8e",
    marginTop: 2,
  },
  followBtn: {
    borderWidth: 1,
    borderColor: "#dbdbdb",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  followText: {
    fontSize: 13,
    fontWeight: "600",
  },
});