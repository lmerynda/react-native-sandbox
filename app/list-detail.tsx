import React from "react";
import { View, StyleSheet } from "react-native";
import ListDetail from "../components/ListDetail";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ListDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Create navigation object for compatibility with our ListDetail component
  const navigation = {
    setOptions: (options: any) => {
      // We're using dynamic titles in the component, but this is handled
      // differently in Expo Router. This is a placeholder for compatibility.
    },
    goBack: () => router.back(),
  };

  return (
    <View style={styles.container}>
      <ListDetail route={{ params }} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
