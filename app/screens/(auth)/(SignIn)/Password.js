import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import Icon from "react-native-vector-icons/FontAwesome"; // Assuming you're using react-native-vector-icons
import { LoadingContext } from "@/app/context/LoadingContext";
import Loading from "@/app/component/Loading";

const Password = ({
  formSubmit,
  password,
  confirmpass,
  setPassword,
  setConfirmPass,
  buttonLabel,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

  return (
    <View
      className={`${
        Platform.OS === "web" ? "w-[100%] h-[415px]" : "w-full mx-auto"
      } p-5 py-8 `}
    >
      <Text className="text-2xl font-bold mx-auto text-TealGreen mb-10">
        Create Your Password
      </Text>

      {/* Password Input */}
      <View
        className={`bg-white h-[50] ${
          Platform.OS === "web" ? "w-[75%]" : "w-[90%]"
        } mx-auto mt-6`}
      >
        <FloatingLabelInput
          label="Password"
          value={password}
          staticLabel
          hintTextColor={"#aaa"}
          containerStyles={{
            borderWidth: 2,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            borderColor: "#2095A2",
            borderRadius: 8,
          }}
          customLabelStyles={{
            leftFocused: 10,
            colorFocused: "#5C6670",
            fontSizeFocused: 16,
          }}
          labelStyles={{
            backgroundColor: "#fff",
            paddingHorizontal: 5,
          }}
          inputStyles={{
            borderWidth: 0,
            outline: "none",
            color: "#5C6670",
            paddingHorizontal: 10,
          }}
          secureTextEntry={!isPasswordVisible}
          onChangeText={setPassword}
        />
        {/* Eye icon for password */}
        <Pressable
          onPress={() => setIsPasswordVisible((prev) => !prev)}
          style={{ position: "absolute", right: 10, top: 12 }}
        >
          <Icon
            name={isPasswordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#5C6670"
          />
        </Pressable>
      </View>

      {/* Confirm Password Input */}
      <View
        className={`bg-white h-[50] ${
          Platform.OS === "web" ? "w-[75%]" : "w-[90%]"
        } mx-auto mt-6`}
      >
        <FloatingLabelInput
          label="Confirm Password"
          value={confirmpass}
          staticLabel
          hintTextColor={"#aaa"}
          containerStyles={{
            borderWidth: 2,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            borderColor: password === confirmpass ? "#2095A2" : "red",
            borderRadius: 8,
          }}
          customLabelStyles={{
            leftFocused: 10,
            colorFocused: "#5C6670",
            fontSizeFocused: 12,
          }}
          labelStyles={{
            backgroundColor: "#fff",
            paddingHorizontal: 5,
          }}
          inputStyles={{
            outline: "none",
            color: "#5C6670",
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          secureTextEntry={!isConfirmPasswordVisible}
          onChangeText={setConfirmPass}
        />
        {/* Eye icon for confirm password */}
        <Pressable
          onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
          style={{ position: "absolute", right: 10, top: 12 }}
        >
          <Icon
            name={isConfirmPasswordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#5C6670"
          />
        </Pressable>
      </View>

      {/* Submit Button */}
      <Pressable
        disabled={password !== confirmpass}
        onPress={() => {
          startLoading();
          formSubmit({ password, confirmpass }, router.push("/"));
          stopLoading();
        }}
        className={`bg-TealGreen mb-8 py-4 px-4 h-max mt-10 w-24 mx-auto rounded-md ${
          password === confirmpass
            ? "opacity-[100%]"
            : "opacity-[50%] cursor-not-allowed"
        }`}
      >
        <Text className="text-white m-auto">{buttonLabel}</Text>
      </Pressable>
      {isLoading && <Loading />}
    </View>
  );
};

export default Password;
