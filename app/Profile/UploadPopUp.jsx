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
  const {isLoading} = useAppContext()
  console.log('type :', type)
  console.log('media :', media)

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true} // ✅ Must be false for fullscreen
      statusBarTranslucent={true} // ✅ Ensures fullscreen overlay
      presentationStyle="fullScreen" // ✅ iOS + Android fullscreen
    >
      <KeyboardAvoidingView
      // keyboardVerticalOffset={50}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[{ flex: 1 }, styles.overlay]}
      >
        <BlurView
          intensity={30}
          tint="dark"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <SafeAreaView
            style={{
              flex: 1,
              width: "100%",
              
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={{
                  width: isDesktop ? 500 : "90%",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 16,
                  position: "relative",
                }}
              >
                {/* Close Button */}
                <Pressable
                  style={{
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
                  }}
                  onPress={() =>{onRequestClose()}}
                >
                  <Icon name="close" size={20} color="black" />
                </Pressable>

                {/* Media Preview */}
                {media && type === "image" && (
                  <Image
                    source={{ uri: media[0]?.uri }}
                    style={{
                      width: "100%",
                      height: 240,
                      borderRadius: 12,
                      marginTop: 8,
                    }}
                    resizeMode="contain"
                  />
                )}
                {media && type === "video" && (
                  <View style={{ marginTop: 8 }}>
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
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 12,
                    padding: 12,
                    height: 100,
                    fontSize: 16,
                    marginTop: 16,
                  }}
                />

                {/* Upload Button */}
                <Pressable
                  onPress={() => handleMediaupload("posts")}
                  className="h-12 w-48 mx-auto overflow-hidden"
                  style={{
                    backgroundColor: "#16a34a",
                    padding: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  {isLoading ? <Loading/> : <Text style={{ color: "white", fontWeight: "600" }}>
                    Upload
                  </Text>}
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
    ...StyleSheet.absoluteFillObject,
  },
});

export default UploadPopUp;
