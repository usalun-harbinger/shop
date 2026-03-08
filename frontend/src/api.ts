import type { AuthResponse, Product } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(errorData.message || "Something went wrong");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchProducts(token: string) {
  return request<Product[]>("/products", {}, token);
}

export function createProduct(
  token: string,
  payload: { name: string; description: string; price: number }
) {
  return request<Product>(
    "/products",
    {
      method: "POST",
      body: JSON.stringify(payload)
    },
    token
  );
}

export function updateProduct(
  token: string,
  id: string,
  payload: { name: string; description: string; price: number }
) {
  return request<Product>(
    `/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload)
    },
    token
  );
}

export function deleteProduct(token: string, id: string) {
  return request<{ message: string }>(
    `/products/${id}`,
    {
      method: "DELETE"
    },
    token
  );
}

export function deleteAccount(token: string) {
  return request<{ message: string }>(
    "/users/me",
    {
      method: "DELETE"
    },
    token
  );
}
