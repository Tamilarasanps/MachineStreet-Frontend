import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import IndustyLineup from "./IndustryLineUp";
import SubCategory from "./SubCategory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import useSubCategoryHandlers from "../hooks/useSubCategoryHandlers";
import Mobile from "../screens/(auth)/(SignIn)/Mobile";
import Location from "../screens/(Homepage)/Location";
import { Animated } from "react-native";
import { useRef } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EditProfile = ({
  modalVisible,
  setModalVisible,
  mechanicDetails,
  setMechanicDetails,
  subCategories,
  setSubCategories,
  page,
  setStep,
  username,
  setUsername,
  formSubmit,
}) => {
  const { getJsonApi, pathchApi } = useApi();
  const [phoneNumber, setPhoneNumber] = useState(
    mechanicDetails?.contact.number
  );
  const [industrySuggetion, setIndustrySuggestion] = useState([]);
  const [categorySuggetion, setCategorySuggestion] = useState([]);
  const [subcategorySuggetion, setSubCategorySuggestion] = useState([]);
  const [selectedCode, setSelectedCode] = useState(
    mechanicDetails?.contact?.countryCode
  );

  const [location, setLocation] = useState({
    coords: "",
    country: "India",
    region: "",
    district: "",
  });

  const [serviceInput, setServiceInput] = useState(""); // New

  const {
    handleAddSubCategory,
    handleDeleteSubCategory,
    handleAddBrand,
    handleDeleteBrand,
    handleSubCategoryChange,
    handleBrandChange,
  } = useSubCategoryHandlers(subCategories, setSubCategories);

  useEffect(() => {
    fetchIndustries();
  }, []);

  async function fetchIndustries() {
    try {
      const data = await getJsonApi(`CategoryPage`);
      if (data.status === 200)
        setIndustrySuggestion(data.data.industries.industries);
    } catch (err) {
      console.log(err);
    }
  }

  const getCategory = async () => {
    try {
      if (mechanicDetails.industry?.length > 0) {
        const data = await getJsonApi(
          `CategoryPage/${mechanicDetails.industry}/sell`
        );
        // console.log("category suggestion", data);
        setCategorySuggestion(data.data.categoryNames);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getSubCategory = async (index) => {
    try {
      if (mechanicDetails.subcategory[index]?.name.length > 0) {
        const data = await getJsonApi(
          `CategoryPage/subCategoryPage/${mechanicDetails.subcategory[index].name}/sell`
        );
        console.log('setSubCategorySuggestion :',data)

        setSubCategorySuggestion(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (key, value) => {
    setMechanicDetails((prev) => ({ ...prev, [key]: value }));
  };
  // console.log('mechanicDetails :', mechanicDetails)
  // console.log('location :', location)
  // console.log('phoneNumber :', phoneNumber)
  // console.log('count :', selectedCode)
  const handleSubmit = async () => {
    if (
      !mechanicDetails.organization ||
      !mechanicDetails.industry ||
      !subCategories ||
      mechanicDetails.services.length === 0 ||
      !phoneNumber?.trim() ||
      // !String(location?.coords || "").trim() ||
      !String(location?.region || "").trim() ||
      !String(location?.country || "").trim()
    ) {
      Toast.show({
        type: "error",
        text1: "failed!",
        text2: "All fields are required", // Your dynamic message here
        position: "top", // not "placement"
        visibilityTime: 2000, // instead of "duration"
      });
      return; // stop further execution
    }

    // Update mechanicDetails with location and contact
    const updatedDetails = {
      ...mechanicDetails,
      location: JSON.stringify(location),
      contact: {
        number: phoneNumber,
        countryCode: selectedCode,
      },
      subCategories: subCategories,
    };

    setMechanicDetails(updatedDetails);
    setModalVisible(false);
    setStep(1);

    if (page === "profile") {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const result = await pathchApi(
          "mechanicList/editprofile",
          updatedDetails,
          token
        );
        // console.log("Profile updated:", result);
        Toast.show({
          type: "success",
          text1: "Profile updated!",
          position: "top",
          visibilityTime: 2000,
          animation: "slide",
        });
      } catch (err) {
        // console.error("Edit profile error:", err);
        Toast.show({
          type: "error",
          text1: "Failed to update profile",
          position: "top",
          visibilityTime: 3000,
          animation: "slide",
        });
      }
    }
  };

  const handleAddService = () => {
    if (serviceInput.trim()) {
      setMechanicDetails((prev) => ({
        ...prev,
        services: [...prev.services, serviceInput.trim()],
      }));
      setServiceInput("");
    }
  };

  const handleRemoveService = (serviceToRemove) => {
    setMechanicDetails((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== serviceToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (Platform.OS === "web" && e.key === "Enter") {
      handleAddService();
      // nextref?.current?.focus();
    }
  };
  // console.log(mechanicDetails);

  const slideAnim = useRef(new Animated.Value(-20)).current; // start above the view
  const opacityAnim = useRef(new Animated.Value(0)).current; // optional: fade in too

  useEffect(() => {
    if (mechanicDetails.industry) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(-20); // reset position
      opacityAnim.setValue(0); // reset opacity
    }
  }, [mechanicDetails.industry]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 pt-16 "
      >
        <View style={styles.modalContainer}>
          <View className="w-full flex  items-end ">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="right-4 mb-4 "
            >
              <Icon name="close" size={24} color="#374151" />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            className="h-screen mb-10"
          >
            {/* <Toast /> */}
            {mechanicDetails.hasOwnProperty("username" && "bio") && (
              <>
                <Text className="text-lg font-bold mb-4 text-gray-800">
                  Personal Information
                </Text>

                <TextInput
                  placeholder="Username"
                  className="w-full h-12 border border-gray-300 rounded-md px-3 mb-4"
                />
                <TextInput
                  placeholder="Bio"
                  className="w-full h-12 border border-gray-300 rounded-md px-3 mb-8"
                />
              </>
            )}

            <Text className="text-lg font-bold mb-3 text-gray-800">
              Professional Information
            </Text>

            {/* <Text className="text-lg font-semibold text-teal-600 mt-6">
              UserName
            </Text>
            <TextInput
              className="w-full mt-4 h-12 border border-gray-300 rounded-md px-3 "
              placeholder="Enter Your name"
              value={username}
              onChangeText={setUsername}
            /> */}
            <Text className="text-lg font-semibold text-teal-600 mt-6">
              Organization Name
            </Text>
            <TextInput
              className="w-full mt-4 h-12 border border-gray-300 rounded-md px-3 "
              placeholder="Enter organization name"
              value={mechanicDetails.organization}
              onChangeText={(value) => handleChange("organization", value)}
            />

            <View className=" mt-4 rounded-md p-4 z-50 bg-gray-100">
              {/* <View className="bg-gray-100 p-4 mt-4 rounded-md z-50">  */}
              <View className="z-50">
                <IndustyLineup
                  handleChange={handleChange}
                  data={industrySuggetion}
                  label="Industry"
                  value={mechanicDetails.industry}
                  onChange={(value) => handleChange("industry", value)}
                />
              </View>

              {mechanicDetails.industry && (
                <Animated.View
                  style={{
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                  }}
                  className="z-50 mt-2"
                >
                  <SubCategory
                    labels={["category", "services"]}
                    subCategories={subCategories}
                    setSubCategories={setSubCategories}
                    handleAddSubCategory={handleAddSubCategory}
                    handleDeleteSubCategory={handleDeleteSubCategory}
                    handleAddBrand={handleAddBrand}
                    handleDeleteBrand={handleDeleteBrand}
                    handleSubCategoryChange={handleSubCategoryChange}
                    handleBrandChange={handleBrandChange}
                    getCategory={getCategory}
                    getSubCategory={getSubCategory}
                    categorySuggetion={categorySuggetion}
                    subcategorySuggetion={subcategorySuggetion}
                  />
                </Animated.View>
              )}
            </View>
            {/* </View> */}

            {/* Services Section */}
            <Text className="text-lg font-semibold text-teal-600 mt-6">
              Specialization / Services
            </Text>
            <View
              style={{ flexDirection: "row", marginBottom: 8 }}
              className="mt-4 w-full flex items-center justify-center mx-auto h-12"
            >
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginRight: 8, height: "100%" },
                ]}
                placeholder="Enter service"
                value={serviceInput}
                onChangeText={setServiceInput}
                onKeyPress={handleKeyPress}
              />
              <TouchableOpacity
              className="px-4"
                style={{
                  backgroundColor: "#111827",
                  borderRadius: 8,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleAddService}
              >
                <Text className="text-xs" style={{ color: "#fff" }}>Add</Text>
              </TouchableOpacity>
            </View>
            {mechanicDetails.services.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                {mechanicDetails.services.map((service, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#F3F4F6",
                      padding: 10,
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  >
                    <Text>{service}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveService(service)}
                    >
                      <Icon name="close" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View className="z-40 w-full ">
              <Text className="text-lg font-semibold text-teal-600 mt-6">
                Contact
              </Text>
              <Mobile
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                selectedCode={selectedCode}
                setSelectedCode={setSelectedCode}
              />
            </View>
            {
              <View className="z-40">
                <Location location={location} setLocation={setLocation} />
              </View>
            }

            <Pressable
              onPress={handleSubmit}
              className="bg-black py-4 rounded-md items-center mt-4 mb-4"
            >
              <Text className="text-white font-semibold ">
                {mechanicDetails.hasOwnProperty("username" && "bio")
                  ? "Update"
                  : "Save"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    // flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    // justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: screenWidth > 768 ? 500 : "90%",
    maxHeight: screenHeight * 0.8,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
};

export default EditProfile;
