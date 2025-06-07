import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import useConversation from "../stateManagement/useConversation";
import axios from "axios";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const { selectedConversation } = useConversation();
  const [userNotFound, setUserNotFound] = useState(false);

  const { getJsonApi } = useApi();
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      // setLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken"); // Retrieve token from AsyncStorage
        // console.log(token + "bhbh");
        const response = await getJsonApi(
          `message/getUsers/${selectedConversation}`,
          token
        );
        if (response.status === 404) {
          setUserNotFound(true);
        }
        setAllUsers(response.data);
      } catch (error) {
        console.log("Error in useGetAllUsers: " + error);
      } finally {
        // setLoading(false);
      }
    };

    getUsers();
  }, []);

  return [allUsers];
}

export default useGetAllUsers;
