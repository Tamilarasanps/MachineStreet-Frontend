import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Toast from "react-native-toast-message";
import SubCategory from "../mechanicApp/SubCategory";
import useSubCategoryHandlers from "../hooks/useSubCategoryHandlers";
// pllll
export default function AdminCat({
  industry,
  setIndustry,
  category,
  setCategory,
  subCategories,
  setSubCategories,
  handleSubmit,
}) {
  const {
    handleAddSubCategory,
    handleDeleteSubCategory,
    handleAddBrand,
    handleDeleteBrand,
    handleSubCategoryChange,
    handleBrandChange,
  } = useSubCategoryHandlers(subCategories, setSubCategories);

  return (
    <SafeAreaView className="flex-1 rounded-md bg-white mx-auto shadow-md w-full max-w-[700px] p-2">
      <View className="flex-1 p-4 mt-2">
        <Toast />

        <Text className="text-lg font-semibold mb-2 text-teal-700">
          Industry Name
        </Text>
        <TextInput
          value={industry}
          onChangeText={setIndustry}
          placeholder="Enter Industry Name"
          placeholderTextColor="#94A3B8"
          className="border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-300 rounded-lg p-3 mb-4 bg-white"
        />

        <Text className="text-lg font-semibold mb-2 text-teal-700">
          Category Name
        </Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="Enter Category Name"
          placeholderTextColor="#94A3B8"
          className="border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-300 rounded-lg p-3 mb-4 bg-white"
        />

        <SubCategory
          labels={["subCategories", "brands"]}
          subCategories={subCategories}
          setSubCategories={setSubCategories}
          handleAddSubCategory={handleAddSubCategory}
          handleDeleteSubCategory={handleDeleteSubCategory}
          handleAddBrand={handleAddBrand}
          handleDeleteBrand={handleDeleteBrand}
          handleSubCategoryChange={handleSubCategoryChange}
          handleBrandChange={handleBrandChange}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-black rounded-lg p-4"
        >
          <Text className="text-white text-center font-semibold">Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
