import React, { useState, useCallback } from "react";
import { ScrollView, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReLoader() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Pull down to refresh!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
