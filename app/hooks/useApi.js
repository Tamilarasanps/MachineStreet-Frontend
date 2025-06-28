import axios from "axios";
import Toast from "react-native-toast-message";

const useApi = () => {
  const API_URL = "https://api.machinestreets.com";

  const handleRequest = async (request, path, token) => {
    try {
      const response = await request();

      const successMessage =
        response?.data?.message || response?.data || "Request successful";
      if (typeof successMessage === "string") {
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: successMessage, // Your dynamic message here
          position: "top", // not "placement"
          visibilityTime: 2000, // instead of "duration"
        });
      }

      return response;
    } catch (err) {
      // console.log('err :', err)
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "An error occurred";

      if (typeof errorMessage === "string") {
        // Toast.show(errorMessage, {
        //   type: "danger",
        //   placement: "top",
        //   duration: 3000,
        // });
        Toast.show({
          type: "error", //
          text1: errorMessage,
          position: "top",
          visibilityTime: 2000,
          animation: "slide",
        });
      }

      throw err;
    }
  };

  const jsonHeader = (token) => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  const GETAPI = async (path, token) =>
    await handleRequest(
      () => axios.get(`${API_URL}/${path}`, { headers: jsonHeader(token) }),
      path,
      token
    );

  const POSTAPI = async (path, data, token) =>
    await handleRequest(
      () =>
        axios.post(`${API_URL}/${path}`, data, { headers: jsonHeader(token) }),
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
    postJsonApi: (path, data, token) => POSTAPI(path, data, token),
    pathchApi: (path, data, token) => PATCHAPI(path, data, token),
    deleteApi: (path, data, token) => DELETEAPI(path, data, token),
  };
};

export default useApi;
