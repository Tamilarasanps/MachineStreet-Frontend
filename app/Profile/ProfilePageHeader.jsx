import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather"; // or MaterialIcons depending on your setup
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import EditIcon from "./EditIcon"; // ✅ adjust path to where your EditIcon lives

const ProfilePageHeader = ({
  selectedMechanic,
  type,
  isMobile,
  upload,
  setUploadType,
  setModal,
}) => {
console.log('rendered')
  return (
    <>
      {/* back icon */}
      <View
        className="z-50 flex justify-center"
        style={{ width: "100%", height: 48 }}
      >
        <Pressable
          onPress={() => router.push('/(tabs)/HomePage')}
          className="flex-row items-center h-12 px-4 bg-white"
        >
          <Icon name="arrow-left" size={24} color="grey" />
        </Pressable>
      </View>

      {/* banner and profile image */}
      <View
        className="relative w-full bg-TealGreen"
        style={{ aspectRatio: 21 / 9 }}
      >
        {selectedMechanic?.banner ? <Image
          source={{
            uri: `https://api-machinestreets.onrender.com/api/mediaDownload/${selectedMechanic?.banner}`,
          }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
        /> : <View className="bg-TealGreen flex-1"></View>}

        {type !== "user_visit" && (
          <EditIcon
            isMobile={isMobile}
            upload={upload}
            setUploadType={setUploadType}
            type="banner"
          />
        )}

        {/* profile image */}
        <View
          style={{
            borderWidth: 2,
            borderColor: "white",
            width: isMobile ? 160 : 256,
            height: isMobile ? 160 : 256,
          }}
          className="absolute left-1/2 -translate-x-1/2 -bottom-24 rounded-full items-center justify-center bg-white"
        >
          <View className="h-full w-full overflow-hidden rounded-full items-center justify-center">
            {selectedMechanic?.profileImage ? (
              <Image
                source={{
                  uri: `https://api-machinestreets.onrender.com/api/mediaDownload/${selectedMechanic?.profileImage}`,
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              // ✅ Centered user icon
              <View className="flex-1 items-center justify-center">
                <FontAwesome name="user" size={100} color="#2095A2" />
              </View>
            )}
          </View>

          {type !== "user_visit" && (
            <EditIcon
              isMobile={isMobile}
              upload={upload}
              setUploadType={setUploadType}
              type="profileImage"
            />
          )}
        </View>
      </View>

      {/* Settings Button */}
      {type !== "user_visit" && (
        <View className="relative w-full flex justify-end mt-4">
          <Pressable
            className="absolute right-0 top-4 w-24 items-center"
            onPress={() => setModal("settings")}
          >
            <Icon name="settings" size={22} />
          </Pressable>
        </View>
      )}

      {/* userDetails */}
      <Text className="text-lg font-bold mt-24 text-center">
        {selectedMechanic?.username ? selectedMechanic?.username?.charAt(0).toUpperCase() +
          selectedMechanic?.username?.slice(1) : null}
      </Text>

      {selectedMechanic?.role === "mechanic" && (
        <Text className="text-md font-semibold text-gray-500 text-center mt-2 mb-4">
          {selectedMechanic?.bio || "bio"}
        </Text>
      )}
    </>
  );
};

export default ProfilePageHeader;
