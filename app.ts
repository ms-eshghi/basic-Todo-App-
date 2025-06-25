import express, { Request, Response } from "express";
import path from "path";
import { promises as fs } from "fs";

const app = express();
const dataFile = path.join(__dirname, "data.json");

type TUser = {
  name: string;
  todos: string[];
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// In app.ts, before export:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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

app.get("/todos/:id", async (req: Request, res: Response) => {
  const users = await readData();
  const user = users.find((u) => u.name === req.params.id);
  if (!user) return res.status(404).send("User not found");
  res.json(user.todos);
});

app.delete("/delete", async (req: Request, res: Response) => {
  const { name } = req.body;
  const users = await readData();
  const updated = users.filter((u) => u.name !== name);
  if (updated.length === users.length) return res.status(404).send("User not found");

  await writeData(updated);
  res.send("User deleted successfully.");
});

app.put("/update", async (req: Request, res: Response) => {
  const { name, todo } = req.body;
  const users = await readData();
  const user = users.find((u) => u.name === name);
  if (!user) return res.status(404).send("User not found");

  user.todos = user.todos.filter((t) => t !== todo);
  await writeData(users);
  res.send("Todo deleted successfully.");
});

// Export the app and file initializer
export { app, initializeDataFile };
