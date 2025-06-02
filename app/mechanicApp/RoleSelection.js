import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import UserDetails from "./EditProfile"; // 👈 Add import
// import useGeoLocation from "@/app/hooks/GeoLocation";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function RoleSelection({
  role,
  subCategories,
  setSubCategories,
  setRole,
  setStep,
  setMechanicDetails,
  mechanicDetails,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const roles = [
    {
      id: "mechanic",
      title: "Mechanic",
      description:
        "Get hired to fix, build, and keep the world running smoothly.",
      icon: "tools",
    },
    {
      id: "recruiter",
      title: "Recruiter",
      description:
        "Find top talent and connect skilled mechanics with the right jobs.",
      icon: "account-tie",
    },
  ];

  const handleRoleSelect = (roleId) => {
    setRole(roleId);
    if (roleId === "mechanic") {
      setModalVisible(true);
    } else {
      handleCreateAccount();
    }
  };

  const handleCreateAccount = () => {
    setStep(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What best describes you?</Text>

      <View style={styles.rolesContainer}>
        {roles.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.roleCard, role === item.id && styles.selectedCard]}
            onPress={() => handleRoleSelect(item.id)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={40}
              color={role === item.id ? "#fff" : "#4B5563"}
              style={styles.icon}
            />
            <Text
              style={[
                styles.roleTitle,
                role === item.id && styles.selectedText,
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.description,
                role === item.id && styles.selectedText,
              ]}
            >
              {item.description}
            </Text>
            {role === item.id && <View style={styles.selectionIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for Mechanic */}
      <UserDetails
        setStep={setStep}
        subCategories={subCategories}
        setSubCategories={setSubCategories}
        mechanicDetails={mechanicDetails}
        setMechanicDetails={setMechanicDetails}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: screenWidth > 768 ? 28 : 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  rolesContainer: {
    flexDirection: screenWidth > 768 ? "row" : "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 30,
  },
  roleCard: {
    width: screenWidth > 768 ? "40%" : "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    alignItems: "center",
    position: "relative",
  },
  selectedCard: {
    backgroundColor: "#2095A2",
    borderColor: "#fff",
  },
  icon: {
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1F2937",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
  },
  selectedText: {
    color: "#fff",
  },
  selectionIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  createButton: {
    backgroundColor: "#2095A2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: screenWidth > 768 ? 300 : "100%",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: screenWidth > 768 ? 500 : "90%",
    maxHeight: screenHeight * 0.8,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 10, // ✅ Padding added here
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButtonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  modalButtonSave: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2095A2",
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
});

export default RoleSelection;
