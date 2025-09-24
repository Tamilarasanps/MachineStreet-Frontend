import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react-native";
import { router } from "expo-router";

export default function Footer() {
  const year = new Date().getFullYear();

  const handleNavigation = (item) => {
    if (item === "Home") {
      // navigation.navigate("HomePage"); // tabs/HomePage screen
      router.push('/(tabs)/HomePage'); // tabs/HomePage screen
    } else if (item === "Services") {
      router.push('/Footer/ServicesPage')
    } else if (item === "About") {
      navigation.navigate("AboutPage");
    }
  };

  return (
    <View className="bg-gray-900 px-6 pt-10 pb-6">
      {/* Top Section */}
      <View className="flex-col md:flex-row md:justify-between md:items-start">
        {/* Brand */}
        <View className="mb-8 md:mb-0">
          <Text className="text-xl font-bold text-white">MachineStreets</Text>
          <Text className="mt-3 text-sm text-gray-400 leading-6 w-60">
            Make your Machine happy!!!
          </Text>
        </View>

        {/* Quick Links */}
        <View>
          {["Home", "Services"].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleNavigation(item)}
              className="mb-2"
            >
              <Text className="text-sm text-gray-400 hover:text-white">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact */}
        <View className="mb-8 md:mb-0">
          <Text className="text-white font-semibold mb-3">Contact</Text>
          <Text className="text-sm text-gray-400 mb-2">
            Email:
            <Text
              onPress={() => Linking.openURL("mailto:info@yourbrand.com")}
              className="text-white"
            >
              developer.githubcodes@gmail.com
            </Text>
          </Text>
          <Text className="text-sm text-gray-400 mb-2">
            Phone:
            <Text
              onPress={() => Linking.openURL("tel:+1234567890")}
              className="text-white"
            >
              +91 97884 01234
            </Text>
          </Text>
          <Text className="text-sm text-gray-400">
            373/2, Vaiyampatti, NH47 Trichy-dindugal{"\n"}
            Manapparai taluk, Tamil Nadu - 621315
          </Text>
        </View>

        {/* Social */}
        {/* <View>
          <Text className="text-white font-semibold mb-3">Follow Us</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => Linking.openURL("https://facebook.com")}
            >
              <Facebook size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://twitter.com")}
            >
              <Twitter size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://instagram.com")}
            >
              <Instagram size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://linkedin.com")}
            >
              <Linkedin size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View> */}
      </View>

      {/* Bottom Bar */}
      <View className="border-t border-gray-700 mt-8 pt-4">
        <Text className="text-center text-sm text-gray-500">
          © {year} MachineStreets. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
