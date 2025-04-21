import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { ListInfo, loadLists, saveLists, deleteList } from "../utils/storage";

export default function ListsScreen({ navigation }: { navigation: any }) {
  const [lists, setLists] = useState<ListInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadAllLists();
  }, []);

  const loadAllLists = async () => {
    setIsLoading(true);
    try {
      const savedLists = await loadLists();
      setLists(savedLists);
    } catch (error) {
      Alert.alert("Error", "Failed to load your lists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (newListTitle.trim()) {
      const newList: ListInfo = {
        id: Date.now().toString(),
        title: newListTitle.trim(),
        createdAt: Date.now(),
      };

      const updatedLists = [...lists, newList];

      try {
        await saveLists(updatedLists);
        setLists(updatedLists);
        setNewListTitle("");
        setModalVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to create new list");
      }
    } else {
      Alert.alert("Error", "List title cannot be empty");
    }
  };

  const handleDeleteList = (listId: string) => {
    Alert.alert("Delete List", "Are you sure you want to delete this list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteList(listId);
            setLists(lists.filter((list) => list.id !== listId));
          } catch (error) {
            Alert.alert("Error", "Failed to delete list");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const openListDetail = (listId: string, listTitle: string) => {
    navigation.navigate("ListDetail", { listId, listTitle });
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading your lists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Lists</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => openListDetail(item.id, item.title)}
          >
            <Text style={styles.listTitle}>{item.title}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteList(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You don't have any lists yet. Create one to get started!
            </Text>
          </View>
        }
      />

      {/* Modal for creating a new list */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New List</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="List Title"
              value={newListTitle}
              onChangeText={setNewListTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewListTitle("");
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateList}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    marginRight: 8,
  },
  createButton: {
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
  modalButtonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#007AFF",
  },
  // Add a specific style for the create button text
  createButtonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "white",
  },
});
