import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Keyboard, Platform } from "react-native"; // <-- ADD THIS
// import HomeStack, { SellStack, WishlistStack } from "./HomeStack";
// import ScreenNavigation, { MechanicProfile } from "./ScreenNavigation";
// import SellScreen from "@/app/screens/(sellerForm)/SellScreen";
// import WishlistScreen from "@/app/screens/(wishlists)/WishlistScreen";
// import ProfileStack from "./ProfileStack";
import MechanicList_2 from "@/app/mechanicApp/MechanicList_2";
// import { color } from "@rneui/base";
// import ProfilePage from "@/app/screens/(profile)/ProfilePage";
import LandingPage from "@/app/screens/LandingPage";
import MechanicProfileStack from "./MechanicProfileStack";
import AuthStack from "./AuthStack";
import ProfilePage from "@/app/screens/(profile)/ProfilePage";

const Tab = createBottomTabNavigator();

function BottomNavBar() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // 👇 ADD THIS useEffect TO HANDLE KEYBOARD EVENTS
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    // <Tab.Navigator
    //   initialRouteName="HomePage"
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarStyle: {
    //       backgroundColor: "white",
    //       borderRadius: 10,
    //       height: 75,
    //       display: isKeyboardVisible ? "none" : "flex", // ✅ DYNAMIC HIDE
    //     },
    //     tabBarActiveTintColor: "teal",
    //     tabBarInactiveTintColor: "grey",
    //   }}
    // >
    //   <Tab.Screen
    //     name="HomePage"
    //     component={HomeStack}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <Icon name="home" color={color} size={30} />
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Category"
    //     component={ScreenNavigation}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <Icon name="cogs" color={color} size={30} />
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Sell"
    //     component={SellStack}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <Icon name="plus" color={color} size={30} />
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Fav"
    //     component={WishlistStack}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <Icon name="star" color={color} size={30} />
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Profile"
    //     component={ProfileStack}
    //     options={{
    //       tabBarIcon: ({ color }) => (
    //         <Icon name="user" color={color} size={30} />
    //       ),
    //     }}
    //   />
    // </Tab.Navigator>

    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderRadius: 10,
          height: 75,
          display: isKeyboardVisible ? "none" : "flex", // ✅ DYNAMIC HIDE
        },
        tabBarActiveTintColor: "teal",
        tabBarInactiveTintColor: "grey",
      }}
    >
      <Tab.Screen
        name="HomePage"
        component={LandingPage}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MechanicProfiles"
        component={MechanicList_2}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-cog"
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MechanicProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavBar;
