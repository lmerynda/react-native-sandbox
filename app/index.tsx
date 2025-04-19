import React from "react";
import { View, StyleSheet } from "react-native";
import GroceryList from "../components/GroceryList";

export default function Index() {
  return (
    <View style={styles.container}>
      <GroceryList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
