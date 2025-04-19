import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const LISTS_KEY = 'shoppingLists';
const LIST_ITEMS_PREFIX = 'listItems_';

export interface ListInfo {
  id: string;
  title: string;
  createdAt: number;
}

// Save the list of all shopping lists
export const saveLists = async (lists: ListInfo[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
    return true;
  } catch (error) {
    console.error('Error saving lists:', error);
    return false;
  }
};

// Load all shopping lists
export const loadLists = async (): Promise<ListInfo[]> => {
  try {
    const lists = await AsyncStorage.getItem(LISTS_KEY);
    return lists ? JSON.parse(lists) : [];
  } catch (error) {
    console.error('Error loading lists:', error);
    return [];
  }
};

// Delete a specific list and its items
export const deleteList = async (listId: string): Promise<boolean> => {
  try {
    // Get current lists
    const lists = await loadLists();
    const newLists = lists.filter(list => list.id !== listId);
    
    // Delete list items
    await AsyncStorage.removeItem(`${LIST_ITEMS_PREFIX}${listId}`);
    
    // Save updated lists
    await saveLists(newLists);
    return true;
  } catch (error) {
    console.error('Error deleting list:', error);
    return false;
  }
};

// Save items for a specific list
export const saveListItems = async (listId: string, items: string[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(`${LIST_ITEMS_PREFIX}${listId}`, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error(`Error saving items for list ${listId}:`, error);
    return false;
  }
};

// Load items for a specific list
export const loadListItems = async (listId: string): Promise<string[]> => {
  try {
    const items = await AsyncStorage.getItem(`${LIST_ITEMS_PREFIX}${listId}`);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error(`Error loading items for list ${listId}:`, error);
    return [];
  }
};

// Clear all data (for debugging)
export const clearAllData = async (): Promise<boolean> => {
  try {
    const lists = await loadLists();
    
    // Delete all list items
    for (const list of lists) {
      await AsyncStorage.removeItem(`${LIST_ITEMS_PREFIX}${list.id}`);
    }
    
    // Delete lists
    await AsyncStorage.removeItem(LISTS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
