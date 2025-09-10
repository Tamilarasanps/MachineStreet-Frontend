import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import Loading from "@/components/Loading";
import Ionicons from "@expo/vector-icons/Ionicons";

const OtpScreen = ({ otp, setOtp, register, handleSubmit, isLoading, setStep }) => {
  const inputs = useRef([]);
  const [counter, setCounter] = useState(60); // countdown state
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Countdown effect
  useEffect(() => {
    let timer;
    if (isResendDisabled && counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else if (counter === 0) {
      setIsResendDisabled(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [counter, isResendDisabled]);

  // 👇 Auto-focus first input when screen loads
  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    let newOtp = [...otp];

    if (otp[index]) {
      // Case 1: Current box has a value → just clear it
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (!otp[index] && index > 0) {
      // Case 2: Current box empty → move focus back
      inputs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    setIsResendDisabled(true);
    setCounter(60); // reset timer
    handleSubmit();
  };

  const handleKeyPress = (e) => {
    if (Platform.OS === "web" && e.key === "Enter") {
      register(); // fixed: was formSubmit()
    }
  };

  return (
    <View
      className={`${
        Platform.OS === "web" ? "w-[400px] h-[550px]" : "w-full"
      } flex flex-col items-center bg-white rounded-2xl shadow-lg p-6`}
    >
      {/* Header Back Button */}
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

      {/* OTP Input Boxes */}
      <View className="flex-row justify-center gap-3 mb-8">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            className="w-12 h-14 text-center border border-gray-300 rounded-lg text-xl font-semibold text-black focus:border-TealGreen"
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => {
              if (e.nativeEvent.key === "Backspace") {
                handleBackspace("", index);
              }
              handleKeyPress(e);
            }}
            onFocus={() => {
              if (otp[index]) {
                if (Platform.OS === "web") {
                  inputs.current[index]?.setSelectionRange(0, 1);
                } else {
                  inputs.current[index]?.setNativeProps({
                    selection: { start: 0, end: 1 },
                  });
                }
              }
            }}
          />
        ))}
      </View>

      {/* Verify Button */}
      <Pressable
        className={`bg-TealGreen w-full justify-center ${isLoading ? "h-12 overflow-hidden" : 'py-3'} rounded-lg shadow-md`}
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

      {/* Resend OTP */}
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
