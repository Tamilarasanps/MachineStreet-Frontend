import { Modal, ScrollView, Text, View, Pressable, Platform } from "react-native";
import { BlurView } from "expo-blur";

const ServiceModal = ({ onclose, viewServiceModal, selectedMechanic, isDesktop }) => {
  return (
    <Modal
      visible={viewServiceModal}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={()=>onclose()}
    >
      <BlurView intensity={Platform.OS === 'ios' ? 50 : 100} tint="dark" style={{ flex: 1 }}>
        <View
          className="bg-gray-300 rounded-xl p-6 max-h-[80%] m-auto"
          style={{ width: isDesktop ? "40%" : "90%" }}
        >
          <ScrollView>
            {selectedMechanic?.subcategory?.map((sub, subIndex) => (
              <View key={subIndex} className="mb-4">
                <Text className="font-bold text-lg mb-1">
                  {sub.name.charAt(0).toUpperCase() + sub.name.slice(1)}:
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {sub.services.map((service, idx) => (
                    <Text
                      key={idx}
                      className="bg-gray-200 px-3 py-1 rounded-full"
                    >
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </Text>
                  ))}
                </View>
              </View>
            ))}

            <Text className="text-lg font-bold mt-4">Services:</Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {selectedMechanic?.services?.map((service, index) => (
                <Text
                  key={index}
                  className="bg-yellow-500 px-2 py-1 rounded-sm font-semibold text-md text-black"
                >
                  {service.charAt(0).toUpperCase() + service.slice(1)}
                </Text>
              ))}
            </View>
          </ScrollView>

          <Pressable
            className="mt-4 self-end"
            onPress={()=>onclose()}
          >
            <Text className="text-blue-600 font-bold">Close</Text>
          </Pressable>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ServiceModal;
