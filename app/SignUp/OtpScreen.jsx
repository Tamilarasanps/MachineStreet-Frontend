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

const OtpScreen = ({ otp, setOtp, register, handleSubmit, isLoading }) => {
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
        Platform.OS === "web" ? "w-full h-[600px]" : "w-full"
      } flex flex-col gap-8 items-center bg-white rounded-md m-auto p-5 py-8`}
    >
      <Text className="text-2xl font-bold mx-auto text-TealGreen">
        Enter Your OTP
      </Text>

      {/* OTP Boxes */}
      <View className="flex-row gap-4 mt-10 mx-auto">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            className="w-12 h-12 text-center border-2 border-gray-300 rounded-md text-xl text-black outline-TealGreen"
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
            // 👇 Auto-select text if user taps on a filled box
            onFocus={() => {
              if (otp[index]) {
                inputs.current[index].setNativeProps({
                  selection: { start: 0, end: 1 },
                });
              }
            }}
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity className="bg-TealGreen rounded-sm mt-4 w-24 py-2 mx-auto h-12 items-center justify-center">
        {isLoading ? (
          <Loading />
        ) : (
          <Text className="text-white text-center" onPress={() => register()}>
            Verify OTP
          </Text>
        )}
      </TouchableOpacity>

      {/* Resend OTP Timer */}
      <Pressable
        className="mt-4 mx-auto"
        onPress={handleResend}
        disabled={isResendDisabled}
      >
        <Text
          className={`mx-auto underline ${
            isResendDisabled ? "text-gray-400" : "text-blue-500"
          }`}
        >
          {isResendDisabled ? `Resend OTP in ${counter}s` : "Resend OTP"}
        </Text>
      </Pressable>
    </View>
  );
};

export default OtpScreen;
