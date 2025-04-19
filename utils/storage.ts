import AsyncStorage from '@react-native-async-storage/async-storage';

const GROCERY_ITEMS_KEY = 'groceryItems';

export const saveGroceryItems = async (items: string[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(GROCERY_ITEMS_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error saving grocery items:', error);
    return false;
  }
};

export const loadGroceryItems = async (): Promise<string[]> => {
  try {
    const items = await AsyncStorage.getItem(GROCERY_ITEMS_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading grocery items:', error);
    return [];
  }
};

export const clearGroceryItems = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(GROCERY_ITEMS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing grocery items:', error);
    return false;
  }
};
