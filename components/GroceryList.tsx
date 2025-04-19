import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const GroceryList = () => {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState("");

  const addItem = () => {
    if (text.trim()) {
      setItems((prev) => [...prev, text.trim()]);
      setText("");
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add item"
          value={text}
          onChangeText={setText}
        />
        <Button title="Add" onPress={addItem} />
      </View>
      <FlatList
        data={items.map((value, index) => ({ key: index.toString(), value }))}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.value}</Text>
            <TouchableOpacity onPress={() => removeItem(parseInt(item.key))}>
              <Text style={styles.removeText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 4,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 16 },
  removeText: { color: "red" },
});

export default GroceryList;
