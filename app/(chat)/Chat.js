import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  SafeAreaView,
  ImageComponent,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Left from "./leftPart/Left";
import Right from "./RightPart/Right";

import  {AuthContext}  from "@/app/context/AuthProvider";

const ChatPage = () => {
  const [authUser, setAuthUser] = useContext(AuthContext);
  const navigation = useNavigation();
  const [userClick, setUserClick] = useState(false);
  const { width } = useWindowDimensions(); // Corrected usage

  return (
    <SafeAreaView>
      <View className="flex flex-row h-screen w-screen">
        <Left width={width} userClick={userClick} setUserClick={setUserClick} />
        <Right
          width={width}
          setUserClick={setUserClick}
          userClick={userClick}
        />
        {/* <Logout /> */}
      </View>
    </SafeAreaView>
  );
};

export default ChatPage;
