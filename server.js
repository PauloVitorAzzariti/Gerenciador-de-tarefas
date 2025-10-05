// server.js
import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;
const DATA_FILE = "./tasks.json";

app.use(cors());
app.use(express.json());

// Função para ler/escrever JSON
function readTasks() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET → lista todas as tarefas
app.get("/tasks", (req, res) => {
  res.json(readTasks());
});

// POST → adiciona nova tarefa
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = { id: crypto.randomUUID(), ...req.body };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json(newTask);
});

// PUT → atualiza uma tarefa
app.put("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const i = tasks.findIndex(t => t.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: "Tarefa não encontrada" });
  tasks[i] = { ...tasks[i], ...req.body };
  writeTasks(tasks);
  res.json(tasks[i]);
});

// DELETE → exclui
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks().filter(t => t.id !== req.params.id);
  writeTasks(tasks);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
