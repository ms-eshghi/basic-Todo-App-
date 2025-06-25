document.getElementById("todoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("userInput").value;
  const todo = document.getElementById("todoInput").value;

  const res = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, todo })
  });

  document.getElementById("message").textContent = await res.text();
});

let currentUser = null;

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("searchInput").value;
  const res = await fetch(`/todos/${name}`);
  const msg = document.getElementById("message");
  const ul = document.getElementById("todoList");
  ul.innerHTML = "";
  currentUser = null;

  if (!res.ok) {
    msg.textContent = await res.text();
    document.getElementById("deleteUser").style.display = "none";
    return;
  }

  const todos = await res.json();
  currentUser = name;
  msg.textContent = `Todos for ${name}`;
  document.getElementById("deleteUser").style.display = "block";

  todos.forEach(todo => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.className = "delete-task";
    a.textContent = todo;
    a.addEventListener("click", () => deleteTodo(todo));
    li.appendChild(a);
    ul.appendChild(li);
  });
});

document.getElementById("deleteUser").addEventListener("click", async () => {
  if (!currentUser) return;

  const res = await fetch("/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: currentUser })
  });

  document.getElementById("message").textContent = await res.text();
  document.getElementById("todoList").innerHTML = "";
  document.getElementById("deleteUser").style.display = "none";
});

async function deleteTodo(todo) {
  if (!currentUser) return;
  const res = await fetch("/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: currentUser, todo })
  });

  document.getElementById("message").textContent = await res.text();
  document.getElementById("search").click(); 
}
