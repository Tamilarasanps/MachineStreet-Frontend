import React from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const AuthButtons = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  const handleNavigate = (screen) => {
    if (isWeb) {
      router.push(`/screens/${screen}`);
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={[styles.container, width < 768 && styles.containerMobile]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.loginButton,
          pressed && styles.pressed,
        ]}
        onPress={() => handleNavigate("Login")}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.signupButton,
          pressed && styles.pressed,
        ]}
        onPress={() => handleNavigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  containerMobile: {
    flexDirection: "column",
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    minWidth: 150,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  loginButton: {
    backgroundColor: "#2C7A7B",
  },
  signupButton: {
    backgroundColor: "#319795",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});

export default AuthButtons;
