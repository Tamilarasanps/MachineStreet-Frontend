import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import useApi from "@/app/hooks/useApi";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

export default function Header({
  page,
  setMechanicSearchResults,
  searchBar,
  setSearchBar,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width > 1024;
  // const [searchBar, setSearchBar] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { getJsonApi } = useApi();
  const navigation = useNavigation();

  useEffect(() => {
    if (isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  const fetchSearchResult = async () => {
    try {
      const data = await getJsonApi(
        `searchResult/search?searchTerms=${searchBar}&page=${page}`
      );
      console.log(data);

      if (page === "mechanic" && data.status === 200) {
        console.log("reached mmm");
        console.log("reached mmm :", data.data.structuredResult);
        setMechanicSearchResults(data.data.users);
      } else {
        console.log("datb :", data);
        setSearchResults(data.data.users || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (searchBar?.length) {
      fetchSearchResult();
    } else {
      setSearchResults([]);
    }
  }, [searchBar]);

  const filteredResults = searchResults.filter((item) =>
    item.toLowerCase().startsWith(searchBar.toLowerCase())
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowResults(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  return (
    <View
      className="bg-TealGreen w-full px-4 py-3"
      style={{ position: "sticky", top: 0, zIndex: 50 }}
    >
      <View className="flex-row items-center ">
        {/* Logo */}
        <Text className="text-white text-xl font-bold shrink-0 w-[100px] ">
          Machine Street
        </Text>

        {/* Search Bar */}
        <View
          ref={searchRef}
          className="flex-row bg-white rounded-md items-center flex-1 min-w-0 relative mx-auto"
          style={{
            maxWidth: isDesktop ? 600 : undefined,
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            className="h-10 flex-1"
            placeholder="Search..."
            value={searchBar}
            onChangeText={(text) => {
              setSearchBar(text);
              setShowResults(text?.length > 0);
            }}
            style={{ outline: "none" }}
          />
          <Link href={`/(screen)/ProductList?searchTerms=${searchBar}`} asChild>
            <Pressable className="absolute right-1">
              <Icon name="search" size={20} color="gray" />
            </Pressable>
          </Link>
        </View>
        <Pressable
          onPress={() => {
            Platform.OS === "web"
              ? router.push("/screens/ProfilePage")
              : navigation.navigate("Profile");
          }}
        >
          <MaterialIcons name="account-circle" size={40} color="white" />
        </Pressable>
        {/* <Pressable
          onPress={() => {
            if (Platform.OS === "web") {
              router.push("/screens/(profile)/ProfilePage");
            } else {
              navigation.navigate("Profile");
            }
          }}
        >
          <MaterialIcons name="account-circle" size={40} color="white" />
        </Pressable> */}

        {/* Right Side Icons */}

        {/* <View className="flex-row items-center gap-14 ">
          {isDesktop ? (
            <>
              <Pressable
                className="bg-red-500 py-2 px-8 rounded-md "
                onPress={() => router.push("/screens/(sellerForm)/SellScreen")}
              >
                <Text className="text-white font-semibold text-base">Sell</Text>
              </Pressable>

              <Pressable
                className="items-center"
                onPress={() =>
                  router.push("/screens/(wishlists)/WishlistScreen")
                }
              >
                <FontAwesome name="star" size={20} color="white" />
                <Text className="text-white font-semibold text-sm">
                  WishList
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push("/(chat)/Chat")}>
                <MaterialIcons name="chat" size={40} color="white" />
              </Pressable>

              <Pressable
                className="mr-2"
                onPress={() => router.push("/screens/ProfilePage")}
              >
                <MaterialIcons name="account-circle" size={40} color="white" />
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => setIsOpen(!isOpen)}
              className="shrink-0 ms-2"
            >
              <MaterialIcons name="menu" size={35} color="white" />
            </Pressable>
          )}
        </View>
        {isOpen && (
          <Pressable
            className="absolute inset-0 z-50"
            onPress={() => setIsOpen(false)}
          >
   
          </Pressable>
        )} */}
      </View>

      {/* Search Results Dropdown */}
      {showResults && filteredResults?.length > 0 && (
        <View
          className="absolute top-12 w-full bg-white border border-gray-300 rounded-md shadow-md z-10 mt-4"
          style={{
            width: isDesktop ? 605 : "58%",
            marginLeft: isDesktop ? 290 : 100,
          }}
        >
          {filteredResults.slice(0, 10).map((item, index) => (
            <Link
              key={index}
              href={`/(screen)/ProductList?searchTerms=${item}`}
              asChild
            >
              <Pressable className="px-4 py-2 hover:bg-gray-200">
                <Text className="text-gray-800 font-semibold">{item}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      )}

      {/* Mobile Dropdown Menu */}
      {!isDesktop && isOpen && (
        <View className="absolute right-2 top-[60px] bg-gray-300 p-4 w-[250px] p-2 rounded-sm shadow-lg">
          {/* <Pressable
            onPress={() => {
              router.push("/screens/(wishlists)/WishlistScreen");
              setIsOpen(false);
            }}
          >
            <View className="flex flex-row items-center space-x-4 p-4 bg-gray-100 rounded-sm mb-2 ">
              <FontAwesome name="star" size={35} color="teal" />
              <Text className="text-gray-500 font-semibold text-lg ms-2">
                WishList
              </Text>
            </View>
          </Pressable>

          <Pressable
            className="flex flex-row items-center space-x-4 p-4 bg-gray-100 rounded-sm mb-2"
            onPress={() => {
              router.push("/(chat)/Chat");
              setIsOpen(false);
            }}
          >
            <MaterialIcons name="chat" size={35} color="teal" />
            <Text className="text-gray-500 font-semibold text-lg ms-2">
              Message
            </Text>
          </Pressable>
          <Pressable
            className="bg-red-500 py-2 px-6 rounded-md mb-2"
            onPress={() => {
              router.push("/screens/(sellerForm)/SellScreen");
              setIsOpen(false);
            }}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Sell
            </Text>
          </Pressable> */}

          <Pressable
            className="flex flex-row items-center space-x-3 p-4 bg-gray-100 rounded-sm mb-2"
            onPress={() => {
              router.push("/screens/(profile)/ProfilePage");
              setIsOpen(false);
            }}
          >
            <MaterialIcons name="account-circle" size={35} color="teal" />
            <Text className="text-gray-500 font-semibold text-lg ms-2">
              Profile
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
