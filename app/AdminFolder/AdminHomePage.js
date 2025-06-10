import React, { useState } from "react";
import { Pressable, View, Text } from "react-native";
import CategoryManager from "./CategoryManager";
import ProductApproval from "./ProductApproval";
import { ScrollView } from "react-native";
import MenuNavigation from "./MenuNavigation";
import HomePageAdmin from "./HomePageAdmin";
// import HomePageAdmin from "./HomePageAdmin";

const AdminHomePage = () => {
  const [admin, setAdmin] = useState("products");
  return (
    <View>
      {/* <View className="z-50 h-screen "></View>
      <ScrollView className="z-10 bg-red-800">
        <View>
          <View className="flex-1 p-2 shadow-lg bg-gray-300 z-10"> */}

      <View className="flex-1 z-10">
        {admin === "products" ? <ProductApproval /> : <CategoryManager />}
      </View>
      {/* </View>
        </View>
      </ScrollView> */}
    </View>
  );
};

export default AdminHomePage;
