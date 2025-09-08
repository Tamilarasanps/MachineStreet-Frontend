import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Card, Divider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import FadeSlideView from "@/components/FadeSlideView";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const UserDetails = ({ userDetails, isMobile }) => {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    setReviewData(userDetails?.reviews);
  }, []);

  return (
    <FadeSlideView>
      <LinearGradient
        colors={["#2095a2", "#0f3460"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 bg-gray-200 rounded-md"
      >
        <Card.Content>
          <View>
            <Text className="text-white text-2xl font-bold text-center mt-8">
              {userDetails?.organization.charAt(0).toUpperCase() +
                userDetails?.organization.slice(1)}
            </Text>

            <Text className="text-white text-center mb-2 text-lg mt-2">
              <MaterialIcons name="location-on" size={16} color="white" />{" "}
              {userDetails?.district ||
                userDetails?.region ||
                userDetails?.country.charAt(0).toUpperCase() +
                  userDetails?.district.slice(1)}
            </Text>

            <Text className="text-xl text-white font-bold ml-2 mt-1">
              <MaterialCommunityIcons name="factory" size={20} color="white" />{" "}
              {userDetails?.industry.charAt(0).toUpperCase() +
                userDetails?.industry.slice(1)}
            </Text>

            <View className="flex-row flex-wrap justify-between mt-5 gap-2">
              {userDetails?.subcategory?.map((sub, key) => (
                <View
                  key={key}
                  className={`bg-white p-3 rounded-lg mb-2 ${
                    isMobile ? "w-full" : "w-[48%]"
                  }`}
                >
                  <Text className="text-base font-semibold mb-1 mt-1">
                    {sub.name}
                  </Text>
                  {sub.services?.map((service, i) => (
                    <Text key={i} className="mt-1 ml-2 text-gray-700">
                      - {service}
                    </Text>
                  ))}
                </View>
              ))}

              <View
                className={`bg-white p-3 rounded-lg mb-2 ${
                  isMobile ? "w-full" : "w-[48%]"
                }`}
              >
                <Text className="text-base font-semibold mb-1">
                  Specialization / Services
                </Text>
                {userDetails?.services.map((service, index) => (
                  <Text key={index} className="mt-1 ml-2 text-gray-700">
                    - {service}
                  </Text>
                ))}
              </View>

              <View
                className={`bg-white p-3 rounded-lg mb-2 ${
                  isMobile ? "w-full" : "w-[48%]"
                }`}
              >
                <Text className="text-base font-semibold mb-1">Contact</Text>
                <Text className="text-md mt-2">
                  {userDetails?.contact?.countryCode &&
                  userDetails?.contact?.number
                    ? `${userDetails.contact.countryCode} ${userDetails.contact.number}`
                    : "-Not provided"}
                </Text>
              </View>
            </View>
          </View>

          <Divider className="bg-white my-4" />
          {/* review section  */}
          <View className="mt-12 mb-20 px-4">
            <Text className="text-2xl font-bold text-white mb-8 text-center">
              ✨ Customer Reviews
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {Array.isArray(reviewData) && reviewData.length > 0 ? (
                reviewData.map((data, index) => (
                  <Animated.View
                    key={data._id || index}
                    entering={FadeInUp.delay(index * 120)}
                    className={`bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 
            ${screenWidth > 768 ? "w-[48%]" : "w-full"}`}
                  >
                    {/* User */}
                    <View className="flex-row items-center mb-4">
                      <Image
                        source={{
                          uri: `data:image/jpeg;base64,${data.user?.profileImage}`,
                        }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: "#f5f5f5",
                        }}
                      />
                      <View className="ml-3">
                        <Text className="text-lg font-semibold text-gray-900">
                          {data?.user?.username
                            ? data.user?.username.charAt(0).toUpperCase() +
                              data.user?.username.slice(1)
                            : "Guest User"}
                        </Text>
                        <View className="flex-row">
                          {Array.from({ length: data.stars }).map((_, i) => (
                            <Text
                              key={i}
                              className="text-yellow-500 text-sm mr-0.5"
                            >
                              ⭐
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>

                    {/* Review */}
                    <Text className="text-base text-gray-700 leading-relaxed">
                      {data.reviewText.charAt(0).toUpperCase() +
                        data.reviewText.slice(1)}
                    </Text>
                  </Animated.View>
                ))
              ) : (
                <View className="p-6 items-center">
                  <Text className="text-white text-base">No Reviews Yet</Text>
                </View>
              )}
            </View>
          </View>
        </Card.Content>
      </LinearGradient>
    </FadeSlideView>
  );
};

export default UserDetails;
