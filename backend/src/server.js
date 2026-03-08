const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const { readDb, writeDb } = require("./db");
const { createToken, authMiddleware } = require("./auth");

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing. Add it in backend/.env");
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const db = await readDb();
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = db.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    await writeDb(db);

    const token = createToken(user.id);
    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const db = await readDb();
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = db.users.find((item) => item.email === normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user.id);
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
});

app.delete("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const db = await readDb();
    const userExists = db.users.some((user) => user.id === req.userId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    db.users = db.users.filter((user) => user.id !== req.userId);
    db.products = db.products.filter((product) => product.userId !== req.userId);

    await writeDb(db);
    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete account", error: error.message });
  }
});

app.get("/api/products", authMiddleware, async (req, res) => {
  try {
    const db = await readDb();
    const products = db.products.filter((product) => product.userId === req.userId);
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

app.post("/api/products", authMiddleware, async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({ message: "name and price are required" });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "price must be a valid non-negative number" });
    }

    const db = await readDb();
    const product = {
      id: uuidv4(),
      userId: req.userId,
      name: String(name).trim(),
      description: description ? String(description).trim() : "",
      price: numericPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.products.push(product);
    await writeDb(db);

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});

app.put("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const db = await readDb();
    const product = db.products.find((item) => item.id === id && item.userId === req.userId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name !== undefined) {
      product.name = String(name).trim();
    }
    if (description !== undefined) {
      product.description = String(description).trim();
    }
    if (price !== undefined) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ message: "price must be a valid non-negative number" });
      }
      product.price = numericPrice;
    }

    product.updatedAt = new Date().toISOString();
    await writeDb(db);

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});

app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDb();

    const exists = db.products.some((item) => item.id === id && item.userId === req.userId);
    if (!exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    db.products = db.products.filter((item) => !(item.id === id && item.userId === req.userId));
    await writeDb(db);

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
