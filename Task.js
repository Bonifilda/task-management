// ====== TASK MANAGER JS ======

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskBody = document.getElementById("taskBody");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const allCountEl = document.getElementById("allCount");
const filterSelect = document.getElementById("filterSelect");

// Add Task
taskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  const newTask = {
    id: Date.now(),
    name: taskText,
    date: new Date().toLocaleString(),
    status: "Pending"
  };
  tasks.push(newTask);
  saveTasks();
  taskInput.value = "";
  renderTasks();
});

// Render Tasks
function renderTasks() {
  taskBody.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "pending") {
    filteredTasks = tasks.filter(t => t.status === "Pending");
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.status === "Completed");
  }

  filteredTasks.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="py-2 px-4 border">${index + 1}</td>
      <td class="py-2 px-4 border ${task.status === "Completed" ? "line-through text-gray-500" : ""}">
        ${task.name}
      </td>
      <td class="py-2 px-4 border">${task.date}</td>
      <td class="py-2 px-4 border">${task.status}</td>
      <td class="py-2 px-4 border space-x-2">
        <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
          onclick="editTask(${task.id})">Edit</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
          onclick="deleteTask(${task.id})">Delete</button>
        <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
          onclick="toggleComplete(${task.id})">
          ${task.status === "Pending" ? "Complete" : "Undo"}
        </button>
      </td>
    `;
    taskBody.appendChild(row);
  });

  updateDashboard();
}

// Toggle Complete / Undo
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, status: task.status === "Pending" ? "Completed" : "Pending" }
      : task
  );
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newName = prompt("Edit task:", task.name);
  if (newName && newName.trim() !== "") {
    task.name = newName.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete Task
function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Update Dashboard Counts
function updateDashboard() {
  const pending = tasks.filter(t => t.status === "Pending").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const all = tasks.length;

  pendingCountEl.textContent = pending;
  completedCountEl.textContent = completed;
  allCountEl.textContent = all;
}

// Filter Tasks
filterSelect.addEventListener("change", function() {
  filter = this.value;
  renderTasks();
});

// Save Tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initialize
renderTasks();














