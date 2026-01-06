const taskInput = document.getElementById("taskInput");
const detailInput = document.getElementById("detailInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const STORAGE_KEY = "iphone_tasks";

// 初期読込み
loadTasks();

// 追加
addBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  const detail = detailInput.value.trim();
  if (!title) return;

  const task = {
    id: Date.now(),
    title,
    detail,
  };

  addTask(task);
  saveTask(task);

  taskInput.value = "";
  detailInput.value = "";
  taskInput.blur();
  detailInput.blur();
});

const newBtn = document.getElementById("newBtn");

newBtn.addEventListener("click", () => {
  taskInput.focus();
});

// タスク描画
function addTask(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  li.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-detail">${task.detail}</div>
    <button class="delete">削除</button>
  `;

  taskList.prepend(li);
}

// 削除（イベント委譲）
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("delete")) return;

  if (!confirm("このタスクを削除しますか？")) return;

  const li = e.target.closest("li");
  const id = li.dataset.id;

  li.remove();
  removeTask(id);
});

// 保存
function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// 読み込み
function loadTasks() {
  const tasks = getTasks();
  tasks.reverse().forEach(addTask);
}

function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// 削除処理
function removeTask(id) {
  const tasks = getTasks().filter(t => t.id != id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
