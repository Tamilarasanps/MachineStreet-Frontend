import { useState, useEffect } from "react";
import useApi from "./useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingContext } from "../context/LoadingContext";

const GetMechanic = () => {
  const { getJsonApi } = useApi();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({});
  const [industries, setIndustries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [otherThanIndiaLocation, setOtherThanIndiaLocation] = useState([]);
  const [qr, setQr] = useState(true);

  useEffect(() => {
    async function fetchMechanics() {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");
        const data = await getJsonApi(
          `mechanicList/?page=${page}&limit=50`,
          token
        );
        // console.log("data :", data);

        setMechanics(data?.data?.mechanics?.data);
        setTotalPages(data?.data?.mechanics?.totalPages);
        setIndustries(data?.data?.industry);
        setCategories(data?.data?.category);
        setLocation(data?.data?.location);
        setOtherThanIndiaLocation(data?.data?.otherThanIndia);
        setQr(data?.data?.mechanics?.qr);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMechanics();
  }, [page]);

  return {
    loading, 
    mechanics,
    setMechanics,
    industries,
    categories,
    location,
    page,
    setPage,
    totalPages,
    setTotalPages,
    setOtherThanIndiaLocation,
    otherThanIndiaLocation,
    setQr,
    qr,
  };
};

export default GetMechanic;
