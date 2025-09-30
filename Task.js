// Load tasks from localStorage or start empty
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const calendarInput = document.getElementById("calender"); 
const taskBody = document.getElementById("taskBody");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const allCountEl = document.getElementById("allCount");
const filterSelect = document.getElementById("filterSelect");

// Escape helper (avoid HTML injection when rendering task name)
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'", "&#39;");
}

// Add Task
taskForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const taskDate = calendarInput.value || new Date().toLocaleDateString();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskText,
    date: taskDate,
    status: "Pending"
  };

  tasks.push(newTask);
  saveTasks();
  taskInput.value = "";
  calendarInput.value = "";
  renderTasks();
});

// Render Tasks
function renderTasks() {
  taskBody.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "pending") {
    filteredTasks = tasks.filter(t => (t.status || "").toLowerCase() === "pending");
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(t => (t.status || "").toLowerCase() === "completed");
  }

  filteredTasks.forEach((task, index) => {
    const isCompleted = (task.status || "").toLowerCase() === "completed";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4 border">${index + 1}</td>
      <td class="py-2 px-4 border ${isCompleted ? 'completed' : ''}">
        ${escapeHtml(task.name)}
      </td>
      <td class="py-2 px-4 border">${escapeHtml(task.date)}</td>
      <td class="py-2 px-4 border">${escapeHtml(task.status)}</td>
      <td class="py-2 px-4 border space-x-2">
        <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
          onclick="editTask(${task.id})">Edit</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
          onclick="deleteTask(${task.id})">Delete</button>
        <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
          onclick="toggleComplete(${task.id})">
          ${isCompleted ? "Undo" : "Complete"}
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
      ? { ...task, status: (task.status && task.status.toLowerCase() === "completed") ? "Pending" : "Completed" }
      : task
  );
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
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
  const pendingCount = tasks.filter(task => (task.status || "").toLowerCase() === "pending").length;
  const completedCount = tasks.filter(task => (task.status || "").toLowerCase() === "completed").length;
  const allCount = tasks.length;

  pendingCountEl.textContent = pendingCount;
  completedCountEl.textContent = completedCount;
  allCountEl.textContent = allCount;
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter tasks when dropdown changes
filterSelect.addEventListener("change", function () {
  filter = this.value;
  renderTasks();
});

// Initial render on page load
renderTasks();

















