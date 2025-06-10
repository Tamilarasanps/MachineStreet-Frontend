import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Product from "./Product"; // Assuming Product is a component that lists products
// Assuming ProductApprovalModal is the modal component
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import ProductApprovalModal from "./ProctApprovalModal";

const ProductApproval = () => {
  const { getJsonApi, pathchApi } = useApi();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("pending");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getJsonApi(
          `adminApproval/getPendingProducts/${status}`
        );
        // console.log(data);
        setProducts(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [status]);

  const product = products[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < products.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleApprove = (index, statuss) => {
    const token = AsyncStorage.getItem("userToken");
    const updatedProduct = pathchApi(
      `adminApproval/updateAdminApproval/`,
      { productId: products[index]._id, status: statuss },
      token
    );
    setProducts(() => {
      const updated = products;
      updated[index] = updatedProduct.data;
      return updated;
    });
  };

  return (
    // <ScrollView >
    <View className="p-4" style={{ zIndex: -1 }}>
      {/* Status Buttons */}
      <View className="flex flex-col md:flex-row mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <Pressable
          onPress={() => setStatus("pending")}
          className="flex-1 bg-yellow-500 rounded-full py-4 shadow-lg"
          style={{ zIndex: -1 }}
        >
          <Text className="text-center text-white text-lg font-bold">
            Pending Approval
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setStatus("rejected")}
          className="flex-1 bg-red-600 rounded-full py-4 shadow-lg"
        >
          <Text className="text-center text-white text-lg font-bold">
            Rejected
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setStatus("approved")}
          className="flex-1  rounded-full py-4 shadow-lg"
          style={{ backgroundColor: "green" }}
        >
          <Text className="text-center text-white text-lg font-bold">
            Accepted
          </Text>
        </Pressable>
      </View>

      {/* Product List Component */}
      <Product
        products={products}
        status={status}
        setIsModalVisible={setIsModalVisible}
        setCurrentIndex={setCurrentIndex}
      />

      {/* Product Approval Modal */}
      {product && isModalVisible && (
        <ProductApprovalModal
          isVisible={isModalVisible}
          product={product}
          onClose={() => setIsModalVisible(false)}
          onApprove={handleApprove}
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={currentIndex}
          totalProducts={products.length}
        />
      )}
    </View>
  );
};

export default ProductApproval;
