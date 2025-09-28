// Array to store tasks
let tasks = [];

// Select DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskBody = document.getElementById("taskBody");

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

  tasks.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="py-2 px-4">${index + 1}</td>
      <td class="py-2 px-4">${task.name}</td>
      <td class="py-2 px-4">${task.date}</td>
      <td class="py-2 px-4">${task.status}</td>
      <td class="py-2 px-4 space-x-2">
        <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
          onclick="markComplete(${task.id})">Complete</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
          onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;

    taskBody.appendChild(row);
  });
}

// Mark task as complete
function markComplete(id) {
  tasks = tasks.map(task => 
    task.id === id ? {...task, status: "Completed"} : task
  );
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}


