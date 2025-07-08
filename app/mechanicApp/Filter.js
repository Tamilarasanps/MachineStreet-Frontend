import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { Checkbox, Divider } from "react-native-paper"; // Assuming you're using react-native-paper for Checkbox and RadioGroup components
import { useWindowDimensions } from "react-native"; // To detect screen width dynamically
import Icon from "react-native-vector-icons/MaterialIcons";
import RadioGroup from "react-native-radio-buttons-group";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";

export default function FilterComponent({
  isOpen,
  setIsOpen,
  industries,
  categories,
  location,
  otherThanIndiaLocation,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedIndustry,
  setSelectedIndustry,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedRating,
  setSelectedRating,
  page,
  radioButtonData,
  setSelectedPriceType,
  selectedPriceType,

  makes,
  setSelectedMakes,
  selectedMakes,
  setPrice,
  selectedDistricts,
  setSelectedDistricts,
  otherThanIndia,
  setOtherThanIndia,
  dataToMap,
  price,
}) {
  const { width } = useWindowDimensions(); // Dynamically get the screen width

  const [activeFilter, setActiveFilter] = useState("Location");
  const filters =
    page === "mech"
      ? ["Location", "Ratings", "Industry"]
      : ["Location", "Price Type", "Price", "Brand"];

  const toggleFilter = (filter) =>
    setActiveFilter(activeFilter === filter ? null : filter);

  const handleStateClick = (state) => {
    // If the state is already selected, deselect it
    if (selectedState === state) {
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedDistricts([]); // Reset districts when state is deselected
    } else {
      setSelectedState(state);
      setSelectedDistrict("");
      setSelectedDistricts(
        otherThanIndia
          ? otherThanIndiaLocation[state] || []
          : location[state] || []
      );
    }
  };

  const handleDistrictClick = (district) => {
    // If the district is already selected, deselect it
    if (selectedDistrict.includes(district)) {
      setSelectedDistrict(() =>
        selectedDistrict.filter((dis) => dis !== district)
      );
    } else {
      setSelectedDistrict((prev) => [...prev, district]);
    }
  };

  const handleRatingClick = (rating) => {
    // If the rating is already selected, deselect it
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };

  return (
    <View>
      <ScrollView
        className={`bg-gray-100 ml-2 rounded-md p-3 shadow-md ${
          width <= 1024 ? "z-50 flex-col pb-24 max-w-[100vw]" : "flex-row"
        }`}
        style={{ height: width <= 1024 ? 550 : 600 }}
      >
        {/* Close icon on mobile */}
        {width <= 1024 && (
          <View className="w-full items-end mb-2">
            <MaterialIcons
              name="cancel"
              size={24}
              color="red"
              onPress={() => setIsOpen(false)}
            />
          </View>
        )}

        {/* Left filter tabs */}
        <View
          className={`mb-4 ${
            width <= 1024 ? "w-full flex-row flex-wrap" : "w-[150px]"
          }`}
        >
          {filters?.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => toggleFilter(filter)}
              className={`px-3 py-2 mb-2 rounded-md mr-2 ${
                activeFilter === filter ? "bg-red-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  activeFilter === filter ? "text-white" : "text-gray-800"
                }`}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Right filter panel */}
        <View
          className={`pl-4 ${width <= 1024 ? "w-full flex-1" : "w-[272px]"}`}
        >
          <ScrollView className="mb-4">
            {/* Location Filter */}
            {activeFilter === "Location" && (
              <View className="bg-gray-200 rounded-md p-3 space-y-3">
                <View className="flex-row  items-center justify-between mb-4">
                  <Text className="font-semibold text-md text-gray-900 ">
                    Select State
                  </Text>
                  <Pressable
                    className="flex-row items-center space-x-2"
                    onPress={() => setOtherThanIndia(!otherThanIndia)}
                  >
                    <Checkbox
                      status={otherThanIndia ? "checked" : "unchecked"}
                      color="#EF4444"
                    />
                    <Text className="font-medium text-gray-800 text-sm">
                      Other than India
                    </Text>
                  </Pressable>
                </View>

                <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled>
                  {selectedState ? (
                    <Pressable
                      onPress={() => {
                        setSelectedState("");
                        setSelectedDistricts([]);
                      }}
                      className="p-2 bg-gray-300 rounded-md mb-2"
                    >
                      <Text className="text-base font-bold">
                        {selectedState}
                      </Text>
                      <Text className="text-sm font-semibold text-red-500 underline">
                        ← Change State
                      </Text>
                    </Pressable>
                  ) : (
                    Object.keys(dataToMap || {}).map((state) => (
                      <Pressable
                        key={state}
                        onPress={() => handleStateClick(state)}
                        className={`p-2 rounded-md mb-2 ${
                          selectedState === state
                            ? "bg-gray-300"
                            : "bg-gray-100"
                        }`}
                      >
                        <Text className="text-base">{state}</Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>

                {selectedDistricts?.length > 0 && (
                  <>
                    <Divider className="my-2" />
                    <Text className="font-semibold text-base text-gray-800 mb-1">
                      Districts in {selectedState}
                    </Text>
                    <ScrollView nestedScrollEnabled>
                      {selectedDistricts.map((district) => (
                        <Pressable
                          key={district}
                          onPress={() => handleDistrictClick(district)}
                          className={`p-2 rounded-md mb-1 ${
                            selectedDistrict.includes(district)
                              ? "bg-gray-300"
                              : "bg-gray-100"
                          }`}
                        >
                          <Text className="text-sm">{district}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </>
                )}
              </View>
            )}

            {/* Price Filter */}
            {activeFilter === "Price" && (
              <View className="mt-2">
                <Text className="font-semibold text-red-500 mb-2 text-lg">
                  Price Range
                </Text>
                <TextInput
                  value={price.fromPrice}
                  onChange={(e) =>
                    setPrice((prev) => ({
                      ...prev,
                      fromPrice: e.nativeEvent.text,
                    }))
                  }
                  placeholder="From"
                  keyboardType="numeric"
                  className="border-2 w-full h-10 rounded-md px-3 border-gray-300 mb-2"
                />
                <TextInput
                  value={price.toPrice}
                  onChange={(e) =>
                    setPrice((prev) => ({
                      ...prev,
                      toPrice: e.nativeEvent.text,
                    }))
                  }
                  placeholder="To"
                  keyboardType="numeric"
                  className="border-2 w-full h-10 rounded-md px-3 border-gray-300"
                />
              </View>
            )}

            {/* Ratings Filter */}
            {activeFilter === "Ratings" && (
              <View>
                <Text className="font-semibold text-gray-800 mb-2 text-lg">
                  Select Rating
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Pressable
                      key={rating}
                      onPress={() => handleRatingClick(rating)}
                      className={`flex-row items-center px-3 py-1 rounded-md ${
                        selectedRating === rating
                          ? "bg-gray-500"
                          : "bg-gray-200"
                      }`}
                    >
                      <Icon name="star-rate" size={18} color="#F59E0B" />
                      <Text className="ml-1 text-base">{rating}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Price Type Filter */}
            {activeFilter === "Price Type" && (
              <View>
                <Text className="font-semibold text-lg text-red-500 mb-2">
                  Select Price Type
                </Text>
                <RadioGroup
                  radioButtons={radioButtonData}
                  onPress={setSelectedPriceType}
                  selectedId={selectedPriceType}
                  layout="row"
                />
              </View>
            )}

            {/* Brand Filter */}
            {activeFilter === "Brand" && (
              <View>
                <Text className="font-semibold text-lg text-red-500 mb-2">
                  Brand Name
                </Text>
                <ScrollView
                  style={{ height: 250 }}
                  contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {makes.map((make, index) => (
                    <Pressable
                      key={index}
                      onPress={() =>
                        setSelectedMakes((prev) =>
                          prev.includes(make)
                            ? prev.filter((m) => m !== make)
                            : [...prev, make]
                        )
                      }
                      className={`px-3 py-1 rounded-md mb-1 ${
                        selectedMakes?.includes(make)
                          ? "bg-red-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text>{make}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Industry Filter */}
            {activeFilter === "Industry" && (
              <ScrollView className="h-96 bg-gray-200 p-3 rounded-md">
                <Text className="font-semibold text-lg text-gray-800 mb-3">
                  Select Industry
                </Text>
                {!selectedIndustry &&
                  Object.keys(industries).map((ind) => (
                    <Pressable
                      key={ind}
                      onPress={() => setSelectedIndustry(ind)}
                      className="p-2 mb-2 rounded-md bg-gray-100"
                    >
                      <Text className="text-base">
                        {ind.charAt(0).toUpperCase() + ind.slice(1)}
                      </Text>
                    </Pressable>
                  ))}

                {selectedIndustry && !selectedCategory && (
                  <>
                    <Pressable
                      onPress={() => {
                        setSelectedIndustry("");
                        setSelectedCategory("");
                        setSelectedSubCategory("");
                      }}
                      className="mb-2"
                    >
                      <Text className="text-sm underline text-red-600">
                        ← Back to Industries
                      </Text>
                    </Pressable>
                    <Text className="font-semibold text-base mb-2">
                      Categories in{" "}
                      {selectedIndustry.charAt(0).toUpperCase() +
                        selectedIndustry.slice(1)}
                    </Text>
                    {industries[selectedIndustry]?.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        className="p-2 mb-2 rounded-md bg-gray-100"
                      >
                        <Text className="text-base">{cat}</Text>
                      </Pressable>
                    ))}
                  </>
                )}

                {selectedCategory && (
                  <>
                    <Pressable
                      onPress={() => {
                        setSelectedCategory("");
                        setSelectedSubCategory("");
                      }}
                      className="mb-2"
                    >
                      <Text className="text-sm underline text-gray-800">
                        ← Back to Categories
                      </Text>
                    </Pressable>
                    <Text className="font-semibold mb-2 text-base">
                      Subcategories in {selectedCategory}
                    </Text>
                    {categories[selectedCategory]?.map((sub) => (
                      <Pressable
                        key={sub}
                        onPress={() =>
                          setSelectedSubCategory(
                            (prev) =>
                              prev.includes(sub)
                                ? prev.filter((item) => item !== sub) // remove if already selected
                                : [...prev, sub] // add if not present
                          )
                        }
                        className={`p-2 mb-2 rounded-md ${
                          selectedSubCategory?.includes(sub)
                            ? "bg-gray-300"
                            : "bg-gray-100"
                        }`}
                      >
                        <Text>{sub}</Text>
                      </Pressable>
                    ))}
                    <Pressable
                      onPress={() => {
                        setSelectedIndustry("");
                        setSelectedCategory("");
                        setSelectedSubCategory("");
                        setSelectedState("");
                        setSelectedDistricts([]);
                        setSelectedRating("");
                      }}
                      className="mt-2"
                    >
                      <Text className="text-gray-900 font-semibold underline text-sm">
                        Deselect All
                      </Text>
                    </Pressable>
                  </>
                )}
              </ScrollView>
            )}
          </ScrollView>

          {/* Deselect All Button */}
          <Pressable
            className="bg-gray-200 py-3 px-4 rounded-md mb-6 mt-2 items-center"
            onPress={() => {
              if (page === "mech") {
                setSelectedIndustry("");
                setSelectedCategory("");
                setSelectedSubCategory("");
                setSelectedRating("");
              } else {
                setSelectedPriceType("");
                setPrice({ fromPrice: "", toPrice: "" });
                setSelectedMakes([]);
              }
              setSelectedState("");
              setSelectedDistrict([]);
              setSelectedDistricts([]);
              setOtherThanIndia(false);
              dataToMap = location;
            }}
          >
            <Text className="text-red-500 font-bold text-sm">Deselect All</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
