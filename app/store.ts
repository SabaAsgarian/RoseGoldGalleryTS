"use client";

import { create } from "zustand";

// 📦 Type definition for a single product
export interface Product {
  id: string;
  img: string;
  title: string;
  price: number;
  count: number;
  weight?: number;
  category?: string;
}

// 📦 Type definition for store state and actions
interface StoreState {
  products: Product[];
  num: number;
  addProduct: (product: Product) => void;
  plusFromCart: (pId: string) => void;
  minusFromCart: (pId: string) => void;
  totalPrice: () => void;
  clearCart: () => void;
  placeOrder: (userToken: string) => Promise<void>;
}
export type { StoreState };
// 📦 Zustand store
const useStore = create<StoreState>((set, get) => ({
  products:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cartProducts") || "[]")
      : [],

  num: 0,

  // 📌 Add a product to the cart
  addProduct: (product) =>
    set((state) => {
      const existingProduct = state.products.find(
        (item) => item.id === product.id
      );
      let newProducts: Product[];

      if (existingProduct) {
        newProducts = state.products.map((item) =>
          item.id === product.id ? { ...item, count: item.count + 1 } : item
        );
        alert("Product quantity increased in cart!");
      } else {
        newProducts = [...state.products, { ...product, count: 1 }];
        alert("Product added to cart!");
      }

      localStorage.setItem("cartProducts", JSON.stringify(newProducts));
      return { products: newProducts };
    }),

  // 📌 Increase product quantity in cart
  plusFromCart: (pId) =>
    set((state) => {
      const newProducts = state.products.map((item) =>
        item.id === pId ? { ...item, count: item.count + 1 } : item
      );

      localStorage.setItem("cartProducts", JSON.stringify(newProducts));
      return { products: newProducts };
    }),

  // 📌 Decrease product quantity or remove if 0
  minusFromCart: (pId) =>
    set((state) => {
      let newProducts = state.products.map((item) =>
        item.id === pId ? { ...item, count: item.count - 1 } : item
      );

      newProducts = newProducts.filter((item) => item.count > 0);

      localStorage.setItem("cartProducts", JSON.stringify(newProducts));
      return { products: newProducts };
    }),

  // 📌 Calculate total price
  totalPrice: () =>
    set((state) => {
      const total = state.products.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      );
      return { num: total };
    }),

  // 📌 Clear cart after purchase
  clearCart: () =>
    set(() => {
      localStorage.removeItem("cartProducts");
      return { products: [] };
    }),

  // 📌 Submit order to backend
  placeOrder: async (userToken) => {
    const state = get();
    try {
      const response = await fetch(
        "https://rosegoldgallery-back.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            products: state.products.map((item) => ({
              product: item.id,
              quantity: item.count,
            })),
            totalAmount: state.products.reduce(
              (sum, item) => sum + item.price * item.count,
              0
            ),
            paymentMethod: "Online",
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cartProducts");
        set({ products: [] });
      } else {
        alert(data.error || "Order failed!");
      }
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  },
}));

export default useStore;
