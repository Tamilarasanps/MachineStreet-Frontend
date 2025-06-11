import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { allCountries } from "country-telephone-data";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Mobile from "../(SignIn)/Mobile";
import Email from "../(SignIn)/Email";
import { useNavigation } from "@react-navigation/native";
import useApi from "@/app/hooks/useApi";
import { Toast, useToast } from "react-native-toast-notifications";

const Login = () => {
  const [mailOrphone, setMailOrphone] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedCode, setSelectedCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigation = useNavigation();
  const { postJsonApi } = useApi();
  const router = useRouter();
  const toast = useToast();

  const { width } = useWindowDimensions();
  const isScreenSmall = width < 768; // Adjust this value as needed for small screens

  // Cleaning country name
  const cleanCountryName = (name) => name.replace(/\s*\(.*?\)/g, "").trim();

  // Filtering countries list
  const filteredCountries = allCountries
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((c) => ({
      name: cleanCountryName(c.name),
      dialCode: c.dialCode,
      iso2: c.iso2,
    }));

  const Login = async (e) => {
    if (!mailOrphone || !password) {
      toast.show("Please fill all fields", {
        type: "danger", // or "error" if you've custom defined it
        placement: "top",
        duration: 3000, // optional, default is 4000ms
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
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("role", userRole);

        if (Platform.OS === "web") {
          if (userRole === "admin") {
            router.push("/AdminFolder/HomePageAdmin");
          } else {
            router.push("/mechanicApp/MechanicList_2");
          }
        } else {
          if (userRole === "admin") {
            router.push("/AdminFolder/HomePageAdmin");
          } else {
            navigation.navigate("MechanicProfiles");
          }
        }

        setMailOrphone("");
        setPassword("");
      }
    } catch (error) {
      console.error("Invalid Data:", error);
    }
  };

  const handleKeyPress = (e, nextref) => {
    if (Platform.OS === "web" && e.nativeEvent.key === "Enter") {
      Login();
      // nextref?.current?.focus();
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="h-screen w-screen  align-items-center bg-gray-200 ">
        <View
          className={`bg-white mt-28 ${
            Platform.OS === "web"
              ? " flex flex-row"
              : "w-[90%] flex flex-col gap-6"
          } mx-auto shadow-[5] rounded-md`}
          style={[isScreenSmall ? { width: "90%" } : {}]}
        >
          {/* Web-specific Welcome Card */}
          {Platform.OS === "web" && !isScreenSmall && (
            <View className="bg-teal-600 w-[40%] h-[450px] p-5 rounded-tl-md rounded-bl-md text-white">
              <View className="shadow-md p-5">
                <Text className="text-2xl font-bold mt-5 ml-3 text-white">
                  Log In
                </Text>
                <Text className="mt-8 text-base font-medium ml-3 leading-6 text-white">
                  Get access to your
                  <Text className="font-semibold mt-8 text-white">
                    {" "}
                    Orders,{" "}
                  </Text>
                  <Text className="font-semibold text-white">
                    Wishlist, and{" "}
                  </Text>
                  <Text className="font-semibold text-white">
                    Recommendations.
                  </Text>
                </Text>
              </View>
              {/* <Pressable
                onPress={() => router.push("/screens/(auth)/(SignIn)/SignUp")}
                className="w-[90%] flex justify-center items-center p-2"
                style={{ position: "absolute", bottom: 16 }}
              >
                <Text className="text-white font-semibold mb-2">
                  New to Machine Market?
                </Text>

                <Pressable
                  onPress={() => router.push("/screens/(auth)/(SignIn)/SignUp")}
                  style={{
                    marginRight: 2,
                    backgroundColor: "#f2f2f2",
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "teal", // use lowercase color names for consistency
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </Pressable> */}
            </View>
          )}

          {/* Login Form */}
          <View
            className={`${
              Platform.OS === "web" ? "w-[60%] h-[450px]" : "w-full mx-auto"
            } p-5 py-8 `}
            style={[isScreenSmall ? { width: "100%" } : {}]}
          >
            <Text
              className={` font-bold mx-auto text-TealGreen mb-6 ${
                isScreenSmall ? "text-xl" : "text-2xl"
              }`}
            >
              Log In to your account
            </Text>
            {/* Email/Mobile Switch */}
            {/* <View
                className={`${
                  Platform.OS === "web" ? "w-[75%]" : "w-[90%]"
                } mx-auto align-items-right mt-2`}
              >
                <Text
                  className="text-blue-500 text-md font-semibold text-right underline"
                  onPress={() => setMobile(!mobile)}
                >
                  {mobile ? "E-mail" : "Mobile Number"}
                </Text>
              </View> */}
            {/* Email or Mobile Input */}
            {/* {mobile ? (
              <Mobile
                dropdownVisible={dropdownVisible}
                setDropdownVisible={setDropdownVisible}
                selectedCode={selectedCode}
                setSelectedCode={setSelectedCode}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredCountries={filteredCountries}
                mailOrphone={mailOrphone}
                setMailOrphone={setMailOrphone}
              />
            ) : ( */}
            <Email mailOrphone={mailOrphone} setMailOrphone={setMailOrphone} />
            {/* )} */}

            {/* Password Input */}
            <View
              className={` h-[50]  ${
                Platform.OS === "web" ? "w-[75%]" : "w-[90%]"
              } mx-auto mt-8`}
              style={[isScreenSmall ? { width: "100%" } : {}]}
            >
              <FloatingLabelInput
                label="Password"
                value={password}
                onKeyPress={handleKeyPress}
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

            {/* Login Button */}
            <Pressable
              onPress={() => Login()}
              className={`bg-TealGreen mb-4 py-4  px-4 h-max mx-auto rounded-md ${
                isScreenSmall ? "w-[90%]" : "w-[75%]"
              } ${
                (Platform.OS === "web" && width < 1024) || Platform.OS !== "web"
                  ? "mt-8"
                  : "mt-8"
              } `}
            >
              <Text className="text-white m-auto font-bold">Log In</Text>
            </Pressable>

            <Text className=" font-semibold text-center mt-2">
              New to Machine Streets?
            </Text>
            <Pressable
              onPress={() => {
                if (Platform.OS === "web") {
                  // router.push("/screens/(auth)/(SignIn)/SignUp");
                  router.push("/screens/SignUp");
                } else {
                  // navigation.navigate("SignUp");
                  navigation.replace("SignUp");
                }
              }}
              className={`bg-TealGreen mb-4 py-4  px-4 h-max   ${
                isScreenSmall ? "w-[90%]" : "w-[75%]"
              } mt-4 mx-auto rounded-md ${
                (Platform.OS === "web" && width < 1024) || Platform.OS !== "web"
                  ? "mt-2"
                  : "mt-2"
              }`}
            >
              <Text className="text-white m-auto font-bold">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
