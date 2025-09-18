import { BlurView } from "expo-blur";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import VideoGridItem from "./VideoGridItem";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";

const UploadPopUp = ({
  isDesktop,
  media,
  description,
  setDescription,
  handleMediaupload,
  onRequestClose,
}) => {
  const type = media?.[0]?.mimeType?.split("/")[0];
  const { isLoading } = useAppContext();

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      // presentationStyle="fullScreen"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.overlay]}
      >
        <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[styles.modalContainer, { width: isDesktop ? 500 : "90%" }]}>
                {/* Close Button */}
                <Pressable style={styles.closeButton} onPress={onRequestClose}>
                  <Icon name="close" size={20} color="black" />
                </Pressable>

                {/* Media Preview */}
                {media && type === "image" && (
                  <Image
                    source={{ uri: media[0]?.uri }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                )}
                {media && type === "video" && (
                  <View style={styles.videoPreview}>
                    <VideoGridItem source={media[0]?.uri} />
                  </View>
                )}

                {/* Description Input */}
                <TextInput
                  placeholder="Enter description"
                  placeholderTextColor="gray"
                  value={description}
                  onChangeText={setDescription}
                  maxLength={100}
                  multiline
                  style={styles.textInput}
                />

                {/* Upload Button */}
                <Pressable
                  onPress={() => handleMediaupload("posts")}
                  style={styles.uploadButton}
                >
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <Text style={styles.uploadText}>Upload</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginTop: 8,
  },
  videoPreview: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    height: 100,
    fontSize: 16,
    marginTop: 16,
  },
  uploadButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    alignSelf: "center",
    width: 192, // equivalent to w-48
    height: 48, // equivalent to h-12
  },
  uploadText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default UploadPopUp;
