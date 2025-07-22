import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";

const OtpScreen = ({ mailOrphone, otp, setOtp, formSubmit, setStep }) => {
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

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) inputs.current[index + 1].focus();
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      let newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      inputs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    setStep(4); // Resend OTP logic
    setIsResendDisabled(true);
    setCounter(30); // reset timer
  };

  const handleKeyPress = (e) => {
    if (Platform.OS === "web" && e.key === "Enter") {
      formSubmit();
    }
  };


  // return
  return (
    <View
      className={`${
        Platform.OS === "web" ? "w-full h-[415px]" : "w-full"
      } flex flex-col gap-8 p- items-center bg-white rounded-md m-auto p-5 py-8`}
    >
      <Text className="text-2xl font-bold mx-auto text-TealGreen">
        Enter Your OTP
      </Text>

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
              handleKeyPress(e); // ✅ now e is defined
            }}
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity className="bg-TealGreen rounded-sm mt-4 w-24 py-2 mx-auto">
        <Text
          className="text-white text-center"
          onPress={() => formSubmit({ mailOrphone, otp })}
        >
          Verify OTP
        </Text>
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
