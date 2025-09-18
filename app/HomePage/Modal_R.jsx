import {
  Modal,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import ReviewModal from "./ReviewModal";
import Rating from "./Rating";
import { SafeAreaView } from "react-native-safe-area-context";

const Modal_R = ({
  isDesktop,
  isTablet,
  height,
  setReviewModal,
  selectedMechanic,
  width,
  reviewModal,
  review,
  setReview,
  postReview,
}) => {
  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => setReviewModal("")}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            height: "90%",
            width: isTablet ? 500 : "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 40,
            paddingHorizontal: 16,
            paddingBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
            alignSelf: "center",
          }}
        >
          {reviewModal === "read" && selectedMechanic && (
            <Fontisto
              name="close"
              size={24}
              color="red"
              onPress={() => setReviewModal("")}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
              }}
            />
          )}

          <TouchableWithoutFeedback
            onPress={() => {
              if (Platform.OS !== "web" && !isDesktop) Keyboard.dismiss();
            }}
            accessible={false}
            touchSoundDisabled={true}
          >
            <View style={{ flex: 1 }}>
              {reviewModal === "read" ? (
                selectedMechanic && (
                  <ReviewModal
                    setReviewModal={setReviewModal}
                    selectedMechanic={selectedMechanic}
                    height={height}
                    width={width}
                  />
                )
              ) : (
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    review={review}
                    setReview={setReview}
                    setReviewModal={setReviewModal}
                    postReview={postReview}
                  />
                </KeyboardAvoidingView>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default Modal_R;
