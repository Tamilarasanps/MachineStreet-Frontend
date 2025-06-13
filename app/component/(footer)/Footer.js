import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Expo vector icons

const Footer = () => {
  return (
    <View className="bg-gray-500 pb-5">
      {/* Company Information Section */}
      <View className="px-6 py-4 flex flex-row">
        <View className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <Text className="text-white text-lg font-bold mb-4">
            Machine Street
          </Text>
          <Text className="font-semibold text-white">
            Machine Street connects you with verified mechanics for automotive,
            industrial, marine, agricultural, and more.
          </Text>
          <Text className="text-white mt-2 font-semibold">
            Browse our directory, view profiles, and contact the right expert
            for your needs-quickly and easily.
          </Text>
        </View>

        {/* Products and Useful Links Section */}
        <View className="flex-row gap-10 ml-8 sm:ml-0 sm:mt-4">
          <View className="ml-8 sm:ml-0 sm:w-full">
            <Pressable>
              <Text className="text-white mt-2">About Us</Text>
            </Pressable>
            <Pressable>
              <Text className="text-white mt-2">Privacy Policy</Text>
            </Pressable>
            <Pressable>
              <Text className="text-white mt-2">Terms And Condition</Text>
            </Pressable>
            <Pressable>
              <Text className="text-white mt-2">Help</Text>
            </Pressable>
          </View>
          {/* details */}
          <View className="ml-8 sm:ml-0 sm:w-full ">
            <Text className="text-white text-lg font-bold">Contact</Text>
            <View className="flex-row items-center mt-2">
              <FontAwesome5 name="home" size={14} color="white" />
              <Text className="text-white ml-2">Tiruppur,TamilNadu,India</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <FontAwesome5 name="envelope" size={14} color="white" />
              <Text className="text-white ml-2">info@example.com</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <FontAwesome5 name="phone" size={14} color="white" />
              <Text className="text-white ml-2">+91 9876543210</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <FontAwesome5 name="print" size={14} color="white" />
              <Text className="text-white ml-2">+ 01 234 567 89</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="bg-gray-800 py-3 items-center">
        <Text className="text-white text-sm">
          © {new Date().getFullYear()} Copyright:{" "}
          <Text className="font-semibold">Tamiarasan</Text>
        </Text>
      </View>
    </View>
  );
};

export default Footer;

{
  /* Social Media Section */
}
{
  /* <View className="bg-red-500 py-4 px-6 flex-row items-center">
<Text className="text-white text-lg">
  Get connected with us on social networks:
</Text>
<View className="flex-row w-1/2">
  <Pressable
    onPress={() => Linking.openURL("https://facebook.com")}
  >
    <FontAwesome5 name="facebook-f" size={20} color="white" />
  </Pressable>
  <Pressable
    onPress={() => Linking.openURL("https://twitter.com")}
  >
    <FontAwesome5 name="twitter" size={20} color="white" />
  </Pressable>
  <Pressable
    onPress={() => Linking.openURL("https://google.com")}
  >
    <FontAwesome5 name="google" size={20} color="white" />
  </Pressable>
  <Pressable
    onPress={() => Linking.openURL("https://instagram.com")}
  >
    <FontAwesome5 name="instagram" size={20} color="white" />
  </Pressable>
</View>
</View> */
}
