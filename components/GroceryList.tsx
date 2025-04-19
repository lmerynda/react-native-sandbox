import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  loadGroceryItems,
  saveGroceryItems,
  clearGroceryItems,
} from "../utils/storage";

const GroceryList = () => {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved items when component mounts
    const fetchItems = async () => {
      try {
        const savedItems = await loadGroceryItems();
        setItems(savedItems);
      } catch (error) {
        Alert.alert("Error", "Failed to load grocery items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Save items whenever they change, but only after initial load
    if (!isLoading) {
      const saveItems = async () => {
        setIsSaving(true);
        try {
          await saveGroceryItems(items);
        } catch (error) {
          console.error("Error saving items:", error);
        } finally {
          setIsSaving(false);
        }
      };

      saveItems();
    }
  }, [items, isLoading]);

  const addItem = () => {
    if (text.trim()) {
      setItems((prev) => [...prev, text.trim()]);
      setText("");
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Items",
      "Are you sure you want to clear all grocery items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await clearGroceryItems();
              setItems([]);
            } catch (error) {
              Alert.alert("Error", "Failed to clear grocery items");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading grocery list...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Grocery List</Text>
        {isSaving && <ActivityIndicator size="small" color="#0000ff" />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add item"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addItem}
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No items in your grocery list. Add some!
          </Text>
        }
      />

      {items.length > 0 && (
        <View style={styles.clearButtonContainer}>
          <Button
            title="Clear All Items"
            onPress={handleClearAll}
            color="red"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
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
  clearButtonContainer: { marginTop: 20 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16 },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default GroceryList;
