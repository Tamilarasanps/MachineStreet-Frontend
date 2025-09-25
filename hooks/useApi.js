import axios from "axios";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useAppContext } from "@/context/AppContext";

const useApi = () => {
  // const API_URL = "https://api-machinestreets.onrender.com"
  // const API_URL =
  //   Platform.OS === "web"
  //     ? "http://localhost:5000"
  //     : "http://192.168.1.10:5000";
  const API_URL = "https://api.machinestreets.com";
  // ok
  const { startLoading, stopLoading } = useAppContext();
  const handleRequest = async (request) => {
    try {
      startLoading();
      const response = await request();

      const successMessage = response?.data?.message || response?.data;
      const description = response?.data?.description || response?.data;

      if (successMessage && typeof successMessage === "string") {
        stopLoading();
        Toast.show({
          type: "success",
          text1: successMessage,
          text2: description,
          position: "top",
          visibilityTime: 3000, // 3 seconds
          autoHide: true, // must be true for mobile
          topOffset: 50, // optional, prevent overlapping header
          animationType: "slide", // optional
        });
      }
      return response;
    } catch (err) {
      if (err?.response?.status === 401) {
        router.replace("/SignUp");
      }

      console.log("err :", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "An error occurred";

      const description =
        err.response?.data?.description ||
        err.response?.data ||
        err.description ||
        "";

      if (errorMessage && typeof errorMessage === "string") {
        Toast.show({
          type: "error",
          text1: errorMessage,
          text2: description,
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
          animationType: "slide",
        });
      }

      return null;
    } finally {
      stopLoading();
    }
  };

  const getHeader = async (contentType, secure) => {
    let token = null;
    if (secure && Platform.OS !== "web") {
      token = await SecureStore.getItemAsync("token"); // 👈 await properly
    }

    return {
      "Content-Type": contentType,
      Accept: "application/json",
      ...(secure && token && { Authorization: `Bearer ${token}` }),
    };
  };

  const GETAPI = async (path, contentType, { secure }) =>
    handleRequest(async () =>
      axios.get(`${API_URL}/${path}`, {
        headers: await getHeader(contentType, secure),
        withCredentials: Platform.OS === "web",
      })
    );

  const POSTAPI = async (path, data, contentType, { secure }) =>
    handleRequest(async () =>
      axios.post(`${API_URL}/${path}`, data, {
        headers: await getHeader(contentType, secure),
        withCredentials: Platform.OS === "web",
      })
    );

  const PATCHAPI = async (path, data, contentType, { secure }) =>
    handleRequest(async () =>
      axios.patch(`${API_URL}/${path}`, data, {
        headers: await getHeader(contentType, secure),
        withCredentials: Platform.OS === "web",
      })
    );

  const DELETEAPI = async (path, data, contentType, { secure }) =>
    handleRequest(async () =>
      axios.delete(`${API_URL}/${path}`, {
        headers: await getHeader(contentType, secure),
        withCredentials: Platform.OS === "web",
        data,
      })
    );

  return {
    getJsonApi: (path, contentType, secure) =>
      GETAPI(path, contentType, secure),
    postJsonApi: (path, data, contentType, secure) =>
      POSTAPI(path, data, contentType, secure),
    patchApi: (path, data, contentType, secure) =>
      PATCHAPI(path, data, contentType, secure),
    deleteApi: (path, data, contentType, secure) =>
      DELETEAPI(path, data, contentType, secure),
  };
};

export default useApi;
