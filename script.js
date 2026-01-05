const taskInput = document.getElementById("taskInput");
const detailInput = document.getElementById("detailInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", () => {
  if (!taskInput.value.trim()) return;

  const li = document.createElement("li");

  li.innerHTML = `
    <div class="task-title">${taskInput.value}</div>
    <div class="task-detail">${detailInput.value}</div>
    <button class="delete">削除</button>
  `;

li.querySelector(".delete").onclick = () => {
  if (confirm("このタスクを削除しますか？")) {
    li.remove();
  }
};

  taskList.appendChild(li);

  taskInput.value = "";
  detailInput.value = "";
});
