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

  console.log("object :", subcategorySuggetion);

  return (
    <View>
      <View className="flex flex-row justify-end items-center   py-3 rounded-md">
        <TouchableOpacity
          onPress={handleAddSubCategory}
          className="bg-black rounded-lg px-3 py-2 z-10"
        >
          <Text className="text-white font-semibold text-xs">
            + Add Category
          </Text>
        </TouchableOpacity>
      </View>

      {[...subCategories]?.reverse().map((sub, index) => {
        const subIndex = subCategories.length - 1 - index;
        const isActiveSub = activeSubIndex === subIndex;

        return (
          <View key={subIndex} style={{ zIndex: isActiveSub ? 100 : 10 }}>
            <Text className="text-lg text-teal-600 font-semibold mb-2">
              {`${labels[0]} ${subIndex + 1}`}
            </Text>

            <View
              className="p-4 border border-gray-200 rounded-lg"
              style={{ marginBottom: 50 }}
            >
              {/* Subcategory Input Field */}
              <View className="mt-2">
                <View className="relative w-full mb-4">
                  <View className="flex-row items-center border border-gray-300 focus-within:border-teal-500 rounded-lg bg-white">
                    <TextInput
                      value={sub.name}
                      onChangeText={(text) => {
                        handleSubCategoryChange(subIndex, text);
                        setCategoryInput(text);
                        setSelectIndex(-1);
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={() => {
                        if (getCategory) getCategory();
                        setActiveSubIndex(subIndex);
                        setActiveBrandIndex(null);
                        setIsFocused(true);
                        setShowCategoryDropdown(true);
                      }}
                      placeholder={`Enter ${labels[0]} Name`}
                      placeholderTextColor="#94A3B8"
                      className="flex-1 p-3 text-black outline-none w-[80%]"
                    />
                    <TouchableOpacity
                      onPress={() => handleDeleteSubCategory(subIndex)}
                      className="pr-3"
                    >
                      <Text className="text-red-500 text-xl font-bold">×</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Category Suggestions Dropdown */}
                {getCategory &&
                  filteredCategorySuggestions?.length > 0 &&
                  isFocused &&
                  isActiveSub &&
                  showCategoryDropdown && (
                    <View
                      className="border border-teal-500 bg-white mt-12 rounded-md max-h-[250px] absolute overflow-hidden shadow-lg w-full mx-auto left-0 right-0"
                      style={{ zIndex: 200 }}
                    >
                      <FlatList
                        ref={flatListRef}
                        data={filteredCategorySuggestions}
                        keyExtractor={(item, idx) => idx.toString()}
                        renderItem={({ item, index }) => (
                          <Pressable
                            onPress={() => {
                              const updated = [...subCategories];
                              updated[subIndex].name = item;
                              setSubCategories(updated);
                              setCategoryInput("");
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

                {/* Add Brand Button */}
                {sub.name.length > 0 && (
                  <View className="flex flex-row items-center justify-between py-2 rounded-md">
                    <Text className="md:text-lg sm:text-md font-semibold text-teal-600">
                      {labels[1]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleAddBrand(subIndex);
                      }}
                      className="bg-black rounded-lg px-3 py-2"
                    >
                      <Text className="text-white font-medium text-xs ">
                        + Add {labels[1]==='services' ? 'service' : 'brand'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Brand Inputs */}
                {sub.name.length > 0 &&
                  [...sub.services]?.reverse().map((brand, brandIdx) => {
                    const brandIndex = sub.services.length - 1 - brandIdx;
                    const isActiveBrand =
                      activeSubIndex === subIndex &&
                      activeBrandIndex === brandIndex;

                    return (
                      <View
                        key={brandIndex}
                        className="relative mb-2 mt-2"
                        style={{ zIndex: isActiveBrand ? 200 : 10 }}
                      >
                        <View className="w-full">
                          <View className="flex-row items-center border border-gray-300 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-300 rounded-lg bg-white">
                            <TextInput
                              value={brand}
                              onChangeText={(text) => {
                                handleBrandChange(subIndex, brandIndex, text);
                                setSubcategoryInput(text);
                              }}
                              onFocus={() => {
                                if (getSubCategory) getSubCategory(brandIndex);
                                setActiveSubIndex(subIndex);
                                setActiveBrandIndex(brandIndex);
                                setIsFocused(true);
                                setShowSubcategoryDropdown(true);
                              }}
                              placeholder={`Enter ${labels[1]} Name`}
                              placeholderTextColor="#94A3B8"
                              className="flex-1 p-3 text-black outline-none w-[80%]"
                            />
                            <TouchableOpacity
                              onPress={() =>
                                handleDeleteBrand(subIndex, brandIndex)
                              }
                              className="pr-3"
                            >
                              <Text className="text-red-500 text-xl font-bold">
                                ×
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Brand Suggestions Dropdown */}
                        {getSubCategory &&
                          filteredSubcategorySuggestions?.length > 0 &&
                          isFocused &&
                          isActiveBrand &&
                          showSubcategoryDropdown && (
                            <View
                              className="absolute left-0 right-0 w-full mx-auto mt-12 border border-teal-500 bg-white rounded-md max-h-[250px] overflow-hidden shadow-lg"
                              style={{ zIndex: 300 }}
                            >
                              <FlatList
                                data={filteredSubcategorySuggestions}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                  <Pressable
                                    onPress={() => {
                                      const updated = [...subCategories];
                                      updated[subIndex].services[brandIndex] =
                                        item;
                                      setSubCategories(updated);
                                      setSubcategoryInput("");
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
                    );
                  })}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
