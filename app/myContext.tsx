// myContext.tsx
import { createContext } from "react";

export type Product = {
  _id: string;
  img: string;
  title: string;
  price: number;
  category?: string;
  weight?: number;
};

const myContext = createContext<Product | null>(null);

export default myContext;
