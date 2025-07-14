import React, { useContext } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { TextInput } from "react-native-paper";
import Email from "./Email";
import { router } from "expo-router";
import { useNavigation } from "expo-router";
import { LoadingContext } from "@/app/context/LoadingContext";
import Loading from "@/app/component/Loading";
import Toast from "react-native-toast-message";

const UsernameScreen = ({
  username,
  setUsername,
  mailOrphone,
  setMailOrphone,
  mobile,
  setMobile,

  formSubmit,
}) => {
  const { width } = useWindowDimensions();
  const isScreen = width > 768;
  const navigation = useNavigation();
  // console.log("username :", username);
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);
  
  const handleNextPress = async () => {
    if (username.length < 3) {
      Toast.show({
        type: "info",
        text1: "Minimum 3 letters required",
        text2: "Please enter at least 3 characters",
      });
      return; // stop here if validation fails
    }

    startLoading();
    try {
      await formSubmit({ username, mailOrphone });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: "Please try again",
      });
    } finally {
      stopLoading();
    }
  };

  const handleKeyPress = (e) => {
    if (Platform.OS === "web" && e.key === "Enter") {
      handleNextPress();
    }
  };

  return (
    <View
      className={`${
        Platform.OS === "web"
          ? "w-full sm:w-full h-[505px] m"
          : "w-full mx-auto"
      } p-5 py-8 h-ful`}
    >
      <Text className="md:text-2xl text-lg font-bold mx-auto text-TealGreen mb-4">
        Create Your Account
      </Text>

      {/* Username Input */}

      <View style={{ width: "100%", marginTop: 16 }} className="mb-4">
        <TextInput
          label={"UserName"}
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          placeholderTextColor="#aaa"
          outlineColor="#2095A2"
          activeOutlineColor="#2095A2"
          style={[
            {
              backgroundColor: "white",
              alignSelf: "center",
              borderRadius: 8,
              paddingHorizontal: 4,
              // elevation: 2,
            },
            isScreen ? { width: "75%" } : { width: "100%" },
          ]}
        />
      </View>

      <Email
        mailOrphone={mailOrphone}
        setMailOrphone={setMailOrphone}
        Enterkey={handleKeyPress}
      />

      {/* Navigation and CTA */}

      <View className="mt-20  mb-4">
        <Pressable
          disabled={isLoading}
          onPress={handleNextPress}
          className={`bg-TealGreen py-4 px-4 w-[75%] mx-auto rounded-md ${
            isScreen ? "w-[75%]" : "w-full"
          } ${isLoading ? "opacity-50" : ""}`}
        >
          <Text className="text-white text-center font-semibold">Next</Text>
        </Pressable>
      </View>
      <Text className="text-center font-semibold mt-4 text-gray-600">
        Already have an account?{" "}
      </Text>
      <Pressable
        disabled={isLoading}
        onPress={() => {
          if (Platform.OS === "web") {
            router.push("/screens/Login");
          } else {
            navigation.replace("LoginPage");
          }
        }}
        className={`bg-TealGreen py-4 px-4 w-[75%] mt-4 mb-8 mx-auto rounded-md ${
          isScreen ? "w-[75%]" : "w-full"
        } ${isLoading ? "opacity-50" : ""}`}
      >
        <Text className="text-white text-center font-bold ">Log In</Text>
      </Pressable>

      {/* Loading Overlay */}
      {isLoading && <Loading />}
    </View>
  );
};

export default UsernameScreen;
