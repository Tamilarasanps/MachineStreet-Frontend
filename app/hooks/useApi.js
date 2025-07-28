import axios from "axios";
import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";

const useApi = () => {
  // const API_URL = "https://api.machinestreets.com";
  const API_URL = "http://192.168.1.10:5000";

  const handleRequest = useCallback(async (request, path, token) => {
    try {
      const response = await request();
      const successMessage =
        response?.data?.message || response?.data || "Request successful";

      if (typeof successMessage === "string") {
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: successMessage,
          position: "top",
          visibilityTime: 2000,
        });
      }

      return response;
    } catch (err) {
      console.log("err :", err);
      let message = "An error occurred";

      if (err.code === "ECONNABORTED") {
        message = "Request timed out";
      } else if (!err.response) {
        message = "Network Error";
      } else {
        const status = err?.status || err?.response?.status;
        const errorText = err.response?.data?.error || "";

        message =
          err.response?.data?.message ||
          errorText ||
          err.message ||
          "Something went wrong";

        if (status === 401) {
          message = "Unauthorized. Please login again.";
          await AsyncStorage.multiRemove(["userToken", "role", "userId"]);
        } else if (status === 403) {
          message = "Access denied.";
        } else if (status === 404) {
          message = "Resource not found.";
        } else if (status === 500) {
          message = "Server error. Try again later.";
        }
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 2000,
      });

      return null;
    }
  }, []);

  const jsonHeader = (token) => ({
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  const GETAPI = async (path, token) =>
    await handleRequest(
      () => axios.get(`${API_URL}/${path}`, { headers: jsonHeader(token) }),
      path,
      token
    );
  const POSTAPI = async (path, data, token, onUploadProgress) => {
    const isFormData = data instanceof FormData;

    return await handleRequest(
      () =>
        axios.post(`${API_URL}/${path}`, data, {
          headers: {
            ...(isFormData
              ? {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                }
              : jsonHeader(token)),
          },
          timeout: 5 * 60 * 1000,
          onUploadProgress,
        }),
      path,
      token
    );
  };

  const PATCHAPI = async (path, data, token) =>
    await handleRequest(
      () =>
        axios.patch(`${API_URL}/${path}`, data, {
          headers: jsonHeader(token),
        }),
      path,
      token
    );

  const DELETEAPI = async (path, data, token) =>
    await handleRequest(
      () =>
        axios.delete(`${API_URL}/${path}`, {
          data,
          headers: jsonHeader(token),
        }),
      path,
      token
    );

  return {
    getJsonApi: (path, token) => GETAPI(path, token),
    postJsonApi: (path, data, token, onUploadProgress) =>
      POSTAPI(path, data, token, onUploadProgress),
    pathchApi: (path, data, token) => PATCHAPI(path, data, token),
    deleteApi: (path, data, token) => DELETEAPI(path, data, token),
  };
};

export default useApi;
