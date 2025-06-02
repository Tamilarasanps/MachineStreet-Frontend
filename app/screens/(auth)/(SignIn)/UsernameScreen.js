import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import Mobile from "./Mobile";
import Email from "./Email";
import { router } from "expo-router";
import { useNavigation } from "expo-router";
import { LoadingContext } from "@/app/context/LoadingContext";
import Loading from "@/app/component/Loading";

const UsernameScreen = ({
  username,
  setUsername,
  mailOrphone,
  setMailOrphone,
  mobile,
  setMobile,
  selectedCode,
  setSelectedCode,
  phoneNumber,
  setPhoneNumber,
  dropdownVisible,
  setDropdownVisible,
  filteredCountries,
  searchQuery,
  setSearchQuery,
  formSubmit,
}) => {
  const { width } = useWindowDimensions();
  const isScreen = width > 768;
  const navigation = useNavigation();

  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

  const handleNextPress = async () => {
    startLoading();
    try {
      await formSubmit({ username, mailOrphone });
    } catch (error) {
      console.error(error);
    }
    stopLoading();
  };

  return (
    <View
      style={{ flex: 1 }}
      className={`${
        Platform.OS === "web" ? "w-full sm:w-full h-[415px]" : "w-full mx-auto"
      } p-5 py-8`}
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
              elevation: 2,
            },
            isScreen ? { width: "75%" } : { width: "100%" },
          ]}
        />
      </View>

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
          formSubmit={formSubmit}
          username={username}
        />
      ) : ( */}
      <Email mailOrphone={mailOrphone} setMailOrphone={setMailOrphone} />
      {/* )} */}

      {/* Toggle Email/Mobile */}
      <View
        className={`mx-auto mt-2 ${
          Platform.OS === "web" ? "w-[75%]" : "w-[90%]"
        }`}
      >
        <Text
          className="text-blue-500 text-md font-semibold text-right mt-2 underline"
          onPress={() => setMobile(!mobile)}
        ></Text>
      </View>

      {/* Navigation and CTA */}

      <View className="mt-20  mb-4">
        <Pressable
          onPress={() => {
            if (Platform.OS === "web") {
              router.push("/screens/Login");
            } else {
              navigation.replace("LoginPage");
            }
          }}
          style={{
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          {((Platform.OS === "web" && width < 1024) ||
            Platform.OS !== "web") && (
            <Text style={{ color: "black", fontWeight: "600" }}>
              Already have an account?{" "}
              <Text style={{ textDecorationLine: "underline" }}>Login</Text>
            </Text>
          )}
        </Pressable>

        <Pressable
          disabled={isLoading}
          onPress={handleNextPress}
          className={`bg-TealGreen py-4 px-4 w-24 mx-auto rounded-md ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white text-center font-semibold">Next</Text>
        </Pressable>
      </View>

      {/* Loading Overlay */}
      {isLoading && <Loading />}
    </View>
  );
};

export default UsernameScreen;
