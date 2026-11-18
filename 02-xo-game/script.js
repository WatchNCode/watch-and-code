// 1) نمسك العناصر
const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restart");

// 2) حالة اللعبة: 9 خانات فاضية، والسكور محفوظ في localStorage
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let thinking = false;
const score = JSON.parse(localStorage.getItem("score")) || { X: 0, O: 0, draw: 0 };

// 3) كل طرق الفوز: 3 صفوف + 3 أعمدة + قطرين
const winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

// 4) مين كسب؟ بترجّع الفايز، أو تعادل، أو ولا حاجة لو اللعبة لسه شغالة
function getWinner() {
  for (const [a, b, c] of winLines) {
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes("")) return "draw";
  return null;
}

// 5) نحط علامة في خانة
function play(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  const winner = getWinner();
  if (winner) endGame(winner);
}

// 6) نهاية اللعبة: الرسالة والسكور
function endGame(winner) {
  gameOver = true;
  score[winner]++;
  localStorage.setItem("score", JSON.stringify(score));
  updateScore();

  if (winner === "X") statusText.textContent = "إنت كسبت! 🎉";
  if (winner === "O") statusText.textContent = "الكمبيوتر كسب 🤖";
  if (winner === "draw") statusText.textContent = "تعادل 🤝";

  for (const line of winLines) {
    if (line.every((i) => board[i] === winner)) {
      line.forEach((i) => cells[i].classList.add("win"));
    }
  }
}

function updateScore() {
  document.querySelector("#score-x").textContent = score.X;
  document.querySelector("#score-o").textContent = score.O;
  document.querySelector("#score-draw").textContent = score.draw;
}

// 7) لما تضغط على خانة
cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const index = Number(cell.dataset.index);
    if (gameOver || thinking || board[index] !== "") return;

    play(index, "X");
    if (gameOver) return;

    thinking = true;
    statusText.textContent = "الكمبيوتر بيفكر... 🤔";
    setTimeout(computerMove, 600);
  });
});

// 8) مخ الكمبيوتر: بيجرّب كل خانة فاضية، ويشوف هل الحركة دي بتكسب
function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] !== "") continue;
    board[i] = player;
    const wins = getWinner() === player;
    board[i] = "";
    if (wins) return i;
  }
  return null;
}

function randomFrom(list) {
  const free = list.filter((i) => board[i] === "");
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}

function computerMove() {
  if (!thinking) return; // اتداس "لعبة جديدة" والكمبيوتر بيفكر
  let move = findWinningMove("O"); // أ) لو يقدر يكسب، يكسب
  if (move === null) move = findWinningMove("X"); // ب) لو إنت هتكسب، يقفلها
  if (move === null && board[4] === "") move = 4; // ج) ياخد النص
  if (move === null) move = randomFrom([0, 2, 6, 8]); // د) ياخد ركن
  if (move === null) move = randomFrom([1, 3, 5, 7]); // هـ) أي خانة فاضلة

  play(move, "O");
  thinking = false;
  if (!gameOver) statusText.textContent = "دورك: إنت X";
}

// 9) لعبة جديدة
restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  thinking = false;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });
  statusText.textContent = "دورك: إنت X";
});

updateScore();
