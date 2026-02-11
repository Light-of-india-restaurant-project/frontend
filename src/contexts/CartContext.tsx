import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MenuItem } from "@/lib/api";

// Cart item with quantity
export interface CartItem {
  menuItemId: string;
  name: string;
  nameNl?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (menuItemId: string) => boolean;
  getItemQuantity: (menuItemId: string) => number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "light-of-india-cart";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

// Load cart from localStorage
const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) =>
            item.menuItemId &&
            typeof item.name === "string" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number"
        );
      }
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return [];
};

// Save cart to localStorage
const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedItems = loadCart();
    setItems(storedItems);
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever items change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveCart(items);
    }
  }, [items, isInitialized]);

  // Calculate total item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add item to cart
  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.menuItemId === menuItem._id);
      
      if (existingIndex >= 0) {
        // Increase quantity
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      
      // Add new item
      return [
        ...prevItems,
        {
          menuItemId: menuItem._id,
          name: menuItem.name,
          nameNl: menuItem.nameNl,
          price: menuItem.price,
          quantity: 1,
          image: menuItem.image,
        },
      ];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((menuItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.menuItemId !== menuItemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  // Clear all items
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if item is in cart
  const isInCart = useCallback(
    (menuItemId: string) => items.some((item) => item.menuItemId === menuItemId),
    [items]
  );

  // Get item quantity
  const getItemQuantity = useCallback(
    (menuItemId: string) => {
      const item = items.find((i) => i.menuItemId === menuItemId);
      return item?.quantity || 0;
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
