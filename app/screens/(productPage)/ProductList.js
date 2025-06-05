import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import useApi from "@/app/hooks/useApi";
import GuidePage from "../(Homepage)/GuidePage";
import Footer from "@/app/component/(footer)/Footer";
import { Ionicons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";
import All from "@/app/component/(subMenu)/All";
import FilterComponent from "@/app/mechanicApp/Filter";

export default function ProductList() {
  const router = useRouter();
  const route = useRoute();
  const navigation = useNavigation();

  const { getJsonApi } = useApi();
  const { width } = useWindowDimensions();
  const screen = width > 1024;
  const [products, setProducts] = useState([]);

  // console.log(products, "productdsd");
  // const [originalProducts, setOriginalProducts] = useState([]);

  const [activeFilter, setActiveFilter] = useState(null);
  // const [selectedId, setSelectedId] = /useState("1");
  const [otherThanIndia, setOtherThanIndia] = useState(false);
  const priceSuggestions = ["500", "1000", "5000", "10000"];
  const [selectedPriceType, setSelectedPriceType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  // const [selectedBrand, setSelectedBrand] = useState("");
  const [statesWithDistricts, setStateWithDistricts] = useState([]);
  const radioButtonData = [
    { id: "1", label: "Fixed", value: "fixed" },
    { id: "2", label: "Negotiable", value: "negotiable" },
  ];
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const [makes, setMakes] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [otherThanIndiaLocation, setOtherThanIndiaLocation] = useState([]);
  let dataToMap = otherThanIndia ? otherThanIndiaLocation : statesWithDistricts;

  const [price, setPrice] = useState({
    fromPrice: "",
    toPrice: "",
  });

  // filter products

  const filteredProducts = products.filter((product) => {
    const matchesPriceType = selectedPriceType
      ? (product?.priceType).toLowerCase().trim() ===
        (selectedPriceType === 1 ? "fixed " : "negotiable")
      : true;
    const matchesPriceFrom = price.fromPrice
      ? product.price >= Number(price.fromPrice)
      : true;

    const matchesPriceTo = price.toPrice
      ? product.price <= Number(price.toPrice)
      : true;
    const matchesBrand =
      selectedMakes.length > 0 ? selectedMakes.includes(product.make) : true;

    const matchesState = selectedState
      ? otherThanIndia
        ? product.country === selectedState
        : product.region === selectedState
      : true;

    const matchesDistrict =
      selectedDistrict.length > 0
        ? selectedDistrict.includes(
            otherThanIndia ? product.region : product.district
          )
        : true;
    return (
      matchesPriceType &&
      matchesPriceFrom &&
      matchesPriceTo &&
      matchesBrand &&
      matchesState &&
      matchesDistrict
    );
  });

  const searchTerm = useMemo(() => {
    if (Platform.OS === "web") {
      const { searchTerms, category, industry } = useLocalSearchParams();
      return [searchTerms, category, industry];
    } else {
      const { searchTerms, category, industry } = route.params;
      return [searchTerms, category, industry];
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm && page]);

  const fetchProducts = async () => {
    try {
      const query = searchTerm
        .map((term) => `searchTerm=${encodeURIComponent(term)}`)
        .join("&");
      const data = await getJsonApi(
        `productPage?${query}&page=${page}&limit=50`
      );
      setTotalPages(data?.data?.products[0]?.totalCount);
      setMakes([...new Set(data?.data?.products[0]?.makes || [])]);
      setOtherThanIndiaLocation(data?.data?.products[0]?.OtherThanIndia);
      setProducts(data?.data?.products[0]?.productsWithFiles);
      setStateWithDistricts(data?.data?.products[0]?.India);
      // setOriginalProducts(data?.data.products); // 👈 Save full copy here
    } catch (error) {
      console.error(error);
    }
  };

  if (Platform.OS === "web") {
    industry = useLocalSearchParams().industry;
  } else {
    industry = route?.params?.industry;
  }

  const handleProductPress = (product) => {
    if (Platform.OS === "web") {
      // router.push(`/(screen)/SelectProduct?id=${product}`);
      router.push(`/screens/(productPage)/SelectProduct?id=${product}`);
    } else {
      navigation.navigate("SelectProduct", { id: product });
    }
  };

  console.log("selectedPriceType :", otherThanIndiaLocation);

  const toggleFilter = (filter) =>
    setActiveFilter(activeFilter === filter ? null : filter);
  return (
    <ScrollView>
      <SafeAreaView>
        <All />
        <View
          className="flex flex-row pt-2 pl-2 mt-1 bg-zinc-100 shadow items-center "
          style={{ zIndex: -1 }}
        >
          <Text className="text-lg">Home</Text>
          <Ionicons
            name="chevron-forward"
            size={13}
            color="black"
            style={{ marginTop: "5px" }}
          />
          {products && Object.keys(products).length > 0 && (
            <View>
              <Text className="text-gray-500 text-lg">
                {products[Object.keys(products)[0]]?.industry ||
                  "No industry information available"}
              </Text>
            </View>
          )}
        </View>
        {!screen && !isOpen && (
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Octicons
              name="filter"
              size={24}
              color="black"
              className="ml-2 mt-2"
            />
          </Pressable>
        )}

        <View style={{ zIndex: -1 }}>
          <View className="flex flex-row px-3 rounded-sm mt-6 mb-4  ">
            {/* Sidebar Filter */}
            {(width >= 1024 || toggleFilter) && (
              <View
                className={`${width < 1024 ? "absolute z-50 w-[90%]" : ""}`}
              >
                <FilterComponent
                  page="machine"
                  radioButtonData={radioButtonData}
                  setSelectedPriceType={setSelectedPriceType}
                  selectedPriceType={selectedPriceType}
                  price={price}
                  dataToMap={dataToMap}
                  otherThanIndia={otherThanIndia}
                  setOtherThanIndia={setOtherThanIndia}
                  otherThanIndiaLocation={otherThanIndiaLocation}
                  setOtherThanIndiaLocation={setOtherThanIndiaLocation}
                  setSelectedMakes={setSelectedMakes}
                  location={statesWithDistricts}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  ProductList={ProductList}
                  priceSuggestions={priceSuggestions}
                  setPrice={setPrice}
                  setSelectedDistricts={setSelectedDistricts}
                  selectedDistricts={selectedDistricts}
                  makes={makes}
                  selectedMakes={selectedMakes}
                />
              </View>
            )}

            {/* Main Product List */}
            <ScrollView
              className={`${isOpen ? "w-[80%]" : "w-full"} mb-4 transition-all`}
            >
              <View
                className="grid gap-4 mt-2 px-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                }}
              >
                {filteredProducts?.length > 0 &&
                  filteredProducts.map((product) => (
                    <Pressable
                      // key={product._id}
                      onPress={() => handleProductPress(product._id)}
                      className="mb-4"
                      style={{
                        width: Platform.OS !== "web" ? "90%" : "100%",
                        maxWidth: 400,
                        margin: "auto",
                      }}
                    >
                      <View className="rounded-2xl p-3 bg-white border border-gray-300 shadow-sm">
                        <View style={{ position: "relative", zIndex: -1 }}>
                          <Image
                            className="rounded-md"
                            source={{
                              uri: `data:image/jpeg;base64,${product.machineImages[0]}`,
                            }}
                            style={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                            }}
                          />
                          <View className="flex flex-row items-center justify-between mt-4 mb-2">
                            <View className="p-2 w-[100px] bg-TealGreen rounded-md justify-center items-center">
                              <Text className="text-white text-base font-bold">
                                ₹ {product.price}
                              </Text>
                            </View>
                            <Text className="text-TealGreen font-bold text-base">
                              {product.condition}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text className="text-TealGreen font-semibold mt-2 mb-1 truncate">
                            {product.category}
                          </Text>
                          <Text
                            className="text-gray-600 font-semibold mt-1 overflow-hidden"
                            numberOfLines={2}
                          >
                            {product.description}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
              </View>

              {/* Pagination (optional) */}
              <View className="flex flex-row gap-8">
                <Pressable
                  disabled={page === totalPages}
                  onPress={() => {
                    console.log("triggered");
                    setPage(page + 1);
                  }}
                >
                  <Text className="font-semibold cursor-pointer">Next</Text>
                </Pressable>
                <Pressable
                  disabled={page === 1}
                  onPress={() => setPage(page - 1)}
                >
                  <Text className="font-semibold cursor-pointer">Prev</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>

          {/* Web only footer sections */}
          {Platform.OS === "web" && <GuidePage />}
          {Platform.OS === "web" && <Footer />}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
