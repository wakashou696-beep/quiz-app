// ============================================= Script ==================================================
// ===== localStorageデータ =====
//const solved = JSON.parse(localStorage.getItem("solved")) || [];
// ===== JSONデータ =====
let questions = [];
let index = 0;
let currentQuestion;

// ===== loadQuestions =====
async function loadQuestions() {
  const response = await fetch("./data/questions.json");
  questions = await response.json();
  // enabled=falseを除外
  questions = questions.filter(q => q.enabled);
  nextQuestion();
}

loadQuestions();
// ===== 解答履歴読み込み =====
  function getSolved(){
    return JSON.parse(localStorage.getItem("solved")) || [];
  }

// ===== 解答履歴保存 =====
function addSolved(id){
  let solved=JSON.parse(localStorage.getItem("solved")) || [];
  if (!solved.includes(id)){
    solved.push(id);
    localStorage.setItem("solved",JSON.stringify(solved));
    }
    solved=getSolved(); // ログ出力のために再取得
    console.log("解答履歴:",solved);
}
// ===== 解答履歴でフィルター =====
  function getAvailableQuestions(){
    const solved=getSolved();
    return questions.filter(q => !solved.includes(q.id));
  }

// ===== 表示関数 =====
function render(q) {
  const solved=getSolved();
  document.getElementById("questionInfo").innerText =
    `${index + 1} / ${questions.length}
     ID:${q.id}
     難易度:${q.difficulty}
     解答済み:${solved.length}`;
  document.getElementById("questionText").innerText = q.question.text;

  document.getElementById("questionLatex").innerHTML =
    q.question.latex ? `\\(${q.question.latex}\\)` : "";

  document.getElementById("questionFigure").innerText =
    q.question.figure
      ? `図形: 底辺=${q.question.figure.base}, 高さ=${q.question.figure.height}`
      : "";

  document.getElementById("answerBox").style.display = "none";
  document.getElementById("answerBox").innerText = "";
  // DOM更新後に一括レンダリング
  requestAnimationFrame(() => {
    MathJax.typesetPromise();
  });
}
  
// ===== 解答表示 =====
function showAnswer(q) {
  const box = document.getElementById("answerBox");

  box.style.display = "block";
  box.innerHTML = `
  ${q.answer.latex ? `解答: \\(${q.answer.latex}\\)<br>` : `<br>`}
  ${q.answer.text ? `答え: ${q.answer.text}` : " "}`;
  addSolved(q.id);
  requestAnimationFrame(() => {
    MathJax.typesetPromise([box]);
  });
}
  
// ===== 次へ =====
function nextQuestion() {
  const available =getAvailableQuestions();
  if (available.length ===0){
    alert("終了");
    localStorage.removeItem("solved");
    return;
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  currentQuestion=available[randomIndex];
  render(currentQuestion);
}

// 初期表示
loadQuestions();