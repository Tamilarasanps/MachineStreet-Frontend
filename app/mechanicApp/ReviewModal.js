import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
  Dimensions,
  ScrollView, // Import ScrollView
} from "react-native";
import { BlurView } from "expo-blur";
import ReviewPopup from "./ReviewPopUp";
import { FormatTime } from "../context/FormatTime";
import { useContext } from "react";
import { useSocketContext } from "../context/SocketContext";

const ReviewModal = ({
  visible,
  onClose,
  reviewPopUp,
  setReviewPopup,
  handleReviewSubmit,
  setRating,
  rating,
  reviewText,
  setReviewText,
  reviews,
  setMechanics,
  selectedMech,
  setReviews,
}) => {
  const { width, height } = Dimensions.get("window"); // Get device width and height
  const { formatTime } = useContext(FormatTime); // ✅ correct way to use

  const { socket } = useSocketContext();

  useEffect(() => {
    const handleReviewsUpdate = (data) => {
      // console.log('data :', data)
      setReviews((prev) => [...prev, data.review]);
        setMechanics((prev) =>
          prev.map((mech) =>
            mech._id === selectedMech
              ? {
                  ...mech,
                  averageRating: data.mechanic.averageRating,
                  reviews: data.mechanic.reviews,
                }
              : mech
          )
        );
    };

    if (socket) {
      socket.on("review-updated", handleReviewsUpdate);
    }

    return () => {
      if (socket) {
        socket.off("review-updated", handleReviewsUpdate);
      }
    };
  }, [socket]);
  // console.log('@iiii ', (socket && selectedMech))

  useEffect(() => {
    if (socket && selectedMech) {
      // console.log('@useef')
      socket.emit("join-review-room", selectedMech);

      return () => {
        socket.emit("leave-review-room", selectedMech);
      };
    }
  }, [socket, selectedMech]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={50} tint="light" style={styles.blurContainer}>
        <View
          style={[
            styles.modalWrapper,
            {
              width: width >= 1024 ? 500 : "90%",
              height: height * 0.75,
              marginBottom: 20,
            }, // Added marginBottom for gap
          ]}
        >
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* Comments Area (scrollable) */}
          <ScrollView style={styles.reviewsContainer}>
            {reviews && reviews.length > 0 ? (
              [...reviews].reverse().map((item) => (
                <View key={item._id} className="mb-6">
                  <View style={styles.userRow}>
                    <Image
                      source={{
                        uri: `data:image/jpeg;base64,${item.user.profileImage}`,
                      }}
                      style={styles.profileImage}
                    />
                    <View className="flex flex-row items-center gap-4">
                      <Text style={styles.username}>{item.user.username}</Text>
                      <Text
                        style={{
                          // marginLeft: 50,
                          alignSelf: "center",
                          color: "#888",
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {formatTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Text
                        key={i}
                        style={
                          i < item.stars ? styles.filledStar : styles.emptyStar
                        }
                      >
                        ★
                      </Text>
                    ))}
                  </View>

                  <Text style={styles.reviewText}>{item.reviewText}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.commentsText}>No reviews yet.</Text>
            )}
          </ScrollView>

          {/* Comment Input */}
          <Pressable
            onPress={() => setReviewPopup(true)}
            style={styles.addReviewButton}
          >
            <Text className="text-center font-semibold text-md ">
              Add Review
            </Text>
          </Pressable>
        </View>
      </BlurView>
      {reviewPopUp && (
        <ReviewPopup
          onClose={() => setReviewPopup(false)}
          handleReviewSubmit={handleReviewSubmit}
          setRating={setRating}
          rating={rating}
          reviewText={reviewText}
          setReviewText={setReviewText}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align the modal to the bottom
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add overlay background
  },
  modalWrapper: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    elevation: 5, // Add shadow effect for better visibility
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
  reviewsContainer: {
    flex: 1,
    marginBottom: 12,
  },
  commentsText: {
    color: "#999",
  },
  addReviewButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  filledStar: {
    color: "#FFD700", // gold
    fontSize: 16,
  },

  emptyStar: {
    color: "#ccc",
    fontSize: 16,
  },
});

export default ReviewModal;
