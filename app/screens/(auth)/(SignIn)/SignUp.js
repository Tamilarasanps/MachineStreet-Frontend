import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView } from "react-native";
import UsernameScreen from "./UsernameScreen";
import { View, Text } from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useNavigation } from "expo-router";
import { useWindowDimensions } from "react-native";
import RoleSelection from "@/app/mechanicApp/RoleSelection";
import useApi from "@/app/hooks/useApi";
import Password from "./Password";
import OtpScreen from "./OtpScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [mailOrphone, setMailOrphone] = useState("");
  const [mobile, setMobile] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { postJsonApi } = useApi();
  const { width } = useWindowDimensions();
  const isScreenLarge = width > 768;
  const [subCategories, setSubCategories] = useState([
    { name: "", services: [""] },
  ]);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("userToken");
  };

  const navigation = useNavigation();
  useEffect(() => {
    if (subCategories.length > 0) {
      setMechanicDetails((prev) => ({
        ...prev,
        subcategory: subCategories,
      }));
    }
  }, [subCategories]);

  const [mechanicDetails, setMechanicDetails] = useState({
    organization: "",
    industry: "",
    services: [''],
    subcategory: subCategories,
    contact: {
      number: "",
      countryCode: "+91",
    },
  });

  let api_Data;

  const getSignupUrl = (step) => {
    if (step === 2) {
      return "signup/otpcheck";
    } else if (step === 3) {
      return "signup/register";
    } else if (step === 4) {
      return "signup/resendotp";
    }
    return "signup"; // Default case when no step matches
  };

  switch (true) {
    case step === 1:
      api_Data = { mailOrphone, username, role, mechanicDetails };
      break;

    case step === 2:
      api_Data = { mailOrphone, otp: otp.join("") };
      break;

    case step === 3:
      api_Data = { mailOrphone, password, confirmpass };
      break;

    case step === 4:
      api_Data = { mailOrphone };
      break;

    default:
    // console.log("Invalid step");
  }

  const formSubmit = async () => {
    // Validate form fields based on the step
    if (
      step === 1
        ? !username || !mailOrphone
        : step === 3
        ? !password || !confirmpass
        : step === 2
        ? !otp || !mailOrphone
        : ""
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill all fields",
        position: "top",
        visibilityTime: 2000,
        animation: "slide",
      });
      return;
    }

    try {
      // Dynamically generate the signup URL
      // console.log("function triggered ");
      const response = await postJsonApi(getSignupUrl(step), api_Data);

      // console.log("response :", response);

      if (response && response.status === 200) {
        // console.log("step :", step);
        if (step == 2) {
          Toast.show({
            type: "success",
            text1: "OTP verified successfully!",
            position: "top",
            visibilityTime: 2000,
            animation: "slide",
          });
        }
        if (step == 3) {
          setUsername("");
          setMailOrphone("");
          setOtp("");
          setPassword("");
          setConfirmPass("");
          // toast.show("Registration successfully!", { type: "success" }

          // console.log(Platform.OS === "web");
          if (Platform.OS === "web") {
            router.push("/screens/Login");
          } else {
            navigation.navigate("LoginPage");
          }
        }
        if (step !== (3 || 4)) {
          setStep((prevStep) => prevStep + 1);
        }
        if (step === 4) {
          setStep(2);
        }
      }
    } catch (error) {
      console.error(
        "Error during form submission:",
        error.response ? error.response.data : error.message
      );

      // Handle specific error scenarios
      if (error.response?.status === 401) {
        // toast.show("Invalid OTP. Please try again.", { type: "warning" });
      } else if (error.response?.status === 500) {
        // toast.show("Server error. Please try again later.", { type: "danger" });
      } else {
        // toast.show(
        //   error.response?.data?.message || "An unexpected error occurred.",
        //   { type: "danger" }
        // );
        // toast.show(, {
        //   placement: "top",
        //   type: "danger",
        //   duration: 3000,
        // });
      }
    }
  };

  if (step === 4) {
    formSubmit(mailOrphone);
    setStep(2);
  }
  if (step === 0) {
    // console.log("object");
    return (
      <RoleSelection
        subCategories={subCategories}
        setSubCategories={setSubCategories}
        role={role}
        setRole={setRole}
        setStep={setStep}
        setMechanicDetails={setMechanicDetails}
        mechanicDetails={mechanicDetails}
      />
    );
  }
  // console.log(mechanicDetails);

  return (
    <SafeAreaView className="mt-24  w-screen items-center justify-center ">
      <View className="z-50">
        <Toast />
      </View>
      <View
        className={` rounded-md shadow-md overflow-hidden flex bg-gray-200 ${
          Platform.OS === "web"
            ? isScreenLarge
              ? "w-[52%] flex-row h-[90%]"
              : "w-[90%] flex-col"
            : "w-[90%] flex-col"
        }`}
      >
        {/* Left Info Section */}
        {Platform.OS === "web" && width > 768 && (
          <View className="bg-teal-600 w-[40%]  p-5 rounded-tl-md rounded-bl-md text-white flex items-center">
            <View className="shadow-md p-5">
              <Text className="text-2xl font-bold mt-5 ml-3 text-white">
                Sign Up
              </Text>
              <Text className="mt-8 text-base font-medium ml-3 leading-6 text-white">
                Get access to your
                <Text className="font-semibold mt-8 text-white"> Orders, </Text>
                <Text className="font-semibold text-white">Wishlist, and </Text>
                <Text className="font-semibold text-white">
                  Recommendations.
                </Text>
              </Text>
            </View>
          </View>
        )}

        {/* Right Form Section */}
        <View
          className={`bg-white ${
            Platform.OS === "web" && isScreenLarge
              ? "w-[60%] p-6"
              : " w-[100%]p-4 w-full"
          }`}
        >
          {step === 1 && (
            <UsernameScreen
              username={username}
              setUsername={setUsername}
              mailOrphone={mailOrphone}
              setMailOrphone={setMailOrphone}
              mobile={mobile}
              setMobile={setMobile}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              formSubmit={formSubmit}
            />
          )}
          {step === 2 && (
            <OtpScreen
              otp={otp}
              setOtp={setOtp}
              formSubmit={formSubmit}
              setStep={setStep}
            />
          )}
          {step === 3 && (
            <Password
              password={password}
              confirmpass={confirmpass}
              setPassword={setPassword}
              setConfirmPass={setConfirmPass}
              formSubmit={formSubmit}
              buttonLabel="Register"
              mailOrphone={mailOrphone}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
