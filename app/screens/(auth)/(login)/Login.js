import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  SafeAreaView,
  useWindowDimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Email from "../(SignIn)/Email";
import { useNavigation } from "@react-navigation/native";
import useApi from "@/app/hooks/useApi";
import Toast from "react-native-toast-message";
import Password from "../(SignIn)/Password";

const Login = () => {
  const [mailOrphone, setMailOrphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [forgotValue, setForgotValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [viewMode, setViewMode] = useState("main");

  const navigation = useNavigation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isScreenSmall = width < 768;
  const { postJsonApi } = useApi();

  const Loginbtn = async (e) => {
    if (!mailOrphone || !password) {
      Toast.show({
        type: "error",
        text1: "⚠️ Missing Fields",
        text2: "Please fill all the fields!",
        visibilityTime: 2000,
        position: "top",
      });

      return;
    }

    try {
      const response = await postJsonApi(`login`, {
        mailOrphone,
        password,
      });

      if (response && response.status === 200) {
        const userRole = response.data.role;
        const userId = response.data.userId;

        const userToken = response.data.token;

        await Promise.all([
          AsyncStorage.setItem("userToken", userToken),
          AsyncStorage.setItem("role", userRole),
          AsyncStorage.setItem("userId", userId),
        ]);

        if (userRole === "admin") {
          router.replace("/AdminFolder/HomePageAdmin");
        } else {
          if (Platform.OS === "web") {
            router.replace("/mechanicApp/MechanicList_2");
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "MechanicProfiles" }],
            });
          }
        }

        setMailOrphone("");
        setPassword("");
      }
    } catch (error) {
      console.error("Invalid Data:", error);
    }
  };
  const handleForgotSubmit = async () => {
    if (!forgotValue.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Input",
        text2: "Please enter email or mobile number",
      });
      return;
    }

    if (showOTPInput && forgotValue !== submittedValue) {
      setShowOTPInput(false);
      setOtp("");
      Toast.show({
        type: "info",
        text1: "Input Changed",
        text2: "Please submit again to get new OTP",
      });
      return;
    }

    try {
      if (!showOTPInput) {
        const result = await postJsonApi("signup/forgotPassword", {
          mailOrphone: forgotValue,
        });

        if (result.status === 200) {
          setSubmittedValue(forgotValue);
          setShowOTPInput(true);
          Toast.show({
            type: "success",
            text1: "OTP Sent",
            text2: "Please check your email or phone",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to send OTP",
            text2: result?.data?.message || "Try again later",
          });
        }
      } else {
        if (!otp || otp.length < 4) {
          Toast.show({
            type: "error",
            text1: "Invalid OTP",
            text2: "Please enter a valid OTP",
          });
          return;
        }

        const result = await postJsonApi("signup/otpcheck", {
          mailOrphone: forgotValue,
          otp,
        });

        if (result.status === 200) {
          setViewMode("reset");
          Toast.show({
            type: "success",
            text1: "OTP Verified",
            text2: "You can now reset your password",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "OTP Error",
            text2: result?.data?.message || "Verification failed",
          });
        }
      }
    } catch (err) {
      console.error("Forgot password error:", err);
    }
  };

  const passwordReset = useCallback(async () => {
    if (password !== confirmpass) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await postJsonApi("signup/resetPassword", {
        mailOrphone: forgotValue,
        password,
      });

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Password Reset Successful",
          text2: "You can now log in",
        });
        setShowForgotPopup(false);
        setForgotValue("");
        setOtp("");
        setPassword("");
        setConfirmPass("");
        setShowOTPInput(false);
        setViewMode("main");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: error.message || "Try again later",
      });
    }
  }, [password, confirmpass, forgotValue]);

  return (
    <SafeAreaView className="bg-white">
      {/* Main Login UI */}
      <View className="h-screen w-screen align-items-center bg-gray-200">
        <View
          className={`bg-white mt-28 ${
            Platform.OS === "web"
              ? "flex flex-row"
              : "w-[90%] flex flex-col gap-6"
          } mx-auto shadow-[5] rounded-md `}
          style={[isScreenSmall ? { width: "90%", height: "500px" } : {}]}
        >
          {Platform.OS === "web" && !isScreenSmall && (
            <View className="bg-teal-600 w-[40%] h-[550px] p-5 rounded-tl-md rounded-bl-md text-white">
              <View className="shadow-md p-5">
                <Text className="text-2xl font-bold mt-5 ml-3 text-white">
                  Log In
                </Text>
                <Text className="mt-8 text-base font-medium ml-3 leading-6 text-white">
                  Get access to your{" "}
                  <Text className="font-semibold">
                    Orders, Wishlist, and Recommendations.
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {/* Login Form */}
          <View
            className={`${
              Platform.OS === "web" ? "w-[60%] h-[450px]" : "w-full mx-auto"
            } p-5 py-8`}
            style={[isScreenSmall ? { width: "100%" } : {}]}
          >
            <Text
              className={`font-bold mx-auto text-TealGreen mb-6 ${
                isScreenSmall ? "text-xl" : "text-2xl"
              }`}
            >
              Log In to your account
            </Text>

            <Email mailOrphone={mailOrphone} setMailOrphone={setMailOrphone} />

            {/* Password Input */}
            <View
              className={`h-[50] ${
                Platform.OS === "web" ? "w-[75%]" : "w-[90%]"
              } mx-auto mt-8`}
              style={[isScreenSmall ? { width: "100%" } : {}]}
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

            {/* Forgot Password */}
            <View
              className={`${
                Platform.OS === "web" ? "w-[75%]" : "w-[90%]"
              } mx-auto mt-8 flex justify-center items-end`}
              style={[Platform.OS !== "web" ? { width: "100%" } : {}]}
            >
              <Pressable onPress={() => setShowForgotPopup(true)}>
                <Text className="text-blue-600 font-medium underline">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={Loginbtn}
              className={`bg-TealGreen mb-4 py-4 px-4 mx-auto rounded-md ${
                isScreenSmall ? "w-[90%]" : "w-[75%]"
              } mt-8`}
            >
              <Text className="text-white m-auto font-bold">Log In</Text>
            </Pressable>

            <Text className="font-semibold text-center mt-2 mb-2">
              New to Machine Streets?
            </Text>
            <Pressable
              onPress={() => {
                if (Platform.OS === "web") {
                  router.push("/screens/SignUp");
                } else {
                  navigation.replace("SignUp");
                }
              }}
              className={`bg-TealGreen mb-4 py-4 px-4 mx-auto rounded-md ${
                isScreenSmall ? "w-[90%]" : "w-[75%]"
              } mt-2`}
            >
              <Text className="text-white m-auto font-bold">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Forgot Password Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showForgotPopup}
        onRequestClose={() => {
          setShowForgotPopup(false);
          setForgotValue("");
          setOtp("");
          setShowOTPInput(false);
          setViewMode("main");
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          enabled
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-4">
            {viewMode !== "reset" && (
              <View className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200">
                <Text className="text-2xl font-bold mb-2 text-center text-TealGreen">
                  🔒 Forgot Password
                </Text>

                <Text className="text-sm text-gray-600 mb-6 text-center">
                  Please enter your registered email or mobile number
                </Text>

                <TextInput
                  value={forgotValue}
                  onChangeText={setForgotValue}
                  placeholder="Email or Mobile Number"
                  placeholderTextColor="#999"
                  className="border border-TealGreen rounded-xl px-4 py-3 mb-4 text-gray-800 bg-gray-50 outline-none"
                />

                {showOTPInput && (
                  <TextInput
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter OTP"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    className="border border-TealGreen rounded-xl px-4 py-3 mb-4 text-gray-800 bg-gray-50 outline-none"
                  />
                )}

                <View className="flex-row justify-between mt-2">
                  <Pressable
                    onPress={() => {
                      setShowForgotPopup(false);
                      setForgotValue("");
                      setShowOTPInput(false);
                      setOtp("");
                      setViewMode("main");
                    }}
                    className="bg-gray-300 px-5 py-3 rounded-xl flex-1 mr-2"
                  >
                    <Text className="text-gray-800 font-semibold text-center">
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleForgotSubmit}
                    className="bg-TealGreen px-5 py-3 rounded-xl flex-1 ml-2"
                  >
                    <Text className="text-white font-semibold text-center">
                      Submit
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {viewMode === "reset" && (
              <View className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200 relative">
                <Pressable
                  onPress={() => setViewMode("main")}
                  className="absolute top-2 right-2 bg-red-500 h-10 w-10 rounded-full items-center justify-center"
                >
                  <Text className="text-white font-bold text-lg">✕</Text>
                </Pressable>

                <Password
                  password={password}
                  confirmpass={confirmpass}
                  setPassword={setPassword}
                  setConfirmPass={setConfirmPass}
                  formSubmit={passwordReset}
                  buttonLabel="Reset Password"
                  headerLabel="Reset Your Password"
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;
