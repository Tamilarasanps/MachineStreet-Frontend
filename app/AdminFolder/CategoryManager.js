import React, { useEffect } from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OperationSwitcher from "./OperationSwitcher";
import { useState } from "react";
import CreateCategory from "./CreateCategory";
import SubCategoryDisplayer from "./SubCategoryDisplayer";
import Toast from "react-native-toast-message";
import axios from "axios";
import EditCategory from "./EditCategory";
import AdminCat from "./AdminCat";

const CategoryManager = () => {
  const [industry, setIndustry] = useState("");
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([
    { name: "", services: [""] },
  ]);

  // console.log('subCategories :', subCategories)

  const [selected, setSelected] = useState("add");
  const [categoryList, setCategoryList] = useState([]);
  const [indutryList, setIndustryList] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { width } = useWindowDimensions();

  const getCategory = async (industryId, fetchdata) => {
    try {
      let uri;
      if (!fetchdata && !industryId) {
        uri = `http://192.168.1.9:4000/adminCategories/getCategory`;
      } else {
        uri = `http://192.168.1.9:4000/adminCategories/getCategory/${industryId}/${fetchdata}`;
      }

      const response = await axios.get(uri, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 && fetchdata === "category") {
        setCategoryList(response.data.category);
      } else if (response.status === 200 && fetchdata === "subcategory") {
        console.log(response.data.category.subCategories);

        setIndustry(response.data.category.industry?.name || "");
        setCategory(response.data.category.category?.name || "");
        setSelectedCategory(industryId);
        setSubCategories(
          response.data.category.subCategories.map((sub) => ({
            _id: sub._id,
            name: sub.name,
            services:
              sub.brands.map((brand) => ({
                name: brand.name,
                _id: brand._id,
              })) || [],
          }))
        );
      } else if (!industryId && !fetchdata) {
        setIndustryList(response.data.category);
      }
    } catch (err) {
      showToast(err.message);
    }
  };
  const showToast = (message, type = "error") => {
    Toast.show({
      type: type, // 'success' or 'error'
      text1: message,
      position: "top",
    });
  };

  useEffect(() => {
    if (selected === "edit") getCategory("", "");
    // }
  }, [selected]);

  const handleSubmit = async () => {
    console.log("triggered");
    if (!industry?.trim()) {
      return showToast("Please enter an industry name.");
    }

    if (!category?.trim()) {
      return showToast("Please enter a category name.");
    }

    if (!Array.isArray(subCategories) || subCategories.length === 0) {
      return showToast("Please add at least one subcategory.");
    }

    for (let i = 0; i < subCategories.length; i++) {
      const sub = subCategories[i];
      if (!sub.name?.trim()) {
        return showToast(`Subcategory ${i + 1} name is required.`);
      }
      if (!Array.isArray(sub.services) || sub.services.length === 0) {
        return showToast(
          `Please add at least one brand in subcategory ${i + 1}.`
        );
      }
      for (let j = 0; j < sub.services.length; j++) {
        if (!sub.services[j]?.name?.trim() && selected === "edit") {
          return showToast(`Brand ${j + 1} in subcategory ${i + 1} is empty.`);
        } else if (!sub.services[j]?.trim() && selected === "add") {
          return showToast(`Brand ${j + 1} in subcategory ${i + 1} is empty.`);
        }
      }
    }

    let finalData = {
      industry,
      category,
      subCategories,
    };

    let uri =
      selectedCategory && selected === "edit"
        ? "http://192.168.174.158:5000/adminCategories/editCategory"
        : "http://192.168.174.158:5000/adminCategories/";

    if (selectedCategory && selected === "edit") {
      finalData = {
        ...finalData,
        selectedIndustry: selectedIndustry,
        selectedCategory: selectedCategory,
      };
    }

    try {
      const response = await axios({
        method: selectedCategory && selected === "edit" ? "put" : "post",
        url: uri,
        data: finalData,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('response :', response)
      if (response.status === 200) {
        showToast(response.data.message);
        setCategory("");
        setSubCategories([{ name: "", services: [""] }]);
      }
    } catch (error) {
      if (error.response?.data?.code === 409) {
        showToast("You have already entered this field!");
      }
      console.log("Backend error:", error.response?.data);
    }
  };

  return (
    <SafeAreaView>
      {/* Toast */}
      <View className="z-50">
        <Toast />
      </View>

      <View className=" flex h-screen mb-24">
        {/* Swicher */}
        <View className="h-[10%] ">
          <OperationSwitcher
            setIndustry={setIndustry}
            setCategory={setCategory}
            setSubCategories={setSubCategories}
            selected={selected}
            setSelected={setSelected}
            setSelectedCategory={setSelectedCategory}
          />
        </View>

        <View
          className={`${
            Platform.OS === "web" && width >= 1024
              ? "flex-row"
              : selected === "add"
              ? "flex-col max-h-[50%]"
              : ""
          } flex-1 flex gap-2 p-2 mt-8`}
        >
          {selected === "add" || (selected === "edit" && selectedCategory) ? (
            <>
              <AdminCat
                industry={industry}
                handleSubmit={handleSubmit}
                setIndustry={setIndustry}
                category={category}
                setCategory={setCategory}
                subCategories={subCategories}
                setSubCategories={setSubCategories}
              />
            </>
          ) : (
            <EditCategory
              getCategory={getCategory}
              categoryList={categoryList}
              setCategoryList={setCategoryList}
              Toast={Toast}
              showToast={showToast}
              setSelected={setSelected}
              setSelectedCategory={setSelectedCategory}
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
              industryList={indutryList}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CategoryManager;
