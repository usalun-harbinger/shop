const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

const EMPTY_DB = {
  users: [],
  products: []
};

async function ensureDbFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(EMPTY_DB, null, 2), "utf-8");
  }
}

async function readDb() {
  await ensureDbFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(data) {
  await ensureDbFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readDb,
  writeDb
};
