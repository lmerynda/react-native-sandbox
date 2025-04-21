import React from "react";
import { View, StyleSheet } from "react-native";
import ListsScreen from "../components/ListsScreen";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  // This navigation function will be passed to ListsScreen
  const navigation = {
    navigate: (screen: string, params: any) => {
      if (screen === "ListDetail") {
        router.push({
          pathname: "/list-detail",
          params: params,
        });
      }
    },
  };

  return (
    <View style={styles.container}>
      <ListsScreen navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
