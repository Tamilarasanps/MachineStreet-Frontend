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
import { useToast } from "react-native-toast-notifications";
import IndustyLineup from "./IndustryLineUp";
import SubCategory from "./SubCategory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import useSubCategoryHandlers from "../hooks/useSubCategoryHandlers";
import Mobile from "../screens/(auth)/(SignIn)/Mobile";
import Location from "../screens/(Homepage)/Location";
import { KeyboardAvoidingView } from "react-native";

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
}) => {
  const toast = useToast();
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
      mechanicDetails.services.length===0 ||
      !phoneNumber?.trim() ||
      // !String(location?.coords || "").trim() ||
      !String(location?.region || "").trim() ||
      !String(location?.country || "").trim()
    ) {
      toast.show("All fields are required!", {
        type: "danger",
        placement: "top",
        duration: 3000,
        animationType: "slide-in",
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
        toast.show("Profile updated!", {
          type: "success",
          placement: "top",
          duration: 3000,
          animationType: "slide-in",
        });
      } catch (err) {
        // console.error("Edit profile error:", err);
        toast.show("Failed to update profile", {
          type: "danger",
          placement: "top",
          duration: 3000,
          animationType: "slide-in",
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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
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
          >
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

            <Text className="text-lg font-semibold text-teal-600 mt-6">
              Organization Name
            </Text>
            <TextInput
              className="w-full mt-4 h-12 border border-gray-300 rounded-md px-3 "
              placeholder="Enter organization name"
              value={mechanicDetails.organization}
              onChangeText={(value) => handleChange("organization", value)}
            />

            <View className="z-50">
              <IndustyLineup
                handleChange={handleChange}
                data={industrySuggetion}
                label="Industry"
                value={mechanicDetails.industry}
                onChange={(value) => handleChange("industry", value)}
              />
            </View>

            <View className="z-10 mt-2 ">
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
            </View>

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
                style={{
                  backgroundColor: "#111827",
                  padding: 10,
                  borderRadius: 8,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleAddService}
              >
                <Text style={{ color: "#fff" }}>Add</Text>
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

            <View className="z-50 w-full ">
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
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
