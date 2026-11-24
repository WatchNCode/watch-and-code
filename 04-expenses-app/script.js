// 1) نمسك العناصر
const form = document.querySelector("#expense-form");
const titleInput = document.querySelector("#title");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const totalText = document.querySelector("#total");
const chart = document.querySelector("#chart");
const list = document.querySelector("#list");

// 2) التصنيفات: اسم وإيموجي ولون لكل واحد
const categories = {
  food: { name: "أكل", icon: "🍔", color: "#f97316" },
  transport: { name: "مواصلات", icon: "🚗", color: "#38bdf8" },
  bills: { name: "فواتير", icon: "💡", color: "#facc15" },
  fun: { name: "خروجات", icon: "🎉", color: "#f472b6" },
  other: { name: "تانية", icon: "📦", color: "#a3e635" },
};

// 3) المصروفات محفوظة في localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function save() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// 4) الإجمالي: نجمع كل المبالغ بـ reduce
function getTotal(items) {
  return items.reduce((sum, expense) => sum + expense.amount, 0);
}

// 5) نضيف مصروف جديد
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  if (title === "" || amount <= 0) return;

  expenses.push({ id: Date.now(), title, amount, category: categoryInput.value });
  save();
  render();
  form.reset();
  titleInput.focus();
});

// 6) نمسح مصروف: نسيب كل المصروفات ما عدا اللي اتداس عليه
function removeExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  save();
  render();
}

// 7) القايمة: الأحدث فوق
function renderList() {
  list.innerHTML = "";
  if (expenses.length === 0) {
    list.innerHTML = `<li class="empty">مفيش مصروفات لسه 🎉</li>`;
    return;
  }

  for (const expense of [...expenses].reverse()) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${categories[expense.category].icon}</span>
      <span class="title"></span>
      <span class="amount">${expense.amount} ج</span>
      <button class="delete">✕</button>
    `;
    li.querySelector(".title").textContent = expense.title;
    li.querySelector(".delete").addEventListener("click", () => removeExpense(expense.id));
    list.appendChild(li);
  }
}

// 8) الرسم البياني: طول كل عمود على قد نسبة التصنيف من الإجمالي
function renderChart() {
  chart.innerHTML = "";
  const total = getTotal(expenses);

  for (const key in categories) {
    const category = categories[key];
    const sum = getTotal(expenses.filter((expense) => expense.category === key));
    if (sum === 0) continue;

    const percent = Math.round((sum / total) * 100);
    chart.innerHTML += `
      <div class="bar-row">
        <span>${category.icon} ${category.name}</span>
        <div class="bar"><div class="bar-fill" style="width: ${percent}%; background: ${category.color}"></div></div>
        <span class="bar-value">${percent}%</span>
      </div>
    `;
  }
}

// 9) نحدّث كل حاجة مرة واحدة
function render() {
  totalText.textContent = `${getTotal(expenses)} جنيه`;
  renderList();
  renderChart();
}

render();
