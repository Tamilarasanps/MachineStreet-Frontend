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

const screenWidth = Dimensions.get("window").width;

const QrScan = ({ userProfile }) => {
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

  const review = [
    {
      name: "Sowmya R",
      rating: 5,
      comment: "Fantastic product. Great support and seamless process!",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Arun Kumar",
      rating: 4,
      comment: "Well-built machines. Helped improve our output.",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      name: "Manoj S",
      rating: 4.5,
      comment: "Good quality, just had slight delay in logistics.",
      avatar: "https://randomuser.me/api/portraits/men/50.jpg",
    },
    {
      name: "Deepika J",
      rating: 5,
      comment: "Trustworthy supplier. Everything was perfect.",
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View>
            <Text style={styles.title}>
              {userProfile?.organization.charAt(0).toUpperCase() +
                userProfile?.organization.slice(1)}{" "}
            </Text>
            <Text className="text-xl text-white mt-2" style={styles.subheading}>
              {" "}
              {userProfile?.district.charAt(0).toUpperCase() +
                userProfile?.district.slice(1)}{" "}
            </Text>
            <Text className="text-xl text-white " style={styles.subheading}>
              {" "}
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
                  <Text className=" text-white mt-1" style={styles.section}>
                    {sub.name}
                  </Text>
                  {sub.services?.map((service, i) => (
                    <Text
                      key={i}
                      className="text-white ml-2"
                      style={styles.item}
                    >
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
                  <Text key={index} className="text-white">
                    -{service}
                  </Text>
                ))}
              </View>
              <View
                style={[
                  styles.category,
                  { width: isSmallScreen ? "100%" : "48%" },
                ]}
              >
                <Text style={styles.section}>Contact</Text>

                <Text className="text-md text-white mt-2">
                  {" "}
                  {userProfile?.contact.countryCode}{" "}
                  {userProfile?.contact.number}
                </Text>
              </View>
            </View>
          </View>


          <Divider style={styles.divider} />

          {/* Review Section */}
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
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a2e",
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 180,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#e94560",
  },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 130,
    marginTop: 30,
  },
  title: {
    color: "#e94560",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
    backgroundColor: "#0f3460",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  section: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  item: {
    color: "#ccc",
    marginTop: 2,
  },
  divider: {
    backgroundColor: "#444",
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
    backgroundColor: "#0f3460",
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
    color: "#fff",
    marginLeft: 10,
  },
  star: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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
