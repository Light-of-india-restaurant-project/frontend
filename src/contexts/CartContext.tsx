import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { MenuItem } from "@/lib/api";
import type { CateringPack } from "@/lib/user-api";

// Cart item with quantity
export interface CartItem {
  menuItemId: string;
  name: string;
  nameNl?: string;
  price: number;
  quantity: number;
  image?: string;
}

// Catering pack cart item
export interface CateringCartItem {
  packId: string;
  pack: CateringPack;
  peopleCount: number;
  quantity: number;
}

interface CartContextType {
  // Menu items
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (menuItemId: string) => boolean;
  getItemQuantity: (menuItemId: string) => number;
  // Catering packs
  cateringItems: CateringCartItem[];
  cateringItemCount: number;
  cateringTotal: number;
  addCateringPack: (pack: CateringPack, peopleCount: number) => void;
  removeCateringPack: (packId: string) => void;
  updateCateringPeopleCount: (packId: string, peopleCount: number) => void;
  updateCateringQuantity: (packId: string, quantity: number) => void;
  clearCateringCart: () => void;
  isCateringPackInCart: (packId: string) => boolean;
  getCateringItem: (packId: string) => CateringCartItem | undefined;
  // Combined totals
  totalItemCount: number;
  grandTotal: number;
  clearAllCarts: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "light-of-india-cart";
const CATERING_CART_STORAGE_KEY = "light-of-india-catering-cart";

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

// Load catering cart from localStorage
const loadCateringCart = (): CateringCartItem[] => {
  try {
    const stored = localStorage.getItem(CATERING_CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) =>
            item.packId &&
            item.pack &&
            typeof item.peopleCount === "number" &&
            typeof item.quantity === "number"
        );
      }
    }
  } catch (error) {
    console.error("Error loading catering cart from localStorage:", error);
  }
  return [];
};

// Save catering cart to localStorage
const saveCateringCart = (items: CateringCartItem[]) => {
  try {
    localStorage.setItem(CATERING_CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving catering cart to localStorage:", error);
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cateringItems, setCateringItems] = useState<CateringCartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load carts from localStorage on mount
  useEffect(() => {
    const storedItems = loadCart();
    const storedCateringItems = loadCateringCart();
    setItems(storedItems);
    setCateringItems(storedCateringItems);
    setIsInitialized(true);
  }, []);

  // Save menu cart to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      saveCart(items);
    }
  }, [items, isInitialized]);

  // Save catering cart to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      saveCateringCart(cateringItems);
    }
  }, [cateringItems, isInitialized]);

  // Calculate menu item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate menu total price
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate catering item count
  const cateringItemCount = cateringItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate catering total price
  const cateringTotal = cateringItems.reduce(
    (sum, item) => sum + item.pack.pricePerPerson * item.peopleCount * item.quantity,
    0
  );

  // Combined totals
  const totalItemCount = itemCount + cateringItemCount;
  const grandTotal = total + cateringTotal;

  // Add menu item to cart
  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.menuItemId === menuItem._id);
      
      if (existingIndex >= 0) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      
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

  // Remove menu item from cart
  const removeItem = useCallback((menuItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.menuItemId !== menuItemId));
  }, []);

  // Update menu item quantity
  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.menuItemId !== menuItemId));
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  }, []);

  // Clear menu cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if menu item is in cart
  const isInCart = useCallback(
    (menuItemId: string) => items.some((item) => item.menuItemId === menuItemId),
    [items]
  );

  // Get menu item quantity
  const getItemQuantity = useCallback(
    (menuItemId: string) => {
      const item = items.find((i) => i.menuItemId === menuItemId);
      return item?.quantity || 0;
    },
    [items]
  );

  // Add catering pack to cart
  const addCateringPack = useCallback((pack: CateringPack, peopleCount: number) => {
    setCateringItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.packId === pack._id);

      if (existingIndex >= 0) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [
        ...prevItems,
        {
          packId: pack._id,
          pack,
          peopleCount: Math.max(peopleCount, pack.minPeople),
          quantity: 1,
        },
      ];
    });
  }, []);

  // Remove catering pack from cart
  const removeCateringPack = useCallback((packId: string) => {
    setCateringItems((prevItems) => prevItems.filter((item) => item.packId !== packId));
  }, []);

  // Update catering pack people count
  const updateCateringPeopleCount = useCallback((packId: string, peopleCount: number) => {
    setCateringItems((prevItems) =>
      prevItems.map((item) =>
        item.packId === packId
          ? { ...item, peopleCount: Math.max(peopleCount, item.pack.minPeople) }
          : item
      )
    );
  }, []);

  // Update catering pack quantity
  const updateCateringQuantity = useCallback((packId: string, quantity: number) => {
    if (quantity <= 0) {
      setCateringItems((prevItems) => prevItems.filter((item) => item.packId !== packId));
    } else {
      setCateringItems((prevItems) =>
        prevItems.map((item) =>
          item.packId === packId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  // Clear catering cart
  const clearCateringCart = useCallback(() => {
    setCateringItems([]);
  }, []);

  // Clear all carts
  const clearAllCarts = useCallback(() => {
    setItems([]);
    setCateringItems([]);
  }, []);

  // Check if catering pack is in cart
  const isCateringPackInCart = useCallback(
    (packId: string) => cateringItems.some((item) => item.packId === packId),
    [cateringItems]
  );

  // Get catering item by pack ID
  const getCateringItem = useCallback(
    (packId: string) => cateringItems.find((item) => item.packId === packId),
    [cateringItems]
  );

  return (
    <CartContext.Provider
      value={{
        // Menu items
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        // Catering packs
        cateringItems,
        cateringItemCount,
        cateringTotal,
        addCateringPack,
        removeCateringPack,
        updateCateringPeopleCount,
        updateCateringQuantity,
        clearCateringCart,
        isCateringPackInCart,
        getCateringItem,
        // Combined totals
        totalItemCount,
        grandTotal,
        clearAllCarts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
