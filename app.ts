import express, { Request, Response } from "express";
import path from "path";
import { promises as fs } from "fs";
import { readFile, writeFile } from "fs/promises";
import { User } from "./src/models/User"; 


const app = express();
const dataFile = path.join(process.cwd(), "data.json");

export type TUser = {
  name: string;
  todos: string[];
};

const usersMap: Record<string, TUser> = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public/js")));

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

app.post("/add", async (req: Request, res: Response) => {
  const { name, todo } = req.body;
  if (!name || !todo) return res.status(400).send("Name and todo required");

  let user = await User.findOne({ name });

  if (!user) {
    user = new User({ name, todos: [{ todo }] });
  } else {
    user.todos.push({ todo });
  }

  await user.save();
  res.send(`Todo added successfully for user ${name}.`);
});


app.get("/todos/:id", async (req: Request, res: Response) => {
  const user = await User.findOne({ name: req.params.id });
  if (!user) return res.status(404).send("User not found");
  res.json(user.todos);
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
  const user = await User.findOne({ name });
  if (!user) return res.status(404).send("User not found");

  user.todos = user.todos.filter((t) => t.todo !== todo);

  if (user.todos.length === 0) {
    await User.deleteOne({ name });
  } else {
    await user.save();
  }

  app.put("/updateTodo", async (req: Request, res: Response) => {
  const { name, todo, checked } = req.body;
  const user = await User.findOne({ name });
  if (!user) return res.status(404).send("User not found");

  const t = user.todos.find(t => t.todo === todo);
  if (!t) return res.status(404).send("Todo not found");

  t.checked = checked;
  await user.save();

  res.send("Todo updated successfully.");
});

  res.send("Todo deleted successfully.");
});


// Export the app and file initializer
export { app, initializeDataFile };
