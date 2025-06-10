import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AdminHomePage from "./AdminHomePage";
import CategoryManager from "./CategoryManager";
import BannerUpload from "./BannerUpload";

export default function HomePageAdmin() {
  const { width } = useWindowDimensions();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState("AdminHomePage");
  const menuAnim = useRef(new Animated.Value(-width * 0.6)).current;

  useEffect(() => {
    menuAnim.setValue(-width * 0.6);
    setIsMenuVisible(false);
  }, [width]);

  const toggleMenu = () => {
    if (!isMenuVisible) {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
      setIsMenuVisible(true);
    } else {
      Animated.timing(menuAnim, {
        toValue: -width * 0.6,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }).start(() => setIsMenuVisible(false));
    }
  };

  function renderSelectedPage() {
    switch (selectedPage) {
      case "AdminHomePage":
        return <AdminHomePage />;
      case "CategoryManager":
        return <CategoryManager />;
      case "BannerUpload":
        return <BannerUpload />;
      default:
        return <AdminHomePage />;
    }
  }

  const MenuItem = ({ label, pageKey }) => (
    <Pressable
      onPress={() => {
        setSelectedPage(pageKey);
        toggleMenu(); // Use animated toggle
      }}
      style={{
        marginTop: 16,
        backgroundColor: selectedPage === pageKey ? "#ef4444" : "#fff",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: selectedPage === pageKey ? 2 : 1,
        borderColor: selectedPage === pageKey ? "#b91c1c" : "#e5e7eb",
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: selectedPage === pageKey ? "#fff" : "#1f2937",
          textAlign: "center",
          letterSpacing: 0.5,
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      {/* Mobile Menu Overlay with Animation */}
      {width < 1024 && isMenuVisible && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "60%",
            // backgroundColor: "#2095A2",
            zIndex: 20,
            padding: 18,
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            borderRightWidth: 2,
            borderRightColor: "#fecaca",
            transform: [{ translateX: menuAnim }],
          }}
          className='bg-gray-200'
        >
          <Pressable
            onPress={toggleMenu}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <Ionicons name="close" size={30} color="black" />
          </Pressable>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 40,
              letterSpacing: 1.2,
            }}
            className="bg-gray-800"
          >
            MachineStreet
          </Text>
          <View style={{ marginTop: 32 }}>
            <MenuItem label="AdminPage" pageKey="AdminHomePage" />
            <MenuItem label="CategoryManager" pageKey="CategoryManager" />
            <MenuItem label="Banner Upload" pageKey="BannerUpload" />
          </View>
        </Animated.View>
      )}

      {/* Desktop Menu (unchanged, no animation needed) */}
      {width >= 1024 && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "20%",
            // backgroundColor: "#2095A2",
            zIndex: 10,
            padding: 24,
            // borderTopRightRadius: 24,
            // borderBottomRightRadius: 24,
            // borderRightWidth: 2,
            // borderRightColor: "#fecaca",
          }}
          className="bg-gray-300"
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              letterSpacing: 1.5,
              marginBottom: 32,
            }}
            className="bg-gray-500 p-2 rounded-md "
        >
            MachineStreet
          </Text>
          <View style={{ marginTop: 16 }}>
            <MenuItem label="AdminPage" pageKey="AdminHomePage" />
            <MenuItem label="CategoryManager" pageKey="CategoryManager" />
            <MenuItem label="Banner Upload" pageKey="BannerUpload" />
          </View>
        </View>
      )}

      {/* Right Side Content with ScrollView */}
      <View
        style={{
          backgroundColor: "#f7fafc",
          minHeight: "100%",
          flex: 1,
          marginLeft: width >= 1024 ? "20%" : 0,
          width: width >= 1024 ? "80%" : "100%",
          paddingBottom: 30,
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 120, paddingHorizontal: 16 }}>
            {renderSelectedPage()}
          </View>
        </ScrollView>

        {/* Menu Toggle Button for Mobile */}
        {width < 1024 && (
          <Pressable
            onPress={toggleMenu}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 30,
              backgroundColor: "#fff",
              // borderRadius: 20,
              padding: 6,
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}
          >
            <Ionicons name="menu" size={30} color="black" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
