import Filter from "@/components/FIlter";
import Header from "@/components/Header";
import UserCard from "@/components/UserCard";
import { useAppContext } from "@/context/AppContext";
import useApi from "@/hooks/useApi";
import useScreenWidth from "@/hooks/useScreenWidth";
import { useMemo } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SelectedFilter from "../FIlter/SelectedFIlters";
import ServiceModal from "../HomePage/ServiceModal";
import Modal_R from "../HomePage/Modal_R";
import QrModal from "../HomePage/QrModal";
import * as SecureStore from "expo-secure-store";
import Loading from "@/components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  const [filterItems, setFilterItems] = useState({
    selectedCategory: null,
    selectedIndustry: null,
    selectedSubCategory: [],
    selectedServices: null,
    selectedRating: null,
    selectedDistrict: [],
  });

  const {
    userDetails,
    setUserDetails,
    selectedMechanic,
    setSelectedMechanic,
    isLoading,
    userRole,filterData, setFIlterData,
  } = useAppContext();
  const { isDesktop, width, isTablet, isMobile, height } = useScreenWidth();
  const { getJsonApi, postJsonApi } = useApi();

  const [review, setReview] = useState({
    star: null,
    reviewText: null,
    userId: null,
  });
  const cache = useRef({}); // cache object
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const slideAnim = useState(new Animated.Value(-width))[0]; // start off-screen left
  const selectedFIlterAnim = useRef(new Animated.Value(0)).current;

  const [isOpen, setIsOpen] = useState(Platform.OS === "web" && width > 1024);
  const [shouldRenderFilter, setShouldRenderFilter] = useState(isOpen);

  const [serviceModal, setServiceModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [qr, setQr] = useState(true);
  // const [role, setRole] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);

  const getItem = async (key) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };
  // remove: const mechanicsCache = useRef(null);

const getmechanics = useCallback(async () => {
  try {
    const result = await getJsonApi(
      `homepage/getmechanics/?page=${page}&limit=50`,
      "application/json",
      { secure: true }
    );

    if (result?.status === 200) {
      setPage((prev) => prev + 1);
      setTotalPages(result?.data?.totalPages);

      // ✅ append with deduplication
      setUserDetails((prev) => {
        const combined = [...(prev || []), ...(result?.data?.userData || [])];
        return combined.filter(
          (item, index, arr) =>
            index === arr.findIndex((x) => x._id === item._id)
        );
      });

      setFIlterData(result?.data?.filterData);
      setQr(result.data.qr);
    }
  } catch (err) {
    console.log(err);
  }
}, [getJsonApi, page]);

