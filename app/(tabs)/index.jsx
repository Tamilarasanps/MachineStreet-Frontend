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
import Icon from "react-native-vector-icons/MaterialIcons";
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
  } = useAppContext();
  const { isDesktop, width, isTablet, isMobile, height } = useScreenWidth();
  const { getJsonApi, postJsonApi } = useApi();

  const [filterData, setFIlterData] = useState({});
  const [review, setReview] = useState({
    star: null,
    reviewText: null,
    userId: null,
  });
  const cache = useRef({}); // cache object
  const [searchBarValue, setSearchBarValue] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const slideAnim = useState(new Animated.Value(-width))[0]; // start off-screen left
  const selectedFIlterAnim = useRef(new Animated.Value(0)).current;

  const [isOpen, setIsOpen] = useState(Platform.OS === "web" && isDesktop);
  const [shouldRenderFilter, setShouldRenderFilter] = useState(isOpen);

  const [serviceModal, setServiceModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [qr, setQr] = useState(false);
  const [role, setRole] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);

  const getItem = async (key) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };
  // get mechanics
  const mechanicsCache = useRef(null);

  const getmechanics = useCallback(async () => {
    try {
      const result = await getJsonApi(
        `homepage/getmechanics/?page=${page}&limit=1`,
        "application/json",
        { secure: true }
      );

      if (result?.status === 200) {
        // cache only the first load
        if (!mechanicsCache.current) {
          mechanicsCache.current = result.data;
        }

        setPage((prev) => prev + 1);
        setTotalPages(result?.data?.totalPages);

        // ✅ append instead of overwrite
        setUserDetails((prev) => [
          ...(prev || []),
          ...(result?.data?.userData || []),
        ]);

        setFIlterData(result?.data?.filterData);
        setQr(result.data.qr);
      }
    } catch (err) {
      console.log(err);
    }
  }, [getJsonApi]);

  useEffect(() => {
    if (!userDetails?.length) {
      if (mechanicsCache.current) {
        // hydrate from cache only on first render
        setUserDetails(mechanicsCache?.current?.userData);
        setFIlterData(mechanicsCache?.current?.filterData);
        setQr(mechanicsCache?.current?.qr);
      } else {
        console.log("lplplp");
        getmechanics();
      }
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
      console.log("data ;", data);
      if (data.status === 200) {
        const results = data?.data?.searchResults || [];
        cache.current[queryKey] = results; // ✅ Save in cache
        setSearchResults(results);
      }
    } catch (err) {
      console.log(err);
    }
  };
  console.log(page);
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

  {
    /* review modal */
  }
  console.log(userDetails.length > 0);
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
          <Icon name="filter-list" size={40} color="#000" />
        </Pressable>
      )}

      <View className="flex-row w-full flex-1 ">
        {/* filter component */}

        {(width > 1024 || shouldRenderFilter) && (
          <Animated.View
            pointerEvents="box-none"
            style={{
              transform: [{ translateX: slideAnim }],
              position: width <= 1024 ? "absolute" : "relative",
              top: 0,
              bottom: 0,
              left: 0,
              width: isTablet
                ? "40%"
                : width > 1024
                  ? "20%"
                  : isMobile
                    ? "99%"
                    : null,
              zIndex: 50,
              paddingHorizontal: 8,
              paddingVertical: 8,
              backgroundColor: "#fff",
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
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
          </Animated.View>
        )}

        {qr === false && role === "mechanic" && (
          <QrModal
            visible={true}
            onClose={() => setQr(true)}
            getItem={getItem}
          />
        )}
        {/* userDetails */}

        <View
          className={`flex-1 ${Platform.OS === "web" && width >= 1024 ? "p-4" : null} `}
        >
          <FlatList
            key={isDesktop ? "desktop" : "mobile"}
            data={filteredMechanics}
            keyExtractor={(item) => item._id}
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


// import { useCallback } from "react";
// import { Button } from "react-native";
// import * as Linking from "expo-linking";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Platform } from "react-native";
// import { router } from "expo-router";

// const HomePage = ({ id }) => {
//   console.log('id :', id)
//   const openProfileLink = useCallback(() => {
//     const url = Linking.createURL("E2", {
//       queryParams: { id },
//     });

//     console.log("Opening deep link:", url);

//     if (Platform.OS === "web") {
//       // On web, use router.push for client-side navigation
//       router.push(`http://localhost:8081/E2?id=68bc28e31f97909bd390d929&type=user_visit`);
//     } else {
//       // On native, open the deep link
//       Linking.openURL(url);
//     }
//   }, [id]);
//   return <SafeAreaView><Button title="Open Profile" onPress={openProfileLink} /></SafeAreaView>;
// };

// export default HomePage