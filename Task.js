// Array to store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Select DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskBody = document.getElementById("taskBody");
const filterSelect = document.getElementById("filterSelect");

// Dashboard counters
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const allCountEl = document.getElementById("allCount");

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskBody.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  filteredTasks.forEach((task, index) => {
    const isCompleted = task.status === "completed";
    const row = document.createElement("tr");

    // Index
    const tdIndex = document.createElement("td");
    tdIndex.className = "py-2 px-4 border";
    tdIndex.textContent = index + 1;
    row.appendChild(tdIndex);

    // Name
    const tdName = document.createElement("td");
    tdName.className = "py-2 px-4 border";
    tdName.textContent = task.name || "";
    tdName.classList.toggle("completed", isCompleted); 
    row.appendChild(tdName);

    // Date
    const tdDate = document.createElement("td");
    tdDate.className = "py-2 px-4 border";
    tdDate.textContent = task.date || "";
    row.appendChild(tdDate);

    // Status
    const tdStatus = document.createElement("td");
    tdStatus.className = "py-2 px-4 border";
    tdStatus.textContent = task.status;
    row.appendChild(tdStatus);

    // Actions
    const tdActions = document.createElement("td");
    tdActions.className = "py-2 px-4 border space-x-2";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTask(task.id));
    tdActions.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));
    tdActions.appendChild(deleteBtn);

    // Complete/Undo button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700";
    toggleBtn.textContent = isCompleted ? "Undo" : "Complete";
    toggleBtn.addEventListener("click", () => toggleComplete(task.id));
    tdActions.appendChild(toggleBtn);

    row.appendChild(tdActions);
    taskBody.appendChild(row);
  });

  updateDashboard();
}

// Add task
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = taskInput.value.trim();
  const date = taskDate.value;

  if (name === "" || date === "") {
    alert("Please fill out both fields");
    return;
  }

  const newTask = {
    id: Date.now(),
    name: name,
    date: date,
    status: "pending"
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskForm.reset();
});

// Edit task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newName = prompt("Edit task:", task.name);
  if (newName && newName.trim() !== "") {
    task.name = newName.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete task
function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Toggle complete/undo
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.status = task.status === "completed" ? "pending" : "completed";
  saveTasks();
  renderTasks();
}

// Update dashboard counts
function updateDashboard() {
  const pendingCount = tasks.filter(task => task.status === "pending").length;
  const completedCount = tasks.filter(task => task.status === "completed").length;
  const allCount = tasks.length;

  pendingCountEl.textContent = pendingCount;
  completedCountEl.textContent = completedCount;
  allCountEl.textContent = allCount;
}

// Filter change
filterSelect.addEventListener("change", function () {
  filter = this.value;
  renderTasks();
});

// Initial render
renderTasks();


















