import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
  Image,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FileUpload } from "../context/FileUpload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import qrImage from "../../assets/images/qr.png";
// import { AuthContext } from "../context/AuthProvider";
import CryptoJS from "crypto-js";

const QrModal = ({ visible, onClose }) => {
  const { pickMedia, selectedMedia } = useContext(FileUpload);
  const { width } = useWindowDimensions();
  const modalWidth = Platform.OS === "web" && width >= 1024 ? "50%" : "90%";
  const { postJsonApi } = useApi();
  const [successMessage, setSuccessMessage] = useState("");
  // const [authUser] = useContext(AuthContext);

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
        setSuccessMessage(
          "Your QR’s in safe hands! Our tech elves are cooking it up and will deliver it to your door step ASAP."
        );
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
            <Icon name="close" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.title}>Generate Your Business Qr</Text>

          {/* Beautiful Icon */}
          <Image
            className="h-48 w-48 "
            source={qrImage}
            style={styles.qrIcon}
          />

          <Text
            style={styles.link}
            onPress={async () => {
              const secretKey = "gguguvgvuv";
              const token = await AsyncStorage.getItem("userToken");
              const encryptedToken = CryptoJS.AES.encrypt(
                token,
                secretKey
              ).toString();
              const url = `http://127.0.0.1:5500/index.html?token=${encodeURIComponent(
                encryptedToken
              )}`;
              Linking.openURL(url);
            }}
          >
            https://faceqrapp.netlify.app/
          </Text>

          {successMessage ? (
            <Text style={styles.success}>{successMessage}</Text>
          ) : null}
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
    padding: 20,
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#444",
    borderRadius: 20,
    padding: 4,
  },
  qrIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 12,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  link: {
    color: "#1e90ff",
    textDecorationLine: "underline",
    fontSize: 16,
    marginBottom: 10,
  },
  success: {
    marginTop: 15,
    color: "green",
    fontSize: 14,
    textAlign: "center",
  },
});

export default QrModal;
