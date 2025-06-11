import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function SubCategory({
  subCategories,
  setSubCategories,
  getCategory,
  getSubCategory,
  categorySuggetion,
  subcategorySuggetion,
  labels,
  handleAddSubCategory,
  handleDeleteSubCategory,
  handleAddBrand,
  handleDeleteBrand,
  handleSubCategoryChange,
  handleBrandChange,
}) {
  // console.log("subCategories", subCategories);
  const [activeSubIndex, setActiveSubIndex] = useState(null);
  const [activeBrandIndex, setActiveBrandIndex] = useState(null);
  const [highlightedCategoryIndex, setHighlightedCategoryIndex] =
    useState(null);
  const [highlightedSubcategoryIndex, setHighlightedSubcategoryIndex] =
    useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [categoryInput, setCategoryInput] = useState(""); // For filtering category
  const [subcategoryInput, setSubcategoryInput] = useState(""); // For filtering subcategory
  const [isFocused, setIsFocused] = useState(false);

  const [selectIndex, setSelectIndex] = useState(-1);
  const flatListRef = useRef(null);

  const filteredCategorySuggestions = categorySuggetion?.filter((item) =>
    item.toLowerCase().includes(categoryInput.toLowerCase())
  );

  // Filter subcategories based on user input
  const filteredSubcategorySuggestions = subcategorySuggetion?.filter((item) =>
    item.toLowerCase().includes(subcategoryInput.toLowerCase())
  );

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "ArrowDown") {
      setSelectIndex((prev) =>
        prev < filteredCategorySuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (nativeEvent.key === "ArrowUp") {
      setSelectIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (nativeEvent.key === "Enter") {
      if (selectIndex >= 0 && filteredCategorySuggestions[selectIndex]) {
        const selectedItem = filteredCategorySuggestions[selectIndex];
        // Apply selection
        const newSubs = [...subCategories];
        newSubs[activeSubIndex].name = selectedItem;
        setSubCategories(newSubs);
        setCategoryInput("");
        setShowCategoryDropdown(false);
        setSelectIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (flatListRef.current && selectIndex >= 0) {
      flatListRef.current.scrollToIndex({
        index: selectIndex,
        animated: true,
      });
    }
  }, [selectIndex]);

  return (
    <>
      <Text className="text-lg font-semibold mb-2 text-teal-700">
        {labels[0]} and {labels[1]}
      </Text>

      {subCategories?.map((sub, subIndex) => (
        <View
          key={subIndex}
          className="p-4 border border-gray-200  rounded-lg z-50"
          style={{ marginBottom: 50 }}
        >
          <View className="w-full flex justify-end items-end ">
            <MaterialIcons
              name="delete"
              size={24}
              color="#EF4444"
              onPress={() => handleDeleteSubCategory(subIndex)}
            />
          </View>
          {/* Category Input */}
          <View className="z-50 mt-2">
            <TextInput
              value={sub.name}
              onChangeText={(text) => {
                handleSubCategoryChange(subIndex, text); // update actual state
                setCategoryInput(text); // still update filter input for suggestions
                setSelectIndex(-1);
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (getCategory) getCategory();
                setActiveSubIndex(subIndex);
                setActiveBrandIndex(null);
                setIsFocused(true); // Set focused state to true
                setShowCategoryDropdown(true);
              }}
              // onBlur={() => {
              //   setTimeout(() => setIsFocused(false), 100); // Delay to let onPress run first
              // }}
              placeholder={`Enter ${labels[0]} Name`}
              placeholderTextColor="#94A3B8"
              className="border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-300 rounded-lg p-3 mb-2 bg-white"
              // onChangeText={(text) => setCategoryInput(text)} // Set category input value
            />

            {/* Category Suggestions */}
            {getCategory &&
              filteredCategorySuggestions?.length > 0 &&
              isFocused && // Show dropdown only if input is focused
              activeSubIndex === subIndex &&
              showCategoryDropdown && (
                <View className="border border-teal-500 bg-white mt-12 rounded-md max-h-[250px] absolute overflow-hidden shadow-lg w-[90%] mx-auto left-0 right-0 z-50">
                  <FlatList
                    ref={flatListRef}
                    data={filteredCategorySuggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <Pressable
                        onPress={() => {
                          const newSubs = [...subCategories];
                          newSubs[subIndex].name = item;
                          setSubCategories(newSubs);
                          setCategoryInput(""); // Reset input filter
                          setShowCategoryDropdown(false);
                          setSelectIndex(-1);
                        }}
                        onHoverIn={() => setHighlightedCategoryIndex(index)}
                        onHoverOut={() => setHighlightedCategoryIndex(null)}
                        className={`p-3 ${
                          highlightedCategoryIndex === index
                            ? "bg-teal-100"
                            : "bg-white"
                        }`}
                      >
                        <Text className="text-[16px] text-gray-600">
                          {item}
                        </Text>
                      </Pressable>
                    )}
                  />
                </View>
              )}

            {/* Brand Input Fields */}
            {sub?.services?.map((brand, brandIndex) => (
              <View
                key={brandIndex}
                className="relative mb-2 ml-2"
                style={{
                  zIndex: activeBrandIndex === brandIndex ? 50 : 10,
                }}
              >
                <View className="flex-row items-center z-10">
                  <TextInput
                    value={brand}
                    onChangeText={(text) => {
                      handleBrandChange(subIndex, brandIndex, text); // update actual state
                      setSubcategoryInput(text); // for dropdown filter
                    }}
                    onFocus={() => {
                      if (getSubCategory) getSubCategory(brandIndex);
                      setActiveSubIndex(subIndex);
                      setActiveBrandIndex(brandIndex);
                      setIsFocused(true); // Set focused state to true for brand input
                      setShowSubcategoryDropdown(true);
                    }}
                    // onBlur={() => {
                    //   setTimeout(() => setIsFocused(false), 100); // Delay to let onPress run first
                    // }}
                    placeholder={`Enter ${labels[1]} Name`}
                    placeholderTextColor="#94A3B8"
                    className="flex-1 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-300 rounded-lg p-3 bg-white"
                    // onChangeText={(text) => setSubcategoryInput(text)} // Set subcategory input value
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteBrand(subIndex, brandIndex)}
                    className="ml-2 bg-red-500 rounded-full w-8 h-8 justify-center items-center"
                  >
                    <Text className="text-white font-bold">×</Text>
                  </TouchableOpacity>
                </View>

                {getSubCategory &&
                  filteredSubcategorySuggestions?.length > 0 &&
                  isFocused && // Show dropdown only if input is focused
                  activeSubIndex === subIndex &&
                  activeBrandIndex === brandIndex &&
                  showSubcategoryDropdown && (
                    <View className="absolute left-0 right-0 w-[90%] mx-auto mt-12 border border-teal-500 bg-white rounded-md max-h-[250px] overflow-hidden shadow-lg z-50">
                      <FlatList
                        data={filteredSubcategorySuggestions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <Pressable
                            onPress={() => {
                              const newSubs = [...subCategories];
                              newSubs[subIndex].services[brandIndex] = item;
                              setSubCategories(newSubs);
                              setSubcategoryInput(""); // Reset input filter
                              setShowSubcategoryDropdown(false);
                            }}
                            onHoverIn={() =>
                              setHighlightedSubcategoryIndex(index)
                            }
                            onHoverOut={() =>
                              setHighlightedSubcategoryIndex(null)
                            }
                            className={`p-2 ${
                              highlightedSubcategoryIndex === index
                                ? "bg-teal-100"
                                : "bg-white"
                            }`}
                          >
                            <Text className="text-[16px] text-gray-700">
                              {item}
                            </Text>
                          </Pressable>
                        )}
                      />
                    </View>
                  )}
              </View>
            ))}
          </View>

          <View className="z-10">
            {/* Add Brand Button */}
            <TouchableOpacity
              onPress={() => handleAddBrand(subIndex)}
              className="bg-teal-600 rounded-lg p-2 mt-2 ml-2 "
            >
              <Text className="text-white text-center">+ Add {labels[1]}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Add Another Subcategory */}
      <TouchableOpacity
        onPress={handleAddSubCategory}
        className="bg-teal-700 rounded-lg p-3 mb-6 z-10"
      >
        <Text className="text-white text-center font-semibold">
          + Add Another {labels[0]}
        </Text>
      </TouchableOpacity>
    </>
  );
}