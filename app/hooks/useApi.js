import axios from "axios";
import { useToast } from "react-native-toast-notifications";

const useApi = () => {
  const API_URL = "https://api.machinestreets.com";
  // const API_URL = "http://192.168.1.5:5000";

  const toast = useToast();

  const handleRequest = async (request, path, token) => {
    try {
      const response = await request();
      // console.log('response :', response)
      const successMessage =
        response?.data?.message || response?.data || "Request successful";
      if (typeof successMessage === "string") {
        toast.show(successMessage, {
          type: "success",
          placement: "top",
          duration: 3000,
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
        toast.show(errorMessage, {
          type: "danger",
          placement: "top",
          duration: 3000,
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
  const PATCHAPI = async (path, data, token) =>
    await handleRequest(
      () =>
        axios.patch(`${API_URL}/${path}`, data, { headers: jsonHeader(token) }),
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
