import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const EditCategory = ({ categoryList, showToast, setCategoryList, setTempText,setSelected, setSelectedCategory,setCat,cat }) => {

  const handleDelete = async (id) => {

    try {
      const response = await axios.delete(
        `http://192.168.1.6:5000/adminCategories/${id}`,
        { headers: { "content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setCategoryList(() => {
          return categoryList.filter((category) => category._id !== id);
        });

        return showToast(response.data.message);
      }
    } catch (err) {
      return showToast(err.response.message);
    }
  };
  return (
    <ScrollView className="mt-8">
      {categoryList?.length > 0 ? categoryList.map((category) => (
        <Pressable
        onPress={()=>{
          // console.log(cat)
            setCat(()=>{
              const updated = [...cat]
              updated[0] = category.industry
              return updated
            })
            setSelectedCategory(category._id)
        }}
          key={category._id}
          className="bg-teal-600 px-4 py-8 mt-4 w-[90%] mx-auto rounded-md flex flex-row justify-between"
        >
          <Text className="text-white font-bold text-lg min-w-[75%] max-w-[75%]">
            {category.industry.toUpperCase()}
          </Text>
          <MaterialCommunityIcons
            onPress={() => {
              handleDelete(category._id);
            }}
            name="delete"
            size={24}
            color={"white"}
            className="min-w-[25%] max--w-[25%] px-4  text-right"
          ></MaterialCommunityIcons>
        </Pressable>
      )) : (
        <Text className="text-lg font-bold text-gray-600 text-center mt-auto">No category Data Found</Text>
      )}
    </ScrollView>
  );
};

export default EditCategory;