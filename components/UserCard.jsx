import { Pressable, View, Text, Platform, Image, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { useState } from "react";
import ScrollingEffect from "@/app/HomePage/ScrollingEffect";

const UserCard = ({
  mechanic,
  isDesktop,
  setServiceModal,
  setSelectedMechanic,
  setReviewModal,
  setReview,
}) => {
  const [tickerWidth, setTickerWidth] = useState(0);

  function openDialer(mechanic) {
    const { countryCode, number } = mechanic.mobile || {};
    if (countryCode && number) {
      // Dial the phone number with the country code
      const phoneNumber = `${countryCode}${number}`;
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.log("No contact number available");
    }
  }
  return (
    // main container
    <Pressable
      onPress={() => {
        setSelectedMechanic(mechanic);
        router.push({
          pathname: "/E2",
          params: { id: mechanic._id, type: "user_visit" },
        });
      }}
      className={`h-full w-full ${!isDesktop ? "flex-col" : "flex-row"} `}
    >
      <LinearGradient
        colors={["#6B7280", "#FAFAFA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: !isDesktop ? "100%" : "40%",
          height: !isDesktop ? 220 : "100%",
          paddingTop: 16,
          paddingBottom: 16,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: !isDesktop ? 0 : 16,
          borderTopRightRadius: !isDesktop ? 16 : 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* profile picture */}
        {mechanic?.profileImage ? (
          <Image
            source={{
              uri: `https://api-machinestreets.onrender.com/api/mediaDownload/${mechanic?.profileImage}`,
            }}
            resizeMode="cover"
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
            }}
          />
        ) : (
          <Icon
            name="account-circle"
            size={150}
            color="#374151"
            className="mx-auto"
          />
        )}

        {/* username */}

        <Text className="text-lg font-extrabold text-gray-600 text-center md:text-left mx-auto">
          {mechanic?.username.charAt(0).toUpperCase() +
            mechanic?.username.slice(1)}
        </Text>

        {/*  */}

        <View className="flex-row items-center mx-auto mt-2 rounded-r-md">
          <MaterialCommunityIcons
            name="postage-stamp"
            size={24}
            color="black"
          />
          <Text className="ml-2 font-semibold">{mechanic?.posts?.length}</Text>
        </View>
      </LinearGradient>

      {/* right panel */}

      <View
        className="bg-white px-4 py-4 "
        style={{
          width: !isDesktop ? "100%" : "60%",
          flex: 1,
        }}
      >
        {/* username */}
        <Text className="text-lg font-bold" style={{ flexShrink: 1 }}>
          {mechanic.organization}
        </Text>

        {/* industryName */}
        <Text className="font-bold mt-4">
          {mechanic.industry?.charAt(0).toUpperCase() +
            mechanic.industry.slice(1)}
        </Text>

        {/* view more button */}
        <View className="bg-gray-100 p-2 mt-2">
          <View className="flex flex-row">
            <View className="w-max">
              <Text>{mechanic.subcategory[0].name} :</Text>
            </View>

            <View
              className="flex-1 flex-row"
              onLayout={(e) => {
                const { width } = e.nativeEvent.layout;
                if (width > 0 && width !== tickerWidth) {
                  setTickerWidth(width);
                }
              }}
            >
              {tickerWidth > 0 && (
                <ScrollingEffect
                  width={tickerWidth}
                  data={["tirupur", "coimbator", "delhi"]}
                />
              )}
            </View>
          </View>

          <Pressable
            onPress={() => {
              setSelectedMechanic(mechanic);
              setServiceModal(true);
            }}
            className="mt-4 rounded-md items-end"
          >
            <View>
              <Text className="font-semibold underline">View more</Text>
            </View>
          </Pressable>
        </View>

        {/* special services */}

        <Text className="font-bold mt-4">Specialization / services</Text>
        <View className="bg-gray-100 p-2 mt-2">
          <View>
            <Text>
              {mechanic?.services[0]?.length > 25
                ? `${mechanic.services[0].substring(0, 25)}...`
                : `${mechanic.services[0]} ...`}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setSelectedMechanic(mechanic);
              setServiceModal(true);
            }}
            className="mt-4 items-end"
          >
            <View>
              <Text className="font-semibold underline">View more</Text>
            </View>
          </Pressable>
        </View>

        {/* location */}

        <View className="flex-row items-center mt-6">
          <FontAwesome name="map-marker" size={18} color="#2095A2" />
          <Text
            className="ml-2 font-semibold text-md"
            style={{ flexShrink: 1 }}
          >
            {mechanic?.district || mechanic?.region || mechanic?.country}
          </Text>
        </View>

        {/* contact */}

        <View className="flex-row mt-4 items-center justify-between gap-2">
          <View className="flex flex-row items-center">
            <FontAwesome
              name="phone"
              size={20}
              color="#2095A2"
              style={{
                marginTop: "8px",
                marginRight: 7,
              }}
            />
            <Text className="text-md font-semibold " style={{ flexShrink: 1 }}>
              {mechanic.mobile?.countryCode} {mechanic.mobile?.number}
            </Text>
          </View>
          {Platform.OS !== "web" ? (
            <Pressable
              className=" h-10  w-[100px] bg-TealGreen justify-center items-center rounded-md"
              // onPress={openDailer}
              key={mechanic.id}
              onPress={() => openDialer(mechanic)}
            >
              <Text className="text-white text-lg">Call</Text>
            </Pressable>
          ) : (
            <Text></Text>
          )}
        </View>

        {/* ratings */}

        <View className="flex-row gap-4 items-center mt-6">
          {mechanic?.averageRating ? (
            <>
              <View className="bg-green-600 px-3 py-1 rounded-lg flex-row gap-2 items-center">
                <Text className="text-white font-bold text-base">
                  {mechanic.averageRating}
                </Text>
                <FontAwesome name="star" size={16} color="white" />
              </View>
              <Pressable
                onPress={() => {
                  setSelectedMechanic(mechanic);
                  setReview((prev) => ({ ...prev, userId: mechanic?._id }));
                  setReviewModal("read");
                }}
              >
                <Text>See all reviews</Text>
              </Pressable>
            </>
          ) : (
            <View style={{pointerEvents:"box-none"}} className="flex flex-row gap-4 ">
              <Text>No Reviews Yet</Text>
              <Pressable
                onPress={() => {
                  setSelectedMechanic(mechanic);
                  setReview((prev) => ({ ...prev, userId: mechanic?._id }));
                  setReviewModal("write");
                }}
              >
                <Text
                  style={{
                    color: "#3B82F6",
                    textDecorationLine: "underline",
                  }}
                >
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
