// ===== 要素取得 =====
const taskInput = document.getElementById("taskInput");
const detailInput = document.getElementById("detailInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const listWrap = document.getElementById("listWrap");
const inputArea = document.querySelector(".input-area");

const STORAGE_KEY = "iphone_tasks";


// ===== 初期処理 =====
loadTasks();
resizeListWrap();


// ===== イベント登録 =====

// 追加
addBtn.addEventListener("click", addTaskHandler);

// Enterキー対応（概要入力）
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTaskHandler();
  }
});

// 削除（イベント委譲）
document.addEventListener("click", e => {
  if (!e.target.classList.contains("delete")) return;

  if (!confirm("このタスクを削除しますか？")) return;

  const li = e.target.closest("li");
  const id = li.dataset.id;

  li.remove();
  removeTask(id);
});

// キーボード・回転対応
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", resizeListWrap);
}
window.addEventListener("resize", resizeListWrap);


// ===== 関数群 =====

// タスク追加ハンドラ
function addTaskHandler() {
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

  // 最新タスクを表示
  listWrap.scrollTop = 0;
}

// タスク描画
function addTask(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  li.innerHTML = `
    <div>
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-detail">${escapeHtml(task.detail)}</div>
    </div>
    <button class="delete">削除</button>
  `;

  taskList.prepend(li);
}

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

// 取得
function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// 削除
function removeTask(id) {
  const tasks = getTasks().filter(t => t.id != id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===== iOSキーボード対応（最重要） =====
function resizeListWrap() {
  const viewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;

  const inputHeight = inputArea.offsetHeight;

  listWrap.style.height = (viewportHeight - inputHeight) + "px";
}

// ===== XSS対策（保険） =====
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
