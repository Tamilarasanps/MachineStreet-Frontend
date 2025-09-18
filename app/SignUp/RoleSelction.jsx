import { View, Text, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Loading from "@/components/Loading";

const roles = [
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Hire verified mechanics for your business needs.",
    icon: "account-tie-outline",
  },
  {
    id: "mechanic",
    title: "Mechanic",
    description: "Grow your business by reaching more recruiters.",
    icon: "wrench-outline",
  },
];

const RoleSelection = ({ userDetails, setUserDetails, setStep, isLoading = false }) => {
  const handleSelect = (value) => {
    setUserDetails((prev) => ({ ...prev, role: value }));
  };

  const handleNext = () => {
    if (userDetails.role) setStep(1);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        // flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        maxHeight:'100%'
      }}
      keyboardShouldPersistTaps="always"
    >
      <Text className="text-xl md:text-2xl font-bold text-TealGreen mb-8 text-center">
        What describes you best
      </Text>

      <View className="w-full gap-6">
        {roles.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => handleSelect(item.id)}
            className={`w-full p-4 rounded-xl border shadow-sm flex items-center ${
              userDetails.role === item.id
                ? "bg-TealGreen border-TealGreen"
                : "bg-white border-gray-300"
            }`}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={36}
              color={userDetails.role === item.id ? "#fff" : "#4B5563"}
              className="mb-2"
            />
            <Text
              className={`text-lg font-semibold ${
                userDetails.role === item.id ? "text-white" : "text-gray-800"
              }`}
            >
              {item.title}
            </Text>
            <Text
              className={`text-sm text-center mt-1 leading-tight ${
                userDetails.role === item.id ? "text-white" : "text-gray-500"
              }`}
            >
              {item.description}
            </Text>

            {userDetails.role === item.id && (
              <View className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full" />
            )}
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleNext}
        disabled={!userDetails.role || isLoading}
        className={`w-full bg-TealGreen mt-10 px-6 py-3 rounded-lg h-12 flex items-center justify-center ${
          !userDetails.role || isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        {isLoading ? (
          <Loading bgColor="#2095A2" gearColor="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-base text-center">Next</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.replace("/Login")} className="mt-6">
        <Text className="text-center font-semibold underline">
          Already have an account? Login
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default RoleSelection;
