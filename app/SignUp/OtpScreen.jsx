import React, { useRef, useState, useEffect } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import Loading from "@/components/Loading";
import Ionicons from "@expo/vector-icons/Ionicons";
import { OtpInput } from "react-native-otp-entry";

const OtpScreen = ({
  otp,
  setOtp,
  register,
  handleSubmit,
  isLoading,
  setStep,
  isDesktop,
}) => {
  const otpRef = useRef(null);
  const [counter, setCounter] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Convert array OTP to string for OtpInput
  const otpString = otp.join("");

  // Countdown timer
  useEffect(() => {
    let timer;
    if (isResendDisabled && counter > 0) {
      timer = setInterval(() => setCounter((prev) => prev - 1), 1000);
    } else if (counter === 0) {
      setIsResendDisabled(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [counter, isResendDisabled]);

  const handleResend = () => {
    setIsResendDisabled(true);
    setCounter(60);
    handleSubmit();
  };

  return (
    <View
      className={`${
        Platform.OS === "web"
          ? isDesktop
            ? "w-[400px] h-[550px]"
            : "w-full"
          : "w-full"
      } flex flex-col items-center bg-white rounded-2xl shadow-lg p-6`}
    >
      {/* Header */}
      <View className="flex-row items-center self-start mb-6">
        <Pressable
          onPress={() => setStep(0)}
          className="p-2 rounded-full bg-gray-100"
          android_ripple={{ color: "#ddd", borderless: true }}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#0f766e" />
        </Pressable>
        <Text className="ml-3 text-base font-medium text-gray-600">
          Return to main menu
        </Text>
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-TealGreen mb-2">Enter OTP</Text>
      <Text className="text-sm text-gray-500 mb-8 text-center px-4">
        We’ve sent a verification code to your registered number.
      </Text>

      {/* OTP Input */}
      <OtpInput
        ref={otpRef}
        numberOfDigits={otp.length}
        autoFocus={true}
        blurOnFilled={false}
        hideStick={false}
        focusColor="#2095A2"
        type="numeric"
        value={otpString} // Use string value
        onTextChange={(text) => {
          // Update otp array from string
          const arr = text.split("").slice(0, otp.length);
          while (arr.length < otp.length) arr.push("");
          setOtp(arr);
        }}
        onFilled={(text) => console.log("Filled OTP:", text)}
        textInputProps={{
          textAlign: "center",
          className: "w-14 h-14 border rounded-lg text-xl font-bold",
        }}
        theme={{
          pinCodeContainerStyle: {
            marginHorizontal: 5,
            borderWidth: 1,
            borderColor: "#ccc",
          },
          focusedPinCodeContainerStyle: {
            borderColor: "#2095A2",
            borderWidth: 2,
          },
        }}
      />

      {/* Verify Button */}
      <Pressable
        className={`bg-TealGreen w-full justify-center mt-8 ${
          isLoading ? "h-12 overflow-hidden" : "py-3"
        } rounded-lg shadow-md`}
        onPress={register}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">
            Verify OTP
          </Text>
        )}
      </Pressable>

      {/* Resend */}
      <Pressable
        className="mt-6"
        onPress={handleResend}
        disabled={isResendDisabled}
      >
        <Text
          className={`text-sm font-medium underline ${
            isResendDisabled ? "text-gray-400" : "text-blue-500"
          }`}
        >
          {isResendDisabled ? `Resend in ${counter}s` : "Resend OTP"}
        </Text>
      </Pressable>
    </View>
  );
};

export default OtpScreen;
