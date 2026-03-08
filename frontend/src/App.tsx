import { FormEvent, useEffect, useMemo, useState } from "react";
import { Alert, Container, Typography } from "@mui/material";
import {
  createProduct,
  deleteAccount,
  deleteProduct,
  fetchProducts,
  loginUser,
  registerUser,
  updateProduct
} from "./api";
import AccountCard from "./components/AccountCard";
import AuthCard from "./components/AuthCard";
import ProductFormCard from "./components/ProductFormCard";
import ProductsTable from "./components/ProductsTable";
import { emptyProductForm, tokenKey, userKey } from "./constants/session";
import type { AuthMode, Product, ProductForm, User } from "./types";

function App() {
  const [mode, setMode] = useState<AuthMode>("register");
  const [token, setToken] = useState<string>(localStorage.getItem(tokenKey) || "");
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(userKey);
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => Boolean(token && user), [token, user]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    void loadProducts();
  }, [isLoggedIn]);

  async function loadProducts() {
    if (!token) return;
    try {
      const data = await fetchProducts(token);
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function saveSession(nextToken: string, nextUser: User) {
    localStorage.setItem(tokenKey, nextToken);
    localStorage.setItem(userKey, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }

  function clearSession() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setToken("");
    setUser(null);
    setProducts([]);
    setEditingId(null);
    setProductForm(emptyProductForm);
  }

  async function onAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "").trim();

    try {
      const response =
        mode === "register"
          ? await registerUser({ name, email, password })
          : await loginUser({ email, password });
      saveSession(response.token, response.user);
      event.currentTarget.reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price)
      };

      if (!payload.name || Number.isNaN(payload.price)) {
        throw new Error("Product name and valid price are required");
      }

      if (editingId) {
        const updated = await updateProduct(token, editingId, payload);
        setProducts((current) =>
          current.map((item) => (item.id === editingId ? updated : item))
        );
      } else {
        const created = await createProduct(token, payload);
        setProducts((current) => [...current, created]);
      }

      setEditingId(null);
      setProductForm(emptyProductForm);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price)
    });
  }

  async function onDeleteProduct(id: string) {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      await deleteProduct(token, id);
      setProducts((current) => current.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setProductForm(emptyProductForm);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteAccount() {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      await deleteAccount(token);
      clearSession();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Shop CRUD Assignment
      </Typography>
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      {!isLoggedIn ? (
        <AuthCard mode={mode} loading={loading} onModeChange={setMode} onSubmit={onAuthSubmit} />
      ) : (
        <>
          <AccountCard user={user} onLogout={clearSession} onDeleteAccount={onDeleteAccount} />
          <ProductFormCard
            form={productForm}
            editing={Boolean(editingId)}
            loading={loading}
            onSubmit={onProductSubmit}
            onChange={setProductForm}
            onCancelEdit={() => {
              setEditingId(null);
              setProductForm(emptyProductForm);
            }}
          />
          <ProductsTable products={products} onEdit={startEdit} onDelete={onDeleteProduct} />
        </>
      )}
    </Container>
  );
}

export default App;
