export type User = {
  id: string;
  name: string;
  email: string;
};

export type Product = {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthMode = "login" | "register";

export type ProductForm = {
  name: string;
  description: string;
  price: string;
};
