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
import { loadListItems, saveListItems } from "../utils/storage";

export default function ListDetail({ route, navigation }: { route: any, navigation: any }) {
  const { listId, listTitle } = route.params;
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Set the title in the navigation header
    navigation.setOptions({
      title: listTitle,
    });

    // Load saved items for this list
    loadItems();
  }, [listId, listTitle]);

  useEffect(() => {
    // Save items whenever they change, but only after initial load
    if (!isLoading) {
      const saveItems = async () => {
        setIsSaving(true);
        try {
          await saveListItems(listId, items);
        } catch (error) {
          console.error("Error saving items:", error);
        } finally {
          setIsSaving(false);
        }
      };
      
      saveItems();
    }
  }, [items, isLoading, listId]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const savedItems = await loadListItems(listId);
      setItems(savedItems);
    } catch (error) {
      Alert.alert("Error", "Failed to load list items");
    } finally {
      setIsLoading(false);
    }
  };

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
      "Are you sure you want to clear all items from this list?",
      [
        { 
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await saveListItems(listId, []);
              setItems([]);
            } catch (error) {
              Alert.alert("Error", "Failed to clear list items");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading list items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
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
          <Text style={styles.emptyText}>No items in this list. Add some!</Text>
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
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  inputContainer: { 
    flexDirection: "row", 
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
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
    color: "#888" 
  },
});