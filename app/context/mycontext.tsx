"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface User {
  id?: string;
  mobile?: string;
  city?: string;
  street?: string;
  age?: number;
  [key: string]: any; // allows extra fields
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginUser: (userData: User, token: string) => void;
  logoutUser: () => void;
  loading: boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      const data: User = JSON.parse(savedUser);
      const parsedUser: User = JSON.parse(savedUser);
      setUser(parsedUser);
      console.log("Saved User Data:", data);

      setUser({
        ...data,
        mobile: data.mobile,
        id: data.id,
        city: data.city,
        street: data.street,
        age: data.age,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
