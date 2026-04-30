import InputWOL from "@/components/InputWOL";
import { View, Text, Pressable } from "react-native";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { useCallback } from "react";

const ForgotPassword = ({
  handleSubmit,
  step,
  setShowForgot,
  placehoders,
  setUserDetails,
  setStep
}) => {
  const { isLoading } = useAppContext();
  return (
    <View className="w-full p-6">
      {/* Header */}
      <Text className="text-2xl font-bold mb-2 text-center text-TealGreen">
        🔒 {"Forgot Password"}
      </Text>
      <Text className="text-sm text-gray-600 mb-8 text-center">
        Please enter your registered mobile number
      </Text>

      {/* Dynamic Inputs */}
      {["Mobile", "Otp"].map((label, idx) => {
        if (label === "Otp" && step !== 1) {
          return null;
        } else {
          return (
            <InputWOL
              key={idx}
              label={label}
              placeholder={placehoders[idx]}
              onChangeText={(text) =>
                setUserDetails((prev) => ({
                  ...prev,
                  [idx === 0 ? "mobile" : "otp"]: text,
                }))
              }
            />
          );
        }
      })}

      {/* Actions */}
      <View className="flex-row justify-between mt-24">
        {[
          {
            text: "Cancel",
            onPress: () => {
              setStep(0)
              setShowForgot(false)
            },
            bg: "bg-gray-300",
            textColor: "text-gray-800",
          },
          {
            text: "Submit",
            onPress: handleSubmit, // will be overridden in Pressable
            bg: "bg-TealGreen",
            textColor: "text-white",
            loading: true,
          },
        ].map((btn, i) => (
          <Pressable
            key={i}
            disabled={isLoading && btn.text === "Submit"}
            onPress={btn.text === "Submit" ? handleSubmit : btn.onPress}
            className={`${btn.bg} px-5 py-3 rounded-xl flex-1 ${
              i === 0 ? "mr-2" : "ml-2"
            } h-12 items-center justify-center`}
          >
            {btn.loading && isLoading ? (
              <Loading />
            ) : (
              <Text className={`${btn.textColor} font-semibold text-center`}>
                {btn.text}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default ForgotPassword;
