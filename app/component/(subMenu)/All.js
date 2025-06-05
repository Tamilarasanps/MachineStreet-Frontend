import {
  View,
  Text,
  Platform,
  Pressable,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, Link } from "expo-router";
import useApi from "@/app/hooks/useApi";

export default function All() {
  const [show, setShow] = useState(false);
  // const [subCategoryShow, setSubCategoryShow] = useState(false);
  // const [hoverClr, setHoverClr] = useState(null);
  const [industries, setIndustries] = useState([]);
  // console.log("indus :", industries);
  // const [subCategories, setSubCategories] = useState([]);
  // console.log("subcategory :", subCategories);
  const [industry, setIndustry] = useState(null);
  const [hoveredIndustry, setHoveredIndustry] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  // console.log(industries);

  const { width } = useWindowDimensions();
  // const isScreen = width > 430;
  const { getJsonApi } = useApi();

  // const [showSubItems, setShowSubItems] = useState(false);

  // Use a ref for the timeout so it persists across renders
  const closeTimeout = useRef(null);

  useEffect(() => {
    if (industry) {
      getCategory();
    }
  }, [industry]);

  useEffect(() => {
    getIndustries();
  }, []);

  const getIndustries = async () => {
    try {
      const data = await getJsonApi(`CategoryPage`);

      // console.log("Industries API Response:", data.data);
      setIndustries(data.data.industries || []);
    } catch (err) {
      console.log("API Error:", err);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);
  
  return (
    <View>
      {/* Web-only navigation menu */}
      {Platform.OS === "web" && (
        <View
          className="flex flex-row w-full mb-2 mt-5 z-50 justify-center"
          style={{ position: "sticky", top: 0 }}
        >
          {/* Industries Dropdown */}
          <Pressable className="flex-1 relative">
            <Text
              className="text-center text-TealGreen text-sm font-semibold md:text-lg md:font-bold"
              onMouseEnter={() => setShow(true)}
            >
              Industries
            </Text>

            {show && (
              <View
                className="absolute left-0 z-50 flex flex-row shadow-xl ml-10 mt-14 rounded-lg border border-gray-200"
                onMouseLeave={() => {
                  setShow(false);
                  setHoveredIndustry(null);
                  setHoveredCategory(null);
                }}
              >
                {/* Industries */}
                <View className="bg-white p-2 min-w-[170px] space-y-1">
                  {industries?.industries?.map((industry, index) => (
                    <Link
                      key={industry?.id || index}
                      href={`/screens/CategoryList/?industry=${encodeURIComponent(
                        industry?.name || industry
                      )}`}
                      asChild
                    >
                      <Text
                        key={index}
                        className={`cursor-pointer px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                          hoveredIndustry === industry
                            ? "bg-TealGreen text-white font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        onMouseEnter={() => {
                          setHoveredIndustry(industry);
                          setHoveredCategory(null);
                        }}
                      >
                        {industry}
                      </Text>
                    </Link>
                  ))}
                </View>

                {/* Categories */}
                {hoveredIndustry && (
                  <View className="bg-gray-50 p-2 min-w-[170px] space-y-1 border-l border-gray-200">
                    {(
                      industries?.categories.find((c) => c[hoveredIndustry])?.[
                        hoveredIndustry
                      ] || []
                    ).map((category, index) => (
                      <Link
                        key={industry?.id || index}
                       href={`/screens/CategoryList/?industry=${encodeURIComponent(hoveredIndustry)}&category=${encodeURIComponent(category)}`}

                        asChild
                      >
                        <Text
                          key={index}
                          className={`cursor-pointer px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                            hoveredCategory === category
                              ? "bg-TealGreen text-white font-semibold"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                          onMouseEnter={() => setHoveredCategory(category)}
                        >
                          {category}
                        </Text>
                      </Link>
                    ))}
                  </View>
                )}

                {/* Subcategories */}
                {hoveredCategory && (
                  <View className="bg-blue-50 p-2 min-w-[170px] space-y-1 border-l border-blue-200">
                    {(
                      industries?.subcategories.find(
                        (s) => s[hoveredCategory]
                      )?.[hoveredCategory] || []
                    ).map((sub, index) => (
                      <Pressable
                        onPress={() => {
                          // function handleProductPress(subCategory) {
                          if (Platform.OS === "web") {
                            router.push(
                              `/screens/(productPage)/ProductList?searchTerms=${sub}&category=${hoveredCategory}&industry=${hoveredIndustry}`
                            );
                          } else {
                            navigation.navigate("ProductList", {
                              searchTerms: sub,
                              category: hoveredCategory,
                              industry: hoveredIndustry,
                            });
                          }
                          // }
                        }}
                      >
                        <Text
                          key={index}
                          className="px-3 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded-md transition-all duration-200"
                        >
                          {sub}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Pressable>

          {/* Mechanics Link */}
          <Link
            href={`/(components)/Client/(screen)/ProductList?priceType=fixed`}
            asChild
          >
            <Pressable className="flex-1">
              <Text className="text-center text-TealGreen text-sm font-semibold md:text-lg md:font-bold">
                Mechanics
              </Text>
            </Pressable>
          </Link>

          {/* Location Link */}
          {/* <Link href={`/screens/LocationBased?priceType=negotiable`} asChild>
            <Pressable className="flex-1">
              <Text className="text-center text-TealGreen text-sm font-semibold md:text-lg md:font-bold">
                Location
              </Text>
            </Pressable>
          </Link> */}

          {/* Favourite */}
          <Pressable
            className="flex-1"
            onPress={() => router.push("/screens/(wishlists)/WishlistScreen")}
          >
            <Text className="text-center text-TealGreen text-sm font-semibold md:text-lg md:font-bold">
              Favourite
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
