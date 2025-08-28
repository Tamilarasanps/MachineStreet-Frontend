import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import useGeoLocation from "@/app/hooks/GeoLocation";
import Checkbox from "expo-checkbox";
import useApi from "@/app/hooks/useApi";
import { useRef } from "react";

const Location = ({ location, setLocation, page }) => {
  const [india, setIndia] = useState(false);
  const [regions, setRegions] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [districtsWithStates, setDistrictsWithStates] = useState([]);

  const [hasFetchedIndustries, setHasFetchedIndustries] = useState(false);

  const { getJsonApi } = useApi();
  const { geoCoords, address } = useGeoLocation();

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // suggestions state
  const [regionQuery, setRegionQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1); // for arrow navigation
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);

  const [activeRegionIndex, setActiveRegionIndex] = useState(-1);
  const [activeDistrictIndex, setActiveDistrictIndex] = useState(-1);

  // inside component
  const regionListRef = useRef(null);
  const districtListRef = useRef(null);

  const fetchIndustries = useCallback(async () => {
    if (hasFetchedIndustries) return;

    try {
      const data = await getJsonApi("CategoryPage");

      const fetchedRegions = (data?.data?.states[0]?.states || []).sort(
        (a, b) => a.localeCompare(b)
      );
      const fetchedDistricts = data?.data?.states[1]?.districts || [];

      setRegions(fetchedRegions);
      setDistrictsWithStates(fetchedDistricts);

      const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "");

      // Profile page with foreign user
      if (
        page === "profile" &&
        location?.country &&
        normalize(location.country) !== "india"
      ) {
        setIndia(true);
        setHasFetchedIndustries(true);
        return;
      }

      let temp = null;
      if (page === "signup" && address?.region) {
        temp = address;
      } else if (page === "profile" && location?.region) {
        temp = location;
      }

      if (!temp) return;

      const matchedRegion = fetchedRegions.find(
        (r) => normalize(r) === normalize(temp.region)
      );

      const matchedDistricts = fetchedDistricts
        .filter(
          (state) => normalize(Object.keys(state)[0]) === normalize(temp.region)
        )
        .flatMap((state) => Object.values(state)[0])
        .sort((a, b) => a.localeCompare(b));

      const matchedDistrict = matchedDistricts.includes(temp.district)
        ? temp.district
        : "";

      if (matchedRegion) {
        setSelectedRegion(matchedRegion);
        setSelectedDistrict(matchedDistrict);
        setDistricts(matchedDistricts);

        setLocation((prev) => ({
          ...prev,
          region: matchedRegion,
          district: matchedDistrict,
          country: temp.country || "India",
          coords: geoCoords || "",
        }));
      }

      setHasFetchedIndustries(true);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  }, []);

  useEffect(() => {
    if (
      Object.keys(geoCoords || {}).length > 0 &&
      address?.state &&
      address?.country &&
      !hasFetchedIndustries
    ) {
      fetchIndustries();
    }
  }, [geoCoords, address, fetchIndustries, hasFetchedIndustries]);

  useEffect(() => {
    if (!hasFetchedIndustries) fetchIndustries();
  }, [fetchIndustries, hasFetchedIndustries]);

  useEffect(() => {
    if (!selectedRegion) return;
    const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "");
    const matchedDistricts = districtsWithStates
      .filter(
        (state) =>
          normalize(Object.keys(state)[0]) === normalize(selectedRegion)
      )
      .flatMap((state) => Object.values(state)[0])
      .sort((a, b) => a.localeCompare(b));
    setDistricts(matchedDistricts);
  }, [selectedRegion, districtsWithStates]);

  // arrow key handler

  const handleKeyPress = (
    e,
    type,
    suggestions,
    setQuery,
    setSelected,
    setShow,
    activeIndex,
    setActiveIndex,
    listRef // ✅ new param
  ) => {
    if (e.nativeEvent.key === "ArrowDown") {
      setActiveIndex((prev) => {
        const next = prev < suggestions.length - 1 ? prev + 1 : prev;
        if (listRef?.current && next >= 0) {
          listRef.current.scrollToIndex({ index: next, animated: true });
        }
        return next;
      });
    } else if (e.nativeEvent.key === "ArrowUp") {
      setActiveIndex((prev) => {
        const next = prev > 0 ? prev - 1 : prev;
        if (listRef?.current && next >= 0) {
          listRef.current.scrollToIndex({ index: next, animated: true });
        }
        return next;
      });
    } else if (e.nativeEvent.key === "Enter" && activeIndex >= 0) {
      const chosen = suggestions[activeIndex];
      setQuery(chosen);
      setSelected(chosen);
      setLocation((prev) => ({ ...prev, [type]: chosen }));
      setShow(false);
      setActiveIndex(-1);
      Keyboard.dismiss();
    }
  };
  console.log(selectedRegion);
  return (
    <View className="mt-10">
      {/* Checkbox */}
      <View className="flex flex-row items-center justify-end">
        <View className="flex flex-row items-center">
          <Checkbox
            value={india}
            onValueChange={() => {
              setLocation({
                coords: geoCoords,
                country: india ? "India" : "",
                region: "",
                district: "",
              });
              setSelectedDistrict("");
              setSelectedRegion("");
              setIndia(!india);
            }}
            className="w-5 h-5 border-gray-400 cursor-pointer"
            color={india ? "#008080" : undefined}
          />
          <Text className="ml-2 text-gray-700">Other than India</Text>
        </View>
      </View>

      {!india ? (
        <>
          {/* State Input */}
          <Text className="text-lg font-semibold text-teal-600 mb-2 mt-4">
            State
          </Text>
          <View style={{ position: "relative", zIndex: 10000 }}>
            <TextInput
              autoComplete="off"
              className="border border-gray-300 h-[50] outline-TealGreen rounded-lg w-full p-3"
              placeholder="Enter State"
              value={regionQuery || selectedRegion || ""} // ✅ use either
              onChangeText={(text) => {
                setRegionQuery(text);
                setSelectedRegion(null); // clear selected when typing
                setShowRegionSuggestions(true);
              }}
              onKeyPress={(e) =>
                handleKeyPress(
                  e,
                  "region",
                  regions.filter((r) =>
                    r.toLowerCase().includes(regionQuery.toLowerCase())
                  ),
                  setRegionQuery,
                  setSelectedRegion,
                  setShowRegionSuggestions,
                  activeRegionIndex,
                  setActiveRegionIndex,
                  regionListRef // ✅ pass ref here
                )
              }
              onFocus={() => setShowRegionSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowRegionSuggestions(false), 100)
              }
              // ✅ hide on focus loss
            />

            {showRegionSuggestions && regionQuery.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 55,
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 8,
                  zIndex: 10001,
                  maxHeight: 200,
                }}
              >
                <FlatList
                  ref={regionListRef}
                  keyboardShouldPersistTaps="handled"
                  data={regions.filter((r) =>
                    r.toLowerCase().includes(regionQuery.toLowerCase())
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        backgroundColor:
                          index === activeRegionIndex ? "#008080" : "white", // ✅ teal highlight
                      }}
                      onPress={() => {
                        setRegionQuery(item); // ✅ updates input
                        setSelectedRegion(item); // ✅ keeps selection
                        setLocation((prev) => ({ ...prev, region: item }));
                        setShowRegionSuggestions(false); // close dropdown
                        setActiveRegionIndex(-1);
                        Keyboard.dismiss(); // ✅ close keyboard
                      }}
                    >
                      <Text
                        style={{
                          color:
                            index === activeRegionIndex ? "white" : "black", // ✅ readable contrast
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <Text className="text-lg font-semibold text-teal-600 mb-2 mt-6 ">
            District
          </Text>
          <View
            style={{
              position: "relative",
              zIndex: showDistrictSuggestions ? 10000 : 10,
            }}
          >
            <TextInput
              autoComplete="off"
              className="border border-gray-300 h-[50] outline-TealGreen rounded-lg w-full p-3"
              placeholder="Enter District"
              value={districtQuery || selectedDistrict || ""} // ✅ only districtQuery
              editable={!!selectedRegion} // disable until region is selected
              onChangeText={(text) => {
                setDistrictQuery(text);
                setSelectedDistrict(null);
                setShowDistrictSuggestions(true);
              }}
              onKeyPress={(e) =>
                handleKeyPress(
                  e,
                  "district",
                  districts.filter((d) =>
                    d.toLowerCase().includes(districtQuery.toLowerCase())
                  ),
                  setDistrictQuery,
                  setSelectedDistrict,
                  setShowDistrictSuggestions,
                  activeDistrictIndex,
                  setActiveDistrictIndex,
                  districtListRef // ✅ pass ref here
                )
              }
              onFocus={() => setShowDistrictSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowRegionSuggestions(false), 100)
              } // ✅ hide on focus loss
            />

            {showDistrictSuggestions &&
              districtQuery.length > 0 &&
              !!selectedRegion && (
                <View
                  style={{
                    position: "absolute",
                    top: 55,
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    borderWidth: 2,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    zIndex: 10001,
                    maxHeight: 200,
                    borderRadius: 10,
                  }}
                >
                  <FlatList
                    ref={districtListRef}
                    keyboardShouldPersistTaps="handled"
                    data={districts.filter((d) =>
                      d.toLowerCase().includes(districtQuery.toLowerCase())
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={{
                          padding: 12,
                          backgroundColor:
                            index === activeDistrictIndex ? "#008080" : "white", // ✅ teal highlight
                        }}
                        onPress={() => {
                          setDistrictQuery(item);
                          setSelectedDistrict(item);
                          setLocation((prev) => ({ ...prev, district: item }));
                          setShowDistrictSuggestions(false);
                          setActiveDistrictIndex(-1);
                        }}
                      >
                        <Text
                          style={{
                            color:
                              index === activeDistrictIndex ? "white" : "black",
                          }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
          </View>

          {/* Country Fixed */}
          <Text className="text-lg font-semibold text-teal-600 mt-6 mb-2">
            Country
          </Text>
          <TextInput
            className="border border-gray-300 h-[50] rounded-lg w-full p-3 bg-gray-100"
            value="India"
            editable={false}
          />
        </>
      ) : (
        ["country", "region"].map((key) => (
          <View key={key} className="mt-4">
            <Text className="text-lg font-semibold text-teal-600">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <TextInput
              autoComplete="off"
              className="border border-gray-300 h-[50] rounded-lg w-full p-3"
              placeholder={`Enter your ${key}`}
              value={location[key]}
              onChangeText={(text) => setLocation({ ...location, [key]: text })}
            />
          </View>
        ))
      )}
    </View>
  );
};

export default Location;
