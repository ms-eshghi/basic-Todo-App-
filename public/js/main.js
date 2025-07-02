// Add Todo Form Handler
document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("userInput").value;
  const todo = document.getElementById("todoInput").value;

  try {
    const res = await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, todo }),
    });
    document.getElementById("message").textContent = await res.text();
  } catch (err) {
    console.error("Error adding todo:", err);
    document.getElementById("message").textContent = "Error adding todo.";
  }
});

let currentUser = null;

// Search Todo List Handler
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("searchInput").value;
  const msg = document.getElementById("message");
  const ul = document.getElementById("todoList");
  ul.innerHTML = "";
  currentUser = null;
  document.getElementById("deleteUser").style.display = "none";

  try {
    const res = await fetch(`/todos/${encodeURIComponent(name)}`);
    if (!res.ok) {
      msg.textContent = await res.text();
      return;
    }
    const todos = await res.json();
    currentUser = name;
    msg.textContent = `Todos for ${name}:`;
    document.getElementById("deleteUser").style.display = "inline";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkBoxes";
      checkbox.id = "myCheckbox";
      checkbox.checked = todo.checked || false;
      checkbox.addEventListener("change", () =>
        updateChecked(todo.todo, checkbox.checked)
      );

      const span = document.createElement("span");
      const a = document.createElement("a");
      a.href = "#";
      a.className = "delete-task";
      a.textContent = todo.todo || todo;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        deleteTodo(todo.todo || todo);
      });

      span.appendChild(a);
      label.appendChild(checkbox);
      label.appendChild(span);
      li.appendChild(label);
      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
    msg.textContent = "Error fetching todos.";
  }
});

// Delete Entire User Handler
document.getElementById("deleteUser").addEventListener("click", async () => {
  if (!currentUser) return;
  try {
    const res = await fetch("/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: currentUser }),
    });
    document.getElementById("message").textContent = await res.text();
    document.getElementById("todoList").innerHTML = "";
    document.getElementById("deleteUser").style.display = "none";
    currentUser = null;
  } catch (err) {
    console.error("Error deleting user:", err);
    document.getElementById("message").textContent = "Error deleting user.";
  }
});
async function updateChecked(todo, checked) {
  if (!currentUser) return;
  try {
    const res = await fetch("/updateTodo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: currentUser, todo, checked }),
    });

    const text = await res.text();
    console.log("Checkbox update:", text);
    document.getElementById("message").textContent = text;
  } catch (err) {
    console.error("Error updating checkbox:", err);
  }
}

// Delete Single Todo Function
async function deleteTodo(todo) {
  if (!currentUser) return;
  try {
    console.log("Requesting PUT /update", { name: currentUser, todo });
    const res = await fetch("/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: currentUser, todo }),
    });
    const text = await res.text();
    console.log("Response text:", text);
    document.getElementById("message").textContent = text;
    document.getElementById("search").click();
  } catch (err) {
    console.error("Error deleting todo:", err);
    document.getElementById("message").textContent = "Error deleting todo.";
  }
}
