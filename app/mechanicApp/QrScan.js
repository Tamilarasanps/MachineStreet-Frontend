import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Card, Title, Paragraph, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { FadeInUp } from "react-native-reanimated";
import GetMechanic from "../hooks/GetMechanic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;

const QrScan = ({ userProfile, page }) => {
  const isSmallScreen = screenWidth < 400;

  const [selectedMech, setSelectedMech] = useState();
  const [reviewData, setReviewData] = useState([]);

  const { getJsonApi } = useApi();

  useEffect(() => {
    async function fectchss() {
      try {
        const token = await AsyncStorage.getItem("userToken"); // Missing await

        const result = await getJsonApi(
          `mechanicList/getReviews/${selectedMech}`,
          token
        );
        setReviewData(result.data);
      } catch (err) {
        console.log(err);
      }
    }
    fectchss();
  }, [selectedMech]);

  useEffect(() => {
    setSelectedMech(userProfile._id);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* <Card style={styles.card}> */}
      <LinearGradient
        colors={["#2095a2", "#0f3460"]}
        // 16213e 1a1a2e 0f3460 2a4c78 476693 6f85ab a5b6d3
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // style={{
        //   width: isSmallScreen ? "100%" : "40%",
        //   height: isSmallScreen ? 220 : "100%",
        //   paddingTop: 16,
        //   paddingBottom: 16,
        //   borderTopLeftRadius: 16,
        //   borderBottomLeftRadius: isSmallScreen ? 0 : 16,
        //   borderTopRightRadius: isSmallScreen ? 16 : 0,
        // }}
      >
        <Card.Content>
          <View>
            <Text style={styles.title}>
              {userProfile?.organization.charAt(0).toUpperCase() +
                userProfile?.organization.slice(1)}{" "}
            </Text>
            <Text className="text-lg text-white mt-2" style={styles.subheading}>
              <MaterialIcons
                name="location-on"
                size={16}
                color="white"
                className=""
              />{" "}
              {userProfile?.district.charAt(0).toUpperCase() +
                userProfile?.district.slice(1)}{" "}
            </Text>

            <Text className="text-xl text-white font-bold ml-2 ">
              <MaterialCommunityIcons name="factory" size={20} color="white" />{" "}
              {userProfile?.industry.charAt(0).toUpperCase() +
                userProfile?.industry.slice(1)}{" "}
            </Text>
            <View style={styles.infoSection}>
              {userProfile?.subcategory?.map((sub, key) => (
                <View
                  key={key}
                  style={[
                    styles.category,
                    { width: isSmallScreen ? "100%" : "48%" },
                  ]}
                >
                  <Text className=" mt-1" style={styles.section}>
                    {sub.name}
                  </Text>
                  {sub.services?.map((service, i) => (
                    <Text key={i} className=" ml-2" style={styles.item}>
                      - {service}
                    </Text>
                  ))}
                </View>
              ))}
              <View
                style={[
                  styles.category,
                  { width: isSmallScreen ? "100%" : "48%" },
                ]}
              >
                <Text style={styles.section}>Specialization / Services</Text>
                {userProfile?.services.map((service, index) => (
                  <Text key={index}>-{service}</Text>
                ))}
              </View>
              <View
                style={[
                  styles.category,
                  { width: isSmallScreen ? "100%" : "48%" },
                ]}
              >
                <Text style={styles.section}>Contact</Text>

                <Text className="text-md  mt-2">
                  {" "}
                  {userProfile?.contact.countryCode}{" "}
                  {userProfile?.contact.number}
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          {page === "uservisit" ? (
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewHeading}>✨ Customer Reviews</Text>
              <View style={styles.reviewGrid}>
                {Array.isArray(reviewData) &&
                  reviewData.map((data, index) => (
                    <Animated.View
                      key={data._id || index}
                      entering={FadeInUp.delay(index * 150)}
                      style={styles.reviewCard}
                    >
                      <View className="flex-row">
                        <Image
                          source={{
                            uri: `data:image/jpeg;base64,${data.user?.profileImage}`,
                          }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "white",
                          }}
                        />
                        <Text style={styles.name} className="mt-2">
                          {data.user?.username.charAt(0).toUpperCase() +
                            data.user?.username.slice(1)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 4 }}>
                        {Array.from({ length: data.stars }).map((_, i) => (
                          <Text key={i} style={styles.star}>
                            ⭐
                          </Text>
                        ))}
                      </View>

                      <Text style={styles.star} className="mt-1 ml-1">
                        {data.reviewText.charAt(0).toUpperCase() +
                          data.reviewText.slice(1)}
                      </Text>
                    </Animated.View>
                  ))}
              </View>
            </View>
          ) : null}

          {/* Review Section */}
        </Card.Content>
      </LinearGradient>
      {/* </Card> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e7eb",
    flex: 1,
  },

  card: {
    // backgroundColor: "#2095A2",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 130,
    marginTop: 30,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },
  subheading: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 10,
  },
  infoSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  category: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  section: {
    // color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  item: {
    // color: "#ccc",
    marginTop: 2,
  },
  divider: {
    backgroundColor: "#fff",
    marginVertical: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  contact: {
    color: "#fff",
    marginLeft: 10,
  },
  reviewContainer: {
    marginTop: 30,
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  reviewHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 15,
  },
  reviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  reviewCard: {
    backgroundColor: "#f3f4f6",
    // backgroundColor: "#e5e7eb",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    width: screenWidth > 600 ? "48%" : "100%",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    // color: "#fff",
    marginLeft: 10,
  },
  star: {
    fontSize: 16,
    fontWeight: "600",
    // color: "#fff",
  },
  stars: {
    flexDirection: "row",
    marginTop: 4,
  },
  comment: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  emoji: {
    fontSize: 22,
    marginLeft: 10,
  },
});

export default QrScan;
