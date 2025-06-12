import { router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "expo-router";
import useApi from "../hooks/useApi";

const { width } = Dimensions.get("window");

const LandingPage = () => {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const isMobile = windowWidth < 600;

  // Actual counts fetched from API
  const [mechanicLimit, setMechanicLimit] = useState(0);
  const [machineLimit, setMachineLimit] = useState(0);

  // Running counts displayed on screen
  const [mechanicCount, setMechanicCount] = useState(0);
  const [machineCount, setMachineCount] = useState(0);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const navigation = useNavigation();

  const { getJsonApi } = useApi();

  const getCounts = useCallback(async () => {
    try {
      const response = await getJsonApi("landingPage/");
      if (response.status === 200) {
        const mech = response?.data?.data?.mechanicCount || 0;
        const mach = response?.data?.data?.machineCount || 0;
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

  // Effect to animate mechanicCount from 0 to mechanicLimit
  useEffect(() => {
    if (mechanicCount < mechanicLimit) {
      const timer = setTimeout(() => {
        setMechanicCount((prev) =>
          prev + 1 > mechanicLimit ? mechanicLimit : prev + 1
        );
      }, 30); // Adjust speed here (lower is faster)
      return () => clearTimeout(timer);
    }
  }, [mechanicCount, mechanicLimit]);

  // Effect to animate machineCount from 0 to machineLimit
  useEffect(() => {
    if (machineCount < machineLimit) {
      const timer = setTimeout(() => {
        setMachineCount((prev) =>
          prev + 1 > machineLimit ? machineLimit : prev + 1
        );
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [machineCount, machineLimit]);

  const StepWithArrow = ({
    icon,
    title,
    description,
    isLast,
    isHorizontal,
  }) => {
    const { width: screenWidth } = Dimensions.get("window");
    const isMobile = Platform.OS !== "web" || screenWidth < 768;

    return (
      <View
        style={{
          flexDirection: isHorizontal && !isMobile ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          width: isMobile ? "100%" : 450,
          marginBottom: 16,
        }}
        className=""
      >
        <Step icon={icon} title={title} description={description} />
        {!isLast && (
          <Text
            style={{
              fontSize: 24,
              marginHorizontal: isHorizontal && !isMobile ? 12 : 0,
              marginVertical: !isHorizontal || isMobile ? 8 : 0,
            }}
          >
            {isHorizontal && !isMobile ? "➡️" : "⬇️"}
          </Text>
        )}
      </View>
    );
  };

  const Step = ({ icon, title, description }) => (
    <View style={styles.stepBox}>
      <Text style={styles.stepIcon}>{icon}</Text>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ backgroundColor: "#f8fafc" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>Machine Street</Text>
        </View>

        {/* main container */}

        <View style={styles.mainContainer}>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              marginTop: 32,
              paddingHorizontal: 16,
              gap: 20,
            }}
          >
            <View style={{ flex: 1, marginBottom: isMobile ? 24 : 0 }}>
              <Text style={styles.heroTitle}>
                Find Professional Mechanics Across All Industries
              </Text>
              <Text style={styles.heroSubtitle}>
                Machine Street connects you with verified mechanics for
                automotive, industrial, marine, agricultural, and more. Browse
                our directory, view profiles, and contact the right expert for
                your needs-quickly and easily.
              </Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => {
                    Platform.OS === "web"
                      ? router.push("/mechanicApp/MechanicList_2")
                      : navigation.navigate("MechanicProfiles");
                  }}
                >
                  <Text style={styles.primaryBtnText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Image
              source={require("../assests/machine/mechimg.jpg")}
              style={{
                width: isMobile ? width * 0.9 : width * 0.42,
                height: isMobile ? width * 0.5 : width * 0.28,
                borderRadius: 18,
                shadowColor: "#000",
                shadowOpacity: 0.12,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
              }}
              resizeMode="cover"
            />
          </View>
          {/* Stats */}
          <View style={styles.statsRow}>
            <StatBox
              value={`${mechanicCount > 0 ? mechanicCount + "+" : "-"}`}
              label="Mechanics Listed"
            />
            <StatBox
              value={`${machineCount > 0 ? machineCount + "+" : "-"}`}
              label="Industries Covered"
            />
            <StatBox value="24/7" label="Support" />
          </View>

          {/* How It Works */}
          <View style={styles.section} className="h-screen">
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View
              style={{
                flexDirection:
                  Platform.OS === "web" && windowWidth >= 1024
                    ? "row"
                    : "column",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                paddingHorizontal: 8,
              }}
            >
              <StepWithArrow
                icon="🔍"
                title="Search"
                description="Find mechanics by industry, location, or specialty."
                isLast={false}
                isHorizontal={Platform.OS === "web" && windowWidth >= 1024}
              />
              <StepWithArrow
                icon="📄"
                title="View Profiles"
                description="Check detailed profiles, ratings, and skills."
                isLast={false}
                isHorizontal={Platform.OS === "web" && windowWidth >= 1024}
              />
              <StepWithArrow
                icon="🤝"
                title="Connect"
                description="Contact mechanics directly and get your job Done."
                isLast={true}
                isHorizontal={Platform.OS === "web" && windowWidth >= 1024}
              />
            </View>
          </View>
        </View>
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
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  brand: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f5c242",
    letterSpacing: 1.2,
  },
  mainContainer: {
    paddingHorizontal: 0,
    paddingTop: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a2236",
    marginBottom: 14,
    marginTop: 12,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 16,
    textAlign: "left",
    lineHeight: 24,
    opacity: 0.93,
  },
  heroButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#2095A2",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    margin: 6,
    elevation: 3,
    shadowColor: "#1d4ed8",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 28,
    marginBottom: 18,
    flexWrap: "wrap",
    gap: 8,
    color: "#2095A2",
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
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2095A2",
    letterSpacing: 0.8,
  },
  statLabel: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },
  stepBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f3f6fb",
    borderRadius: 14,
    padding: 16,
    margin: 6,
    width: "300px",
    height: "150px",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  stepIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  stepDesc: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    opacity: 0.9,
    marginTop: 2,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 12,
    paddingVertical: 22,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a2236",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.6,
  },
});
export default LandingPage;
