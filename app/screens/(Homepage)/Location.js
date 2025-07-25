import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput } from "react-native";
import useGeoLocation from "@/app/hooks/GeoLocation";
import Checkbox from "expo-checkbox";
import useApi from "@/app/hooks/useApi";
import DropDownPicker from "react-native-dropdown-picker";

const Location = ({ location, setLocation, page }) => {
  const [india, setIndia] = useState(false);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  // const [countries] = useState(["India"]);
  const [districtsWithStates, setDistrictsWithStates] = useState([]);

  const [hasFetchedIndustries, setHasFetchedIndustries] = useState(false);

  const { getJsonApi } = useApi();
  const { geoCoords, address } = useGeoLocation();

  const [openState, setOpenState] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const inputFields = [
    { key: "country", label: "Country" },
    { key: "region", label: "Region" },
  ];

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
        setSelectedCountry(location.country);
        setSelectedRegion(location.region);
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
  }, [page, address, location, geoCoords, hasFetchedIndustries, getJsonApi]);

  useEffect(() => {
    const hasLocationPermission =
      Object.keys(geoCoords || {}).length > 0 &&
      address?.state &&
      address?.country;

    if (hasLocationPermission && !hasFetchedIndustries) {
      fetchIndustries();
    }
  }, [geoCoords, address, fetchIndustries, hasFetchedIndustries]);

  useEffect(() => {
    if (!hasFetchedIndustries) {
      fetchIndustries();
    }
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

              setIndia(!india); // ✅ No fetchIndustries call here
            }}
            className="w-5 h-5 border-gray-400 cursor-pointer"
            color={india ? "#008080" : undefined}
          />
          <Text className="ml-2 text-gray-700">Other than India</Text>
        </View>
      </View>

      {!india ? (
        <>
          {/* State Dropdown */}
          <View style={{ zIndex: openState ? 2000 : 1000, marginBottom: 20 }}>
            <Text className="text-lg font-semibold text-teal-600 mb-4">
              State
            </Text>
            <DropDownPicker
              open={openState}
              value={selectedRegion}
              items={regions?.map((region) => ({
                label: region,
                value: region,
              }))}
              setOpen={setOpenState}
              setValue={(callbackOrValue) => {
                const newValue =
                  typeof callbackOrValue === "function"
                    ? callbackOrValue(selectedRegion)
                    : callbackOrValue;

                setSelectedRegion(newValue);
                setLocation((prev) => ({
                  ...prev,
                  region: newValue,
                  district: "",
                }));
              }}
              setItems={() => {}}
              placeholder="Select State"
              listMode="SCROLLVIEW"
              autoScroll={true}
              style={{
                borderColor: "#D1D5DB",
                height: 50,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              dropDownContainerStyle={{
                borderColor: "#D1D5DB",
                backgroundColor: "#fff",
                maxHeight: 200,
              }}
              textStyle={{ color: "#000" }}
              placeholderStyle={{ color: "#9CA3AF" }}
            />
          </View>

          {/* District Dropdown */}
          <View style={{ zIndex: openDistrict ? 2000 : 1000 }}>
            <Text className="text-lg font-semibold text-teal-600 mb-4">
              District
            </Text>
            <DropDownPicker
              open={openDistrict}
              value={selectedDistrict}
              items={districts?.map((district) => ({
                label: district,
                value: district,
              }))}
              setOpen={setOpenDistrict}
              setValue={(callbackOrValue) => {
                const newValue =
                  typeof callbackOrValue === "function"
                    ? callbackOrValue(selectedDistrict)
                    : callbackOrValue;

                setSelectedDistrict(newValue);
                setLocation((prev) => ({
                  ...prev,
                  district: newValue,
                }));
              }}
              setItems={() => {}}
              placeholder="Select District"
              disabled={!location.region}
              listMode="SCROLLVIEW"
              autoScroll={true}
              style={{
                borderColor: "#D1D5DB",
                height: 50,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              dropDownContainerStyle={{
                borderColor: "#D1D5DB",
                backgroundColor: "#fff",
                maxHeight: 200,
              }}
              textStyle={{ color: "#000" }}
              placeholderStyle={{ color: "#9CA3AF" }}
            />
          </View>

          {/* Country (Fixed as India) */}
          <Text className="text-lg font-semibold text-teal-600 mt-6 mb-4">
            Country:
          </Text>
          <View style={{ zIndex: openCountry ? 3000 : 1000, marginBottom: 20 }}>
            <DropDownPicker
              open={openCountry}
              value={"India"}
              items={[{ label: "India", value: "India" }]}
              setOpen={setOpenCountry}
              setValue={setSelectedCountry}
              setItems={() => {}}
              placeholder="Select Country"
              disabled={true}
              listMode="SCROLLVIEW"
              autoScroll={true}
              style={{
                borderColor: "#D1D5DB",
                height: 50,
                borderRadius: 8,
                paddingHorizontal: 8,
                backgroundColor: "#f3f4f6",
              }}
              dropDownContainerStyle={{
                borderColor: "#D1D5DB",
                backgroundColor: "#fff",
              }}
              textStyle={{ color: "#000" }}
              placeholderStyle={{ color: "#9CA3AF" }}
            />
          </View>
        </>
      ) : (
        inputFields.map(({ key, label }) => (
          <View key={key} className="mt-4">
            <Text className="text-lg font-semibold text-teal-600">{label}</Text>
            <TextInput
              className="border border-gray-300 h-[50] rounded-lg w-full p-3 focus:border-teal-600 outline-teal-600"
              placeholder={`Enter your ${label}`}
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
