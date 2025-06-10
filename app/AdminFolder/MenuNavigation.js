import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { router } from "expo-router";
import AdminHomePage from "./AdminHomePage";
import HomePageAdmin from "./HomePageAdmin";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MENU_WIDTH = 250;

const ADMIN_LINKS = [
  { label: "Admin Page", route: "/AdminFolder/AdminHomePage" },
  { label: "Category Page", route: "/AdminFolder/CategoryManager" },
  { label: "Banner Page", route: "/AdminFolder/BannerUpload" },
];

export default function MenuNavigation() {
  const [sideMenu, setSideMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [activeAdminIndex, setActiveAdminIndex] = useState(null);

  // Open menu
  const openMenu = () => {
    setSideMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Close menu
  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -MENU_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setSideMenu(false));
  };

  return (
    <View style={styles.container}>
      {/* Header with Hamburger Icon */}
      <View style={styles.header}>
        <Pressable
          onPress={openMenu}
          accessibilityLabel="Open side menu"
          accessible
        >
          <Ionicons name="menu" size={40} color="black" />
        </Pressable>
      </View>

      {/* Side Menu Overlay */}
      {sideMenu && (
        <Pressable style={styles.overlay} onPress={closeMenu}>
          {/* Animated Side Menu */}
          <Animated.View
            style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
          >
            <View style={styles.menuItemContainer} className="z-50">
              <Text style={styles.menuTitle}>Machine Street</Text>
              {/* Admin Links with hover/press background */}
              <View style={styles.adminLinks}>
                {ADMIN_LINKS.map((item, idx) => (
                  <Pressable
                    key={item.label}
                    onPress={() => {
                      router.push(item.route);
                      closeMenu();
                    }}
                    onPressIn={() => setActiveAdminIndex(idx)}
                    onPressOut={() => setActiveAdminIndex(null)}
                    {...(Platform.OS === "web"
                      ? {
                          onHoverIn: () => setActiveAdminIndex(idx),
                          onHoverOut: () => setActiveAdminIndex(null),
                        }
                      : {})}
                    style={[
                      styles.adminLink,
                      activeAdminIndex === idx && styles.adminLinkActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.adminLinkText,
                        activeAdminIndex === idx && styles.adminLinkTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Animated.View>
        </Pressable>
      )}
      <AdminHomePage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "#ef4444",
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
  },
  menu: {
    width: MENU_WIDTH,
    backgroundColor: "orange",
    paddingVertical: 24,
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "flex-start",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 8,
    zIndex: 10,
  },
  menuItemContainer: {
    marginTop: 0,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#222",
  },
  adminLinks: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#facc15",
    paddingTop: 16,
  },
  adminLink: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fef9c3", // light yellow
    transitionProperty: "background-color", // for web smoothness
    transitionDuration: "150ms",
  },
  adminLinkActive: {
    backgroundColor: "#fde68a", // darker yellow on hover/press
  },
  adminLinkText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
  adminLinkTextActive: {
    color: "#b45309", // even darker yellow/brown for text
  },
});
