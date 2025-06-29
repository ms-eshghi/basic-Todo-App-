import express, { Request, Response } from "express";
import path from "path";
import { promises as fs } from "fs";
import { readFile, writeFile } from "fs/promises";

const app = express();
const dataFile = path.join(__dirname, "data.json");

export type TUser = {
  name: string;
  todos: string[];
};

const usersMap: Record<string, TUser> = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

import fsSync from "fs";
console.log(
  "Looking for HTML at:",
  path.join(__dirname, "../public/index.html")
);
console.log(
  "File exists?",
  fsSync.existsSync(path.join(__dirname, "../public/index.html"))
);
// In app.ts, before export:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const initializeDataFile = async () => {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([]));
  }
};

const readData = async (): Promise<TUser[]> => {
  const content = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(content);
};

const writeData = async (data: TUser[]) => {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
};

// All Routes
app.post("/add", async (req: Request, res: Response) => {
  const { name, todo } = req.body;
  if (!name || !todo) return res.status(400).send("Name and todo required");

  const users = await readData();
  const user = users.find((u) => u.name === name);
  if (user) user.todos.push(todo);
  else users.push({ name, todos: [todo] });

  await writeData(users);
  res.send(`Todo added successfully for user ${name}.`);
});

const dataFilePath = path.join(__dirname, "data.json");
app.get("/todos/:id", async (req, res) => {
  try {
    const data = await readFile(dataFilePath, "utf-8");
    const users: TUser[] = JSON.parse(data);
    const user = users.find(
      (u) => u.name.toLowerCase() === req.params.id.toLowerCase()
    );

    if (user) {
      res.json(user.todos);
    } else {
      console.warn("User not found:", req.params.id);
      return res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.delete("/delete", async (req: Request, res: Response) => {
  const { name } = req.body;
  const users = await readData();
  const updated = users.filter((u) => u.name !== name);
  if (updated.length === users.length)
    return res.status(404).send("User not found");

  await writeData(updated);
  res.send("User deleted successfully.");
});

app.put("/update", async (req: Request, res: Response) => {
  const { name, todo } = req.body;
  const users = await readData();
  const user = users.find((u) => u.name === name);
  if (!user || !todo) return res.status(404).send("User not found");

  const initialLength = user.todos.length;
  user.todos = user.todos.filter((t) => t !== todo);

  if (user.todos.length === initialLength) {
    return res.status(404).send("Todo not found.");
  }

  await writeData(users);

  res.json(user.todos);
});

// Export the app and file initializer
export { app, initializeDataFile };
