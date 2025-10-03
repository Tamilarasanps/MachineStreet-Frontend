import React from "react";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import useScreenWidth from "../hooks/useScreenWidth";
import Feather from "@expo/vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import CryptoJS from "react-native-crypto-js";

const Header = ({ isOpen, searchBarValue, setSearchBarValue }) => {
  const { isDesktop } = useScreenWidth();

  // route to profile

  const goToProfile = async () => {
    try {
      // 1️⃣ Encrypt a string
      const encrypted = CryptoJS.AES.encrypt("jsvdj", secretkey).toString();

      // 2️⃣ Get userId depending on platform
      const userId =
        Platform.OS === "web"
          ? localStorage.getItem("userId")
          : await SecureStore.getItemAsync("userId");

      if (!userId) {
        console.warn("User ID not found!");
        return;
      }

      // 3️⃣ Push to Profile page with params
       router.push({
          pathname: "/(tabs)/Profile",
          params: { id: userId, type: encrypted },
        });
    } catch (err) {
      console.error("Failed to go to profile:", err);
    }
  };

  return (
    <View
      className="bg-TealGreen w-full px-4 py-3"
      style={{ position: "sticky", top: 0, zIndex: 50 }}
    >
      <View className="flex-row items-center py-2">
        {/* Logo */}
        {/* <Text className="text-white text-xl font-bold shrink-0 w-[100px] ">
          Machine Street
        </Text> */}

        {/* Search Bar */}
        <View
          //   ref={searchRef}
          className="flex-row bg-white rounded-md items-center flex-1 min-w-0 relative mx-auto"
          style={{
            maxWidth: isDesktop ? 600 : undefined,
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            className="h-10 flex-1"
            placeholder="Search "
            value={searchBarValue}
            onChangeText={(text) => {
              setSearchBarValue(text);
              // setShowResults(text?.length > 0);
            }}
            style={{ outline: "none" }}
          />
          {/* <Link href={`/(screen)/ProductList?searchTerms=${searchBar}`} asChild> */}
          <Pressable className="absolute right-1">
            <Feather name="search" size={20} color="gray" />
          </Pressable>
          {/* </Link> */}
        </View>

        {/* profile icon */}
        {Platform.OS === "web" && (
          <Pressable onPress={goToProfile}>
            <MaterialIcons name="account-circle" size={40} color="white" />
          </Pressable>
        )}
        {/* <Pressable
          onPress={() => {
            if (Platform.OS === "web") {
              router.push("/screens/(profile)/ProfilePage");
            } else {
              navigation.navigate("Profile");
            }
          }}
        >
          <MaterialIcons name="account-circle" size={40} color="white" />
        </Pressable> */}

        {/* Right Side Icons */}

        {/* <View className="flex-row items-center gap-14 ">
          {isDesktop ? (
            <>
              <Pressable
                className="bg-red-500 py-2 px-8 rounded-md "
                onPress={() => router.push("/screens/(sellerForm)/SellScreen")}
              >
                <Text className="text-white font-semibold text-base">Sell</Text>
              </Pressable>

              <Pressable
                className="items-center"
                onPress={() =>
                  router.push("/screens/(wishlists)/WishlistScreen")
                }
              >
                <FontAwesome name="star" size={20} color="white" />
                <Text className="text-white font-semibold text-sm">
                  WishList
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push("/(chat)/Chat")}>
                <MaterialIcons name="chat" size={40} color="white" />
              </Pressable>

              <Pressable
                className="mr-2"
                onPress={() => router.push("/screens/ProfilePage")}
              >
                <MaterialIcons name="account-circle" size={40} color="white" />
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => setIsOpen(!isOpen)}
              className="shrink-0 ms-2"
            >
              <MaterialIcons name="menu" size={35} color="white" />
            </Pressable>
          )}
        </View>
        {isOpen && (
          <Pressable
            className="absolute inset-0 z-50"
            onPress={() => setIsOpen(false)}
          >
   
          </Pressable>
        )} */}
      </View>
      {/* Mobile Dropdown Menu */}
      {/* {!isDesktop && isOpen && (
        <View className="absolute right-2 top-[60px] bg-gray-300 p-4 w-[250px] p-2 rounded-sm shadow-lg"> */}
      {/* <Pressable
            onPress={() => {
              router.push("/screens/(wishlists)/WishlistScreen");
              setIsOpen(false);
            }}
          >
            <View className="flex flex-row items-center space-x-4 p-4 bg-gray-100 rounded-sm mb-2 ">
              <FontAwesome name="star" size={35} color="teal" />
              <Text className="text-gray-500 font-semibold text-lg ms-2">
                WishList
              </Text>
            </View>
          </Pressable>

          <Pressable
            className="flex flex-row items-center space-x-4 p-4 bg-gray-100 rounded-sm mb-2"
            onPress={() => {
              router.push("/(chat)/Chat");
              setIsOpen(false);
            }}
          >
            <MaterialIcons name="chat" size={35} color="teal" />
            <Text className="text-gray-500 font-semibold text-lg ms-2">
              Message
            </Text>
          </Pressable>
          <Pressable
            className="bg-red-500 py-2 px-6 rounded-md mb-2"
            onPress={() => {
              router.push("/screens/(sellerForm)/SellScreen");
              setIsOpen(false);
            }}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Sell
            </Text>
          </Pressable> */}

      {/* <Pressable
            className="flex flex-row items-center space-x-3 p-4 bg-gray-100 rounded-sm mb-2"
            onPress={() => {
              router.push("/screens/(profile)/ProfilePage");
              setIsOpen(false);
            }}
          >
            <MaterialIcons name="account-circle" size={35} color="teal" />
            <Text className="text-gray-500 font-semibold text-lg ms-2">
              Profile
            </Text>
          </Pressable> */}
      {/* </View> */}
      {/* )} */}
    </View>
  );
};

export default Header;
