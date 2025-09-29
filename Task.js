// Array to store tasks
let tasks = [];
let deletedCount = 0; // track deleted tasks
let filter = "all"; // all | pending | completed

// Select DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskBody = document.getElementById("taskBody");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const deletedCountEl = document.getElementById("deletedCount");
const filterSelect = document.getElementById("filterSelect");

// Handle form submit
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const newTask = {
    id: Date.now(),
    name: taskText,
    date: new Date().toLocaleString(),
    status: "Pending"
  };

  tasks.push(newTask);
  taskInput.value = "";
  renderTasks();
});

// Render tasks in table
function renderTasks() {
  taskBody.innerHTML = "";

  // filter tasks
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
      <td class="py-2 px-4 border">${task.name}</td>
      <td class="py-2 px-4 border">${task.date}</td>
      <td class="py-2 px-4 border">${task.status}</td>
      <td class="py-2 px-4 space-x-2 border">
        <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
          onclick="markComplete(${task.id})">Complete</button>
        <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
          onclick="editTask(${task.id})">Edit</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
          onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;

    taskBody.appendChild(row);
  });

  updateDashboard();
}

// Mark task as complete
function markComplete(id) {
  tasks = tasks.map(task => 
    task.id === id ? {...task, status: "Completed"} : task
  );
  renderTasks();
}

// Edit task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newName = prompt("Edit task:", task.name);
  if (newName && newName.trim() !== "") {
    task.name = newName.trim();
    renderTasks();
  }
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => {
    if (task.id === id) {
      deletedCount++;
      return false;
    }
    return true;
  });
  renderTasks();
}

// Update dashboard counts
function updateDashboard() {
  const pending = tasks.filter(t => t.status === "Pending").length;
  const completed = tasks.filter(t => t.status === "Completed").length;

  pendingCountEl.textContent = pending;
  completedCountEl.textContent = completed;
  deletedCountEl.textContent = deletedCount;
}

// Handle filter change
filterSelect.addEventListener("change", function () {
  filter = this.value;
  renderTasks();
});
