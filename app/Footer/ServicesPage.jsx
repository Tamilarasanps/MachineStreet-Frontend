import { View, Text, ScrollView } from "react-native";

const services = [
  {
    title: "Mechanic Portfolio Management",
    desc: "Our app allows mechanics to showcase their skills, certifications, and past projects in one centralized portfolio. Industries can quickly evaluate and select the right professional for their machinery, ensuring reliability and efficiency in operations. This reduces downtime and improves overall productivity.",
    icon: "🔧",
  },
  {
    title: "Industry-Match System",
    desc: "We connect industries with mechanics based on their expertise and the specific machines used in production. Our smart matching system filters professionals by skill, location, and availability, making it easier to find qualified technicians for urgent or specialized maintenance tasks.",
    icon: "🏭",
  },
  {
    title: "Quick Response",
    desc: "When machinery breaks down, downtime is costly. Our app ensures that verified mechanics can be contacted instantly, reducing response time and minimizing disruption to industrial operations. Fast, reliable assistance is just a tap away.",
    icon: "⏱",
  },

];

export default function ServicesPage() {
  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <Text className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Services
        </Text>

        {/* Service Cards */}
        <View className="flex flex-row flex-wrap justify-center gap-6">
          {services.map((service, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 w-full sm:w-[45%] lg:w-[30%] hover:shadow-xl transition"
            >
              <Text className="text-5xl mb-4">{service.icon}</Text>
              <Text className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </Text>
              <Text className="text-sm text-gray-700 leading-relaxed">
                {service.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export const options = {
  headerShown: false,
};
