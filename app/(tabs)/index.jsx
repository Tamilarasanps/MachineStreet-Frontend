import { router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import useScreenWidth from "@/hooks/useScreenWidth";
import useApi from "../../hooks/useApi";
import Carousel from "react-native-reanimated-carousel";
import Footer from "@/components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const carouselImages = [
  require("../../assets/landingpage/mech_1.jpg"),
  require("../../assets/landingpage/mech_2.jpg"),
];

const LandingPage = () => {
  const { isDesktop } = useScreenWidth();
  const [mechanicLimit, setMechanicLimit] = useState(0);
  const [machineLimit, setMachineLimit] = useState(0);
  const [mechanicCount, setMechanicCount] = useState(0);
  const [machineCount, setMachineCount] = useState(0);
  const { getJsonApi } = useApi();

  const getCounts = useCallback(async () => {
    try {
      const response = await getJsonApi("api/landingPage", "application/json", {
        secure: false,
      });
      if (response.status === 200) {
        const mech = response?.data?.data?.mechanicCount || 0;
        const mach = response?.data?.data?.industryCount || 0;
        setMechanicLimit(mech);
        setMachineLimit(mach);
      }
    } catch (err) {
      console.log(err);
    }
  }, [getJsonApi]);

  useEffect(() => {
    getCounts();
  }, []);

  useEffect(() => {
    if (mechanicCount < mechanicLimit) {
      const t = setTimeout(
        () => setMechanicCount((p) => (p + 1 > mechanicLimit ? mechanicLimit : p + 1)),
        20
      );
      return () => clearTimeout(t);
    }
  }, [mechanicCount, mechanicLimit]);

  useEffect(() => {
    if (machineCount < machineLimit) {
      const t = setTimeout(
        () => setMachineCount((p) => (p + 1 > machineLimit ? machineLimit : p + 1)),
        20
      );
      return () => clearTimeout(t);
    }
  }, [machineCount, machineLimit]);

  const Step = ({ icon, title, description }) => (
    <View style={styles.stepBox}>
      <Text style={styles.stepIcon}>{icon}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{description}</Text>
    </View>
  );

  const Arrow = () => <Text style={styles.arrow}>{isDesktop ? "➡️" : "⬇️"}</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ backgroundColor: "#f8fafc" }}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Machine Streets</Text>
        </View>

        {/* Hero */}
        <View style={styles.mainContainer}>
          <View
            style={[
              styles.heroRow,
              { flexDirection: isDesktop ? "row" : "column" },
            ]}
          >
            {/* Text */}
            <View style={styles.heroTextBox}>
              <Text style={styles.heroTitle}>
                Find Professional Mechanics Across All Industries
              </Text>
              <Text style={styles.heroSubtitle}>
                Machine Street connects you with verified mechanics for automotive,
                industrial, marine, agricultural, and more. Browse our directory,
                view profiles, and contact the right expert for your needs—quickly and easily.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push("/HomePage")}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>Get Started</Text>
              </TouchableOpacity>
            </View>

            {/* Carousel */}
            <View style={styles.heroCarousel}>
              <Carousel
                loop
                autoPlay
                autoPlayInterval={3000}
                width={!isDesktop ? width * 0.9 : width * 0.45}
                height={!isDesktop ? width * 0.55 : width * 0.3}
                data={carouselImages}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                  <View style={styles.carouselItem}>
                    <Image
                      source={item}
                      style={styles.carouselImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatBox value={`${mechanicCount}+`} label="Mechanics Listed" />
            <StatBox value={`${machineCount}+`} label="Industries Covered" />
            <StatBox value="24/7" label="Support" />
          </View>

          {/* How It Works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View
              style={[
                styles.stepsRow,
                { flexDirection: isDesktop ? "row" : "column" },
              ]}
            >
              <Step icon="🔍" title="Search" description="Find mechanics by industry, location, or specialty." />
              <Arrow />
              <Step icon="📄" title="View Profiles" description="Check detailed profiles, ratings, and skills." />
              <Arrow />
              <Step icon="🤝" title="Connect" description="Contact mechanics directly and get your job done." />
            </View>
          </View>
        </View>

        {Platform.OS === "web" && <Footer />}
      </ScrollView>
    </SafeAreaView>
  );
};

const StatBox = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a2236",
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f5c242",
    letterSpacing: 1.2,
  },
  mainContainer: {
    paddingTop: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  heroRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    paddingHorizontal: 16,
  },
  heroTextBox: {
    flex: 1,
    marginBottom: 20,
    alignSelf: "flex-start", // ✅ keep to the left
    width: "100%",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a2236",
    marginBottom: 12,
    textAlign: "left", // ✅ left aligned
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 16,
    lineHeight: 24,
    textAlign: "left", // ✅ left aligned
  },
  primaryBtn: {
    backgroundColor: "#2095A2",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start", // ✅ button aligned left
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  heroCarousel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: height * 0.05, // ✅ adaptive space for small screens
  },
  carouselItem: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    margin: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minWidth: 120,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2095A2",
  },
  statLabel: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
    textAlign: "center",
  },
  stepsRow: {
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    minWidth: "100%",
  },
  stepBox: {
    alignItems: "center",
    backgroundColor: "#f3f6fb",
    borderRadius: 14,
    padding: 16,
    margin: 8,
    height: 140,
    minWidth: width >= 1024 ? 260 : "100%",
  },
  stepIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    opacity: 0.9,
  },
  section: {
    marginTop: 32,
    padding: 22,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a2236",
    marginBottom: 18,
  },
  arrow: {
    fontSize: 28,
    marginHorizontal: 10,
    marginVertical: 6,
    color: "#1a2236",
  },
});

export default LandingPage;
