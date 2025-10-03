import { Pressable, View, Text, Platform, Image, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import CryptoJS from "react-native-crypto-js";
import { Marquee } from "@animatereactnative/marquee";

const UserCard = ({
  mechanic,
  isDesktop,
  setServiceModal,
  setSelectedMechanic,
  setReviewModal,
  setReview,
}) => {
  // Encrypt
  const encrypted = CryptoJS.AES.encrypt('user_visit', 'f9b7nvctr72942chh39h9rc').toString();

  const openDialer = () => {
    const { countryCode, number } = mechanic?.mobile || {};
    if (countryCode && number) {
      Linking.openURL(`tel:${countryCode}${number}`);
    }
  };

  // Build Full Address
  const fullAddress = `${mechanic?.street || ""}, ${mechanic?.city || ""}, ${
    mechanic?.region || ""
  } - ${mechanic?.pincode || ""}, ${mechanic?.country || ""}`;
  return (
    <Pressable
      onPress={() => {
        setSelectedMechanic(mechanic);
        router.push({
          pathname: "/E2",
          params: { id: mechanic._id, type: encrypted },
        });
      }}
      className={`rounded-2xl shadow-md overflow-hidden bg-white ${
        !isDesktop ? "flex-col" : "flex-row"
      }`}
      style={{ flex: 1, }} // ✅ allow flex growth
    >
      {/* Left Panel */}
      <LinearGradient
        colors={["#4B5563", "#F3F4F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: !isDesktop ? "100%" : "38%",
          height: !isDesktop ? "auto" : "100%", // ✅ allow auto height in mobile
          minHeight: 220, // ✅ keep balanced
          paddingVertical: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Profile Image */}
        {mechanic?.profileImage ? (
          <Image
            source={{
              uri: `https://api.machinestreets.com/api/mediaDownload/${mechanic?.profileImage}`,
            }}
            resizeMode="cover"
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: "white",
            }}
          />
        ) : (
          <Icon name="account-circle" size={120} color="#374151" />
        )}

        {/* Username */}
        <Text className="text-lg font-bold text-gray-700 text-center mt-3">
          {mechanic?.username
            ? mechanic.username.charAt(0).toUpperCase() +
              mechanic.username.slice(1)
            : ""}
        </Text>

        {/* Posts */}
        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons
            name="postage-stamp"
            size={20}
            color="black"
          />
          <Text className="ml-1 font-medium text-sm text-gray-700">
            {mechanic?.posts?.length} posts
          </Text>
        </View>
      </LinearGradient>

      {/* Right Panel */}
      <View
        className="px-4 py-5"
        style={{
          width: !isDesktop ? "100%" : "62%",
          flex: 1, // ✅ ensures panel expands
          minHeight: 220, // ✅ same as left panel so it shows in mobile         
          paddingBottom:30
        }}
      >
        {/* Organization */}
        <Text className="text-xl font-extrabold text-gray-900">
          {mechanic?.organization}
        </Text>

        {/* Industry + View more */}
        <View className="flex-row items-center justify-between mt-8 mb-4">
          {mechanic?.industry && (
            <Text className="text-gray-600 font-semibold text-base">
              {mechanic.industry.charAt(0).toUpperCase() +
                mechanic.industry.slice(1)}
            </Text>
          )}
          <Pressable
            onPress={() => {
              setSelectedMechanic(mechanic);
              setServiceModal(true);
            }}
          >
            <Text className="font-semibold text-teal-700 underline">
              View more
            </Text>
          </Pressable>
        </View>

        {/* Services Marquee */}
        {mechanic?.subcategory?.length > 0 && (
          <View className="bg-gray-100 p-2 rounded-xl overflow-hidden">
            <Marquee spacing={16} speed={0.6} style={{ width: "100%" }}>
              <View className="flex-row flex-nowrap">
                {mechanic.subcategory?.map((service, i) => (
                  <View
                    key={i}
                    className="mr-3"
                    style={{
                      minWidth: 100,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text className="text-white bg-gray-800 px-4 py-2 rounded-full text-sm">
                      {service?.name}
                    </Text>
                  </View>
                ))}
              </View>
            </Marquee>
          </View>
        )}

        {/* Specialization */}
        {mechanic?.services?.length > 0 && (
          <>
            <Text className="font-bold mt-5 mb-2 text-gray-800">
              Specialization
            </Text>
            <View className="bg-gray-100 p-2 rounded-lg">
              <Text className="text-gray-700 text-sm">
                {mechanic.services[0].length > 25
                  ? `${mechanic.services[0].substring(0, 25)}...`
                  : `${mechanic.services[0]} ...`}
              </Text>
            </View>
          </>
        )}

        {/* Location */}
        <View className="flex-row items-start mt-6 ">
          <FontAwesome name="map-marker" size={18} color="#2095A2" className='my-auto'/>

          {/* Address - styled match */}
          <Text
            className="ml-3 text-gray-700 text-base leading-6 flex-1"
            numberOfLines={2} // ✅ max 3 lines
            ellipsizeMode="tail"
          >
            {fullAddress}
          </Text>
        </View>

        {/* Contact */}
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center">
            <FontAwesome name="phone" size={18} color="#2095A2" />
            <Text className="ml-3 font-medium text-gray-800 text-base">
              {mechanic?.mobile?.countryCode} {mechanic?.mobile?.number}
            </Text>
          </View>
          {Platform.OS !== "web" && (
            <Pressable
              className="h-10 px-5 bg-teal-600 justify-center items-center rounded-lg"
              onPress={openDialer}
            >
              <Text className="text-white font-semibold text-base">Call</Text>
            </Pressable>
          )}
        </View>

        {/* Ratings / Reviews */}
        <View className="flex-row items-center gap-6 mt-6">
          {mechanic?.averageRating ? (
            <>
              <View className="bg-green-600 px-3 py-1 rounded-lg flex-row items-center">
                <Text className="text-white font-bold text-base mr-1">
                  {mechanic.averageRating}
                </Text>
                <FontAwesome name="star" size={14} color="white" />
              </View>
              <Pressable
                onPress={() => {
                  setSelectedMechanic(mechanic);
                  setReview((prev) => ({ ...prev, userId: mechanic?._id }));
                  setReviewModal("read");
                }}
              >
                <Text className="underline text-teal-700 font-medium text-base">
                  See all reviews
                </Text>
              </Pressable>
            </>
          ) : (
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-gray-500 text-base">No Reviews Yet</Text>
              <Pressable
                onPress={() => {
                  setSelectedMechanic(mechanic);
                  setReview((prev) => ({ ...prev, userId: mechanic?._id }));
                  setReviewModal("write");
                }}
              >
                <Text className="text-blue-500 underline font-medium text-base">
                  Add yours
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default UserCard;