useEffect(() => {
  if (!userDetails?.length) {
    getmechanics();
  }
}, []);

  // post review

  const postReview = useCallback(async () => {
    try {
      const result = await postJsonApi(
        "api/postReview",
        { review },
        "application/json",
        { secure: true }
      );

      if (result.status === 200) {
        setReview((prev) => ({
          ...prev,
          star: null,
          reviewText: null,
        }));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }, [review, postJsonApi]);

  // filter animation
  useEffect(() => {
    if (isOpen) {
      setShouldRenderFilter(true);
    }

    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      if (!isOpen) {
        setShouldRenderFilter(false);
      }
    });
  }, [isOpen]);

  // selected filter animation
  useEffect(() => {
    if (
      Object.values(filterItems).some((val) =>
        Array.isArray(val) ? val.length > 0 : val !== null
      )
    ) {
      Animated.timing(selectedFIlterAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(selectedFIlterAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [filterItems]);

  // filter mechanics

  const filteredMechanics = useMemo(() => {
    return (searchBarValue?.length > 0 ? searchResults : userDetails)?.filter(
      (mechanic) => {
        const {
          selectedCategory,
          selectedIndustry,
          selectedSubCategory,
          selectedRating,
          selectedDistrict,
          selectedState,
          otherThanIndia,
        } = filterItems;

        const matchesIndustry = selectedIndustry
          ? mechanic.industry === selectedIndustry
          : true;

        const matchesCategory = selectedCategory
          ? mechanic.subcategory?.some((sub) => sub.name === selectedCategory)
          : true;

        const matchesSubCategory = selectedSubCategory.length
          ? mechanic.subcategory?.some(
              (sub) =>
                sub.name === selectedCategory &&
                sub.services?.some((service) =>
                  selectedSubCategory.includes(service)
                )
            )
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
          : true;

        return (
          matchesIndustry &&
          matchesCategory &&
          matchesSubCategory &&
          matchesState &&
          matchesDistrict &&
          matchesRating
        );
      }
    );
  }, [
    searchResults,
    userDetails,
    filterItems.selectedCategory,
    filterItems.selectedIndustry,
    filterItems.selectedSubCategory,
    filterItems.selectedRating,
    filterItems.selectedDistrict,
    filterItems.selectedState,
    filterItems.otherThanIndia,
  ]);

  // search api

  const fetchSearchResult = async (page) => {
    const queryKey = `${searchBarValue}_${page}`; // unique cache key per query+page

    // ✅ Check cache first
    if (cache.current[queryKey]) {
      setSearchResults(cache.current[queryKey]);
      return;
    }

    try {
      const data = await getJsonApi(
        `api/search?searchQuery=${searchBarValue}&page=${page}`,
        "application/json",
        { secure: true }
      );
      if (data.status === 200) {
        const results = data?.data?.searchResults || [];
        cache.current[queryKey] = results; // ✅ Save in cache
        setSearchResults(results);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // debounce the query to api
  useEffect(() => {
    if (searchBarValue?.length >= 3) {
      const handler = setTimeout(() => {
        fetchSearchResult("mech");
      }, 400);

      return () => clearTimeout(handler);
    } else if (searchBarValue?.length === 0) {
      setSearchResults([]);
    }
  }, [searchBarValue]);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]} // ignore bottom to let tab bar handle it
      style={{ flex: 1, backgroundColor: "#e5e7eb" }}
    >
      {/* header */}
      {(reviewModal === "read" || reviewModal === "write") && (
        <Modal_R
          isTablet={isTablet}
          isDesktop={isDesktop}
          isMobile={isMobile}
          height={height}
          setReviewModal={setReviewModal}
          selectedMechanic={selectedMechanic}
          width={width}
          review={review}
          setReview={setReview}
          postReview={postReview}
          reviewModal={reviewModal}
        />
      )}
      <Header
        isOpen={isOpen}
        searchBarValue={searchBarValue}
        setSearchBarValue={setSearchBarValue}
      />

      {/* filter icon */}
      {width <= 1024 && (
        <Pressable onPress={() => setIsOpen(true)} className="mt-4 ml-3">
          <Ionicons name="filter-outline" size={40} color="black" />
        </Pressable>
      )}

      <View className="flex-row w-full flex-1 ">

        {/* filter component */}
        {(width > 1024 || isOpen) && (
          <View
            style={{
              height: "100%",
              position: width <= 1024 ? "absolute" : "relative",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              width: isTablet
                ? "40%"
                : width > 1024
                ? "20%"
                : isMobile
                ? "100%"
                : null,
              zIndex: 999,
              paddingHorizontal: 8,
              paddingVertical: 8,
              backgroundColor: "#fff",
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              overflow : 'hidden'
            }}
          >
            <Filter
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isDesktop={isDesktop}
              filterData={filterData}
              filterItems={filterItems}
              setFilterItems={setFilterItems}
              width={width}
            />
          </View>
        )}

        {qr === false && userRole === "mechanic" && (
          <QrModal
            visible={true}
            onClose={() => setQr(true)}
            getItem={getItem}
          />
        )}
        {/* userDetails */}

        <View
          className={`flex-1 ${
            Platform.OS === "web" && width >= 1024 ? "p-4" : null
          } `}
        >
          <FlatList
            key={isDesktop ? "desktop" : "mobile"}
            data={filteredMechanics}
            keyExtractor={(item) => item._id.toString()}
            numColumns={isDesktop ? 2 : 1}
            contentContainerStyle={{
              padding: isDesktop ? 10 : 0,
              flexGrow: 1,
              justifyContent:
                filteredMechanics?.length === 0 ? "center" : "flex-start",
            }}
            columnWrapperStyle={
              isDesktop ? { justifyContent: "space-between" } : undefined
            }
            renderItem={({ item }) => (
              <View
                key={item._id.toString()}
                className={`${
                  Platform.OS === "web"
                    ? isDesktop
                      ? "w-[49%] h-[440px]"
                      : "w-[95%] h-[640px]"
                    : "w-[95%] h-[640px]"
                } m-2 rounded-md mx-auto`}
              >
                <UserCard
                  width={width}
                  mechanic={item}
                  isDesktop={isDesktop}
                  setServiceModal={setServiceModal}
                  setSelectedMechanic={setSelectedMechanic}
                  setReviewModal={setReviewModal}
                  setReview={setReview}
                />
              </View>
            )}
            ListHeaderComponentStyle={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "100%",
              backgroundColor: "#E5E7EB",
              padding: 5,
            }}
            ListHeaderComponent={() => (
              <Animated.View
                style={{
                  opacity: selectedFIlterAnim,
                  transform: [
                    {
                      translateY: selectedFIlterAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                  overflow: "hidden",
                }}
              >
                <SelectedFilter
                  filterItems={filterItems}
                  setFilterItems={setFilterItems}
                />
              </Animated.View>
            )}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center">
                {isLoading && page === 1 ? (
                  <Loading />
                ) : userDetails.length > 0 ? (
                  <Text className="text-gray-500 text-lg font-semibold">
                    No Data Found
                  </Text>
                ) : null}
              </View>
            )}
            ListFooterComponent={() => {
              if (userDetails?.length > 0) {
                return page > totalPages ? (
                  <Text className="text-gray-500 text-center py-4">
                    No more mechanics
                  </Text>
                ) : (
                  <Pressable
                    className="mt-24 mb-8 overflow-hidden rounded-md bg-TealGreen h-12 w-48 items-center justify-center mx-auto"
                    onPress={getmechanics}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loading bgColor="#2095A2" gearColor="#ffffffff" />
                    ) : (
                      <Text className="text-white w-full font-bold text-center">
                        Load more
                      </Text>
                    )}
                  </Pressable>
                );
              }
              return null;
            }}
          />
        </View>
      </View>
      {/* service display modal */}
      {serviceModal && (
        <ServiceModal
          onclose={() => setServiceModal(false)}
          serviceModal={serviceModal}
          selectedMechanic={selectedMechanic}
          isDesktop={isDesktop}
        />
      )}
    </SafeAreaView>
  );
};

export default HomePage;
