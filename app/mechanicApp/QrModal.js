import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FileUpload } from "../context/FileUpload";
import QrWeb from "./QrWeb";
import { useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";


const QrModal = ({ visible, onClose }) => {
  const { pickMedia, selectedMedia } = useContext(FileUpload);
  const { width } = useWindowDimensions();
  const modalWidth = Platform.OS === "web" && width >= 1024 ? "50%" : "90%";
  const { postJsonApi } = useApi();
  const [successMessage, setSuccessMessage] = useState("");

  const [address, setAddress] = useState({
    name: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const handleChange = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async () => {
    await pickMedia("image", "profile");
  };

  const handleSave = async () => {
    try {
      Object.keys(address).forEach((key) => {
        if (!address[key]) {
          throw new Error(`Invalid address: ${key} is null or empty`);
        }
      });

      const token = await AsyncStorage.getItem("userToken");
      const formData = new FormData();

      const qrConfig = {
        text: "www.google.com",
        backgroundImageAlpha: 1,
        dotScale: 0.3,
        colorLight: "#FFFFFF",
        correctLevel: "H",
        autoColor: true,
        autoColorDark: "rgba(0, 0, 0, .6)",
        autoColorLight: "rgba(255, 255, 255, .7)",
      };

      formData.append("qrConfig", JSON.stringify(qrConfig));
      formData.append("address", JSON.stringify(address));

      selectedMedia.forEach((image) => {
        formData.append("images", image.file);
      });

      const response = await postJsonApi("QrGenerator", formData, token);

      if (response.status === 200) {
        setSuccessMessage("“Your QR’s in safe hands! Our tech elves are cooking it up and will deliver it to your door step ASAP.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: modalWidth }]}>
          <Pressable style={styles.closeIcon} onPress={onClose}>
            <Icon name="close" size={24} color="#555" />
          </Pressable>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {!successMessage ? (
              <>
                {/* Upload Section */}
                <Pressable style={styles.uploadBox} onPress={handleUpload}>
                  <Icon name="cloud-upload" size={50} color="#4a90e2" />
                  <Text style={styles.uploadText}>
                    Tap to upload your image for QR display
                  </Text>
                </Pressable>

                {/* QR Display */}
                {selectedMedia && Platform.OS === "web" && (
                  <View style={styles.qrContainer}>
                    <QrWeb base64={selectedMedia} />
                  </View>
                )}

                {/* Address Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Delivery Address</Text>
                  {[
                    "name",
                    "street",
                    "landmark",
                    "city",
                    "state",
                    "postalCode",
                    "phone",
                  ].map((field) => (
                    <TextInput
                      key={field}
                      style={styles.input}
                      placeholder={`Enter ${field}`}
                      value={address[field]}
                      onChangeText={(text) => handleChange(field, text)}
                      placeholderTextColor="#999"
                    />
                  ))}
                  <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save & Upload</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Text style={styles.successMessage}>{successMessage}</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    maxHeight: "90%",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 30,
  },
  uploadBox: {
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#4a90e2",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "#eaf4ff",
    width: "100%",
  },
  uploadText: {
    marginTop: 12,
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  qrContainer: {
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: "#fdfdfd",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  successMessage: {
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    paddingVertical: 40,
  },
});

export default QrModal;
