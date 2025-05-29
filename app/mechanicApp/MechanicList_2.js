import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GetMechanic from "../hooks/GetMechanic";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FilterComponent from "./Filter";
import useApi from "../hooks/useApi";
import ReviewModal from "./ReviewModal";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import { useNavigation } from "expo-router";
import Header from "../component/(header)/Header";
import { Modal } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { BlurView } from "expo-blur";
import QrModal from "./QrModal";

const MechanicList_2 = () => {
  const { width } = useWindowDimensions();

  const {
    mechanics,
    setMechanics,
    industries,
    categories,
    location,
    page,
    setPage,
    totalPages,
    setOtherThanIndiaLocation,
    otherThanIndiaLocation,
    setTotalPages,
    qr,
    setQr,
  } = GetMechanic();
  const isSmallScreen = width < 768;
  const isMediumScreen = width >= 768 && width < 1024;
  const isLargeScreen = width > 1024;
  const { postJsonApi, getJsonApi } = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // const [showServiceModal, setShowServiceModal] = useState(false);
  // const [showServiceModalId, setShowServiceModalId] = useState(null);
  const [mechanicSearchResults, setMechanicSearchResults] = useState([]);
  // console.log("mecha", mechanicSearchResults);
  const [searchBar, setSearchBar] = useState("");
  const [authUser] = useContext(AuthContext);
  const [expandedMechanicId, setExpandedMechanicId] = useState(null);
  // console.log("expa", expandedMechanicId);
  const [viewMoreModalVisible, setViewMoreModalVisible] = useState(false);
  // filter options

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedServices, setSelectedServices] = useState("");
  const [selectedRating, setSelectedRating] = useState();
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  // review section

  const [reviewPopUp, setReviewPopup] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]); // Modal visibility state
  const [rating, setRating] = useState(0); // Rating state
  const [reviewText, setReviewText] = useState(""); // Review text state
  const [selectedMech, setSelectedMech] = useState(null);
  const [otherThanIndia, setOtherThanIndia] = useState(false);
  let dataToMap = otherThanIndia ? otherThanIndiaLocation : location;

  // sumbit reviews
  const navigation = useNavigation();

  useEffect(() => {
    authcheck();
  }, []);

  async function authcheck() {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      router.push("/screens/Login");
    }
  }

  const handleReviewSubmit = async () => {
    const userReview = {
      star: rating,
      reviewText: reviewText,
      mechId: selectedMech,
    };
    try {
      const token = await AsyncStorage.getItem("userToken");
      const result = await postJsonApi(
        `mechanicList/postReview`,
        userReview,
        token
      );
      if (result.status === 200) {
        setRating(0);
        setReviewText("");
        setReviewPopup(false);
      } else {
        // console.warn("Failed to submit review", result);
      }
    } catch (err) {
      console.error("Error posting review:", err);
    }
  };

  // fectchReviews

  async function fectchReviews() {
    try {
      const token = AsyncStorage.getItem("userToken"); // Missing await
      const result = await getJsonApi(
        `mechanicList/getReviews/${selectedMech}`,
        token
      );
      if (result.status === 200) setReviews(result.data);
    } catch (err) {
      console.log(err);
    }
  }
  industries;
  useEffect(() => {
    if (reviewModal) {
      fectchReviews();
    }
  }, [reviewModal, selectedMech]);

  function openDialer(mechanic) {
    const { countryCode, number } = mechanic.contact || {};
    if (countryCode && number) {
      // Dial the phone number with the country code
      const phoneNumber = `${countryCode}${number}`;
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.log("No contact number available");
    }
  }

  const filteredMechanics = mechanics.filter((mechanic) => {
    const matchesIndustry = selectedIndustry
      ? mechanic.industry === selectedIndustry
      : true;

    const matchesCategory = selectedCategory
      ? mechanic.category === selectedCategory
      : true;

    const matchesSubCategory = selectedSubCategory
      ? mechanic.subcategory === selectedSubCategory
      : true;

    const matchesServices = selectedServices
      ? mechanic.services === selectedServices
      : true;

    const matchesState = selectedState
      ? otherThanIndia
        ? mechanic.country === selectedState
        : mechanic.region === selectedState
      : true;

    const matchesDistrict =
      selectedDistrict.length > 0
        ? selectedDistrict.includes(
            otherThanIndia ? mechanic.region : mechanic.district
          )
        : true;

    const matchesRating = selectedRating
      ? mechanic.averageRating >= selectedRating
      : // &&
        //   mechanic.averageRating < selectedRating + 1
        true;

    return (
      matchesIndustry &&
      matchesCategory &&
      matchesSubCategory &&
      matchesServices &&
      matchesState &&
      matchesDistrict &&
      matchesRating
    );
  });
  const handleProfileNavigation = async (id) => {
    const token = await AsyncStorage.getItem("userToken");

    if (Platform.OS === "web") {
      if (!token) {
        router.push("/screens/Login");
      } else {
        router.push(`/screens/ProfilePage/?id=${id}&page=uservisit`, {
          state: { page: "uservisit" },
        });
      }
    } else {
      router.push(`/screens/ProfilePage/?id=${id}&page=uservisit`, {
        state: { page: "uservisit" },
      });
    }
  };

  console.log("qr", qr);
  return (
    <>
      <Header
        mechanicSearchResults={mechanicSearchResults}
        setMechanicSearchResults={setMechanicSearchResults}
        searchBar={searchBar}
        setSearchBar={setSearchBar}
        page="mechanic"
      />
      {width < 1024 && (
        <Pressable onPress={() => setIsOpen(!isOpen)}>
          <Octicons
            name="filter"
            size={24}
            color="black"
            className="ml-2 mt-2"
          />
        </Pressable>
      )}

      <ScrollView className="w-screen min-h-screen flex flex-rrow bg-gray-100 px-2 pb-6 ">
        {/* {qr && <QrModal visible={qr} onClose={() => setQr(true)} />} */}
        <View
          className={`flex flex-row rounded-sm mt-5 min-h-screen  gap-2 mb-48`}
          style={{ zIndex: -1 }}
        >
          {(width >= 1024 || isOpen) && (
            <View className={`${width < 1024 ? "absolute z-50 w-[50%]" : ""} `}>
              <FilterComponent
                page="mech"
                industries={industries}
                categories={categories}
                location={location}
                otherThanIndia={otherThanIndia}
                setOtherThanIndia={setOtherThanIndia}
                dataToMap={dataToMap}
                // setSelectedPriceType={setSelectedPriceType}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                setIsOpen={setIsOpen}
                selectedDistricts={selectedDistricts}
                setSelectedDistricts={setSelectedDistricts}
                setOtherThanIndiaLocation={setOtherThanIndiaLocation}
                otherThanIndiaLocation={otherThanIndiaLocation}
              />
            </View>
          )}
          <ScrollView
            className={`${
              isOpen ? "w-[80%]" : "w-full"
            }   mb-4 transition-all `}
            style={{ minHeight: "100%", maxHeight: "100%" }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Modal
              visible={viewMoreModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setViewMoreModalVisible(false)}
            >
              <BlurView intensity={50} tint="light" style={{ flex: 1 }}>
                <View className="flex-1 justify-center items-center   ">
                  <View
                    className="bg-gray-300 rounded-xl p-6 max-h-[80%] "
                    style={{ width: isLargeScreen ? "40%" : "90%" }}
                  >
                    <ScrollView>
                      {/* Show full content of selected mechanic */}
                      {mechanicSearchResults
                        ?.concat(filteredMechanics)
                        .find((mech) => mech._id === expandedMechanicId)
                        ?.subcategory?.map((sub, subIndex) => (
                          <View key={subIndex} className="mb-4">
                            <Text className="font-bold text-lg mb-1">
                              {sub.name.charAt(0).toUpperCase() +
                                sub.name.slice(1)}
                              :
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                              {sub.services.map((service, idx) => (
                                <Text
                                  key={idx}
                                  className="bg-gray-200 px-3 py-1 rounded-full"
                                >
                                  {service.charAt(0).toUpperCase() +
                                    service.slice(1)}
                                </Text>
                              ))}
                            </View>
                          </View>
                        ))}

                      <Text className="text-lg font-bold mt-4">Services:</Text>
                      <View className="flex-row flex-wrap gap-2 mt-2">
                        {mechanicSearchResults
                          .concat(filteredMechanics)
                          .find((mech) => mech._id === expandedMechanicId)
                          ?.services?.map((service, index) => (
                            <Text
                              key={index}
                              className="bg-yellow-500 px-2 py-1 rounded-sm font-semibold text-md text-black"
                            >
                              {service.charAt(0).toUpperCase() +
                                service.slice(1)}
                            </Text>
                          ))}
                      </View>
                    </ScrollView>

                    <Pressable
                      className="mt-4 self-end"
                      onPress={() => setViewMoreModalVisible(false)}
                    >
                      <Text className="text-blue-600 font-bold">Close</Text>
                    </Pressable>
                  </View>
                </View>
              </BlurView>
            </Modal>

            <Pressable
              className={`${
                isOpen ? "w-full" : "w-full"
              } flex flex-wrap justify-between cursor-pointer ${
                Platform.OS === "web" ? "mb-24" : "mb-48"
              }`}
              style={{
                flexDirection:
                  isSmallScreen || isMediumScreen ? "column" : "row",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {searchBar.length > 4 && mechanicSearchResults.length === 0 ? (
                <View className="h-screen w-screen flex justify-center items-center">
                  <Text className="text-bold color-grey-300">
                    No results Found
                  </Text>
                </View>
              ) : (
                (mechanicSearchResults.length > 0 && searchBar.length > 0
                  ? mechanicSearchResults
                  : filteredMechanics
                ).map((mechanic) => (
                  <Pressable
                    onPress={() => {
                      handleProfileNavigation(mechanic._id);
                    }}
                    key={mechanic._id}
                    className="items-center mb-6"
                    style={{
                      width: isSmallScreen
                        ? "100%"
                        : isMediumScreen
                        ? "100%"
                        : "49%",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      className="overflow-hidden rounded-xl bg-white shadow mb-10"
                      style={{
                        flexDirection: isSmallScreen ? "column" : "row",
                        height: isSmallScreen ? undefined : 400,
                        width: "100%",
                      }}
                    >
                      {/* Left Side */}
                      <LinearGradient
                        colors={["#6B7280", "#FAFAFA"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: isSmallScreen ? "100%" : "40%",
                          height: isSmallScreen ? 220 : "100%",
                          paddingTop: 16,
                          paddingBottom: 16,
                          borderTopLeftRadius: 16,
                          borderBottomLeftRadius: isSmallScreen ? 0 : 16,
                          borderTopRightRadius: isSmallScreen ? 16 : 0,
                        }}
                      >
                        <View className="h-full w-full items-center justify-center ">
                          <View className="bg-gray-200 rounded-full overflow-hidden shadow-md z-10">
                            <Image
                              source={{
                                uri: `data:image/jpeg;base64,${mechanic.profileImage}`,
                              }}
                              resizeMode="cover"
                              style={{
                                width: 150,
                                height: 150,
                                borderRadius: 75,
                              }}
                            />
                          </View>
                          <Text
                            className="mt-2 text-lg font-extrabold"
                            style={{ color: "#6B7280" }}
                          >
                            {mechanic.username}
                          </Text>
                        </View>
                      </LinearGradient>

                      {/* Right Side */}
                      <View
                        className="bg-white px-4 py-4 "
                        style={{
                          width: isSmallScreen ? "100%" : "60%",
                          flex: 1,
                        }}
                      >
                        <Text
                          className="text-lg font-bold"
                          style={{ flexShrink: 1 }}
                        >
                          {mechanic.organization}
                        </Text>
                        <Text className="font-bold mt-4">
                          {mechanic.industry?.charAt(0).toUpperCase() +
                            mechanic.industry.slice(1)}
                        </Text>
                        <View className="bg-gray-100 p-2 mt-2">
                          <View className=" flex flex-row">
                            <View className="w-max">
                              <Text>{mechanic.subcategory[0].name} :</Text>
                            </View>

                            {/* {layout <= 100 ? (
                              <View
                                className="flex flex-row"
                                onLayout={(e) =>
                                  setLayout(e.nativeEvent.layout.width)
                                }
                              >
                                {mechanic.subcategory[0].services.map(
                                  (services, index) => (
                                    <Text key={index} className="ml-2">
                                      {services}
                                    </Text>
                                  )
                                )}
                              </View> */}
                            {/* ) : ( */}
                            <View className="flex flex-row">
                              <Text className="ml-2">
                                {mechanic.subcategory[0].services[0].slice(
                                  0,
                                  25
                                )}{" "}
                                ...
                              </Text>
                            </View>

                            {/* )} */}
                          </View>

                          {/* {layout > 180 && ( */}
                          <TouchableWithoutFeedback
                            onPress={() => {
                              setExpandedMechanicId(mechanic._id);
                              setViewMoreModalVisible(true);
                            }}
                            className="mt-2 bg-yellow-500 p-3 rounded-md"
                          >
                            <Text className="hover:underline font-semibold mt-2">
                              View more
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                        <Text className="font-bold mt-4">Specialization</Text>
                        <View className="bg-gray-100 p-2 mt-2 ">
                          <View>
                            <Text>
                              {mechanic?.services[0]?.length > 25
                                ? `${mechanic.services[0].substring(0, 25)}...`
                                : `${mechanic.services[0]} ...`}
                            </Text>
                          </View>
                          <TouchableWithoutFeedback
                            className=" hover:underline"
                            onPress={() => {
                              setExpandedMechanicId(mechanic._id);
                              setViewMoreModalVisible(true);
                            }}
                          >
                            <Text className="hover:underline font-semibold mt-2">
                              View more
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                        <View className="flex-row items-center mt-4">
                          <FontAwesome
                            name="map-marker"
                            size={18}
                            color="black"
                          />
                          <Text
                            className="ml-2 font-semibold text-sm"
                            style={{ flexShrink: 1 }}
                          >
                            {mechanic.district}
                          </Text>
                        </View>
                        <View className="flex-row mt-2">
                          {Platform.OS === "web" ? (
                            <FontAwesome
                              name="phone"
                              size={20}
                              color="#2095A2"
                              style={{ marginTop: "8px", marginRight: 7 }}
                            />
                          ) : (
                            ""
                          )}

                          {Platform.OS === "web" ? (
                            <Text
                              className="text-md font-semibold mt-2"
                              style={{ flexShrink: 1 }}
                            >
                              Contact: {mechanic.contact?.countryCode}{" "}
                              {mechanic.contact?.number}
                            </Text>
                          ) : (
                            // filteredMechanics.map((mechanic) => (
                            <View className="flex flex-row items-center gap-4">
                              <Text
                                className="text-md font-semibold mt-2"
                                style={{ flexShrink: 1 }}
                              >
                                Contact: {mechanic.contact?.countryCode}{" "}
                                {mechanic.contact?.number}
                              </Text>
                              <Pressable
                                className=" h-10  w-[100px] bg-TealGreen rounded-sm justify-center items-center mt-2"
                                // onPress={openDailer}
                                key={mechanic.id}
                                onPress={() => openDialer(mechanic)}
                              >
                                <Text className="text-white text-lg">Call</Text>
                              </Pressable>
                            </View>

                            // ))
                          )}
                        </View>
                        <View className="flex-row gap-4 items-center mt-4">
                          {mechanic?.averageRating ? (
                            <>
                              <View className="bg-green-600 px-3 py-1 rounded-lg flex-row gap-2 items-center">
                                <Text className="text-white font-bold text-base">
                                  {mechanic.averageRating}
                                </Text>
                                <FontAwesome
                                  name="star"
                                  size={16}
                                  color="white"
                                />
                              </View>
                              <Pressable
                                onPress={() => {
                                  setSelectedMech(mechanic._id);
                                  setReviewModal(true);
                                }}
                              >
                                <Text>See all reviews</Text>
                              </Pressable>
                            </>
                          ) : (
                            <View
                              pointerEvents="box-none"
                              className="flex flex-row gap-4"
                            >
                              <Text>No Reviews Yet</Text>
                              <Pressable
                                onPress={() => {
                                  setSelectedMech(mechanic._id);
                                  setReviewModal(true);
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
                    </View>
                  </Pressable>
                ))
              )}
            </Pressable>
            <View className="flex flex-row justify-between px-2">
              <View>
                <Text>
                  Page {page} of {totalPages}
                </Text>
              </View>
              <View className="flex flex-row gap-8">
                <Pressable
                  disabled={page === totalPages}
                  onPress={() => {
                    console.log("triggered");
                    setPage(page + 1);
                  }}
                >
                  <Text className="font-semibold cursor-pointer">Next</Text>
                </Pressable>
                <Pressable
                  disabled={page === 1}
                  onPress={() => setPage(page - 1)}
                >
                  <Text className="font-semibold cursor-pointer">Prev</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {reviewModal && (
            <ReviewModal
              reviewPopUp={reviewPopUp}
              setReviewPopup={setReviewPopup}
              handleReviewSubmit={handleReviewSubmit}
              setRating={setRating}
              setReviewText={setReviewText}
              rating={rating}
              reviewText={reviewText}
              reviews={reviews}
              onClose={() => setReviewModal(false)}
              setMechanics={setMechanics}
              selectedMech={selectedMech}
              setReviews={setReviews}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default MechanicList_2;
