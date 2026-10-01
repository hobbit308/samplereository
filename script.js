const vocabulary = [
  {
    word: "안녕하세요",
    roman: "annyeonghaseyo",
    meaning: "안녕하세요 / 좋은 인사말",
    type: "인사",
    category: "일상",
    example: "예문: 안녕하세요, 오늘도 반가워요."
  },
  {
    word: "맛있다",
    roman: "masitda",
    meaning: "맛이 있다 / 맛있다",
    type: "형용사",
    category: "일상",
    example: "예문: 이 음식은 정말 맛있어요."
  },
  {
    word: "여행",
    roman: "yeohaeng",
    meaning: "여행 / 이동하며 보는 일",
    type: "명사",
    category: "여행",
    example: "예문: 다음 주에 일본 여행을 갑니다."
  },
  {
    word: "버스",
    roman: "beoseu",
    meaning: "버스 / 대중교통 수단",
    type: "명사",
    category: "여행",
    example: "예문: 버스 정류장에서 기다려요."
  },
  {
    word: "회의",
    roman: "hoeui",
    meaning: "회의 / 의견을 나누는 모임",
    type: "명사",
    category: "비즈니스",
    example: "예문: 오전 10시 회의가 시작됩니다."
  },
  {
    word: "준비하다",
    roman: "junbihada",
    meaning: "준비하다 / 미리 갖춰 놓다",
    type: "동사",
    category: "비즈니스",
    example: "예문: 발표를 위해 자료를 준비해요."
  },
  {
    word: "시험",
    roman: "siheom",
    meaning: "시험 / 평가의 일",
    type: "명사",
    category: "시험",
    example: "예문: 다음 주에 한국어 시험이 있어요."
  },
  {
    word: "정답",
    roman: "jeongdab",
    meaning: "정답 / 맞는 답",
    type: "명사",
    category: "시험",
    example: "예문: 정답을 확인해 보세요."
  }
];

const state = {
  category: "all",
  currentIndex: 0,
  progress: 68,
  streak: 14,
  revealed: false,
};

const items = {
  categoryPill: document.getElementById("categoryPill"),
  wordType: document.getElementById("wordType"),
  wordDisplay: document.getElementById("wordDisplay"),
  romanDisplay: document.getElementById("romanDisplay"),
  answerBox: document.getElementById("answerBox"),
  meaningDisplay: document.getElementById("meaningDisplay"),
  exampleDisplay: document.getElementById("exampleDisplay"),
  progressPercent: document.getElementById("progressPercent"),
  streakValue: document.getElementById("streakValue"),
  progressCircle: document.getElementById("progressCircle"),
  wordList: document.getElementById("wordList"),
  sentencePrompt: document.getElementById("sentencePrompt"),
  quizOptions: document.getElementById("quizOptions"),
  cardIndex: document.getElementById("cardIndex"),
};

const quizData = [
  {
    prompt: "“지금 시간이 얼마예요?”",
    options: ["지금 몇 시예요?", "지금 어디에 있어요?", "이거 맛있어요.", "도와주세요."],
    answer: 0,
  },
  {
    prompt: "“날씨가 아주 좋아요.”",
    options: ["날씨가 참 좋아요.", "이거 너무 비싸요.", "여기서 내려주세요.", "지금 먹고 있어요."],
    answer: 0,
  },
  {
    prompt: "“비행기를 타고 가요.”",
    options: ["비행기로 가요.", "우산을 잃어버렸어요.", "집에 가고 싶어요.", "책을 읽고 있어요."],
    answer: 0,
  },
];

function getFilteredWords() {
  if (state.category === "all") return vocabulary;
  return vocabulary.filter((item) => item.category === state.category);
}

function updateProgressRing() {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - state.progress / 100);

  items.progressCircle.style.strokeDasharray = circumference;
  items.progressCircle.style.strokeDashoffset = offset;
  items.progressPercent.textContent = `${state.progress}%`;
}

function renderWordList() {
  const words = getFilteredWords();
  items.wordList.innerHTML = words
    .slice(0, 5)
    .map(
      (item) => `
        <li>
          <strong>${item.word}</strong>
          <span>${item.category}</span>
        </li>
      `
    )
    .join("");
}

function renderCurrentWord() {
  const words = getFilteredWords();
  if (!words.length) return;

  const current = words[state.currentIndex % words.length];
  const total = words.length;

  items.categoryPill.textContent = state.category === "all" ? "전체" : state.category;
  items.wordType.textContent = current.type;
  items.wordDisplay.textContent = current.word;
  items.romanDisplay.textContent = current.roman;
  items.meaningDisplay.textContent = current.meaning;
  items.exampleDisplay.textContent = current.example;
  items.cardIndex.textContent = `${state.currentIndex % total + 1} / ${total}`;

  items.answerBox.hidden = !state.revealed;
}

function renderQuiz() {
  const question = quizData[Math.floor(Math.random() * quizData.length)];
  items.sentencePrompt.textContent = question.prompt;

  items.quizOptions.innerHTML = "";
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;

    button.addEventListener("click", () => {
      const isCorrect = index === question.answer;
      button.classList.toggle("correct", isCorrect);
      button.classList.toggle("wrong", !isCorrect);

      [...items.quizOptions.children].forEach((btn, btnIndex) => {
        if (btnIndex !== index && btnIndex === question.answer) {
          btn.classList.add("correct");
        }
      });

      setTimeout(renderQuiz, 900);
    });

    items.quizOptions.appendChild(button);
  });
}

function revealAnswer() {
  state.revealed = !state.revealed;
  items.answerBox.hidden = !state.revealed;
  document.getElementById("revealBtn").textContent = state.revealed ? "정답 숨기기" : "뜻 보기";
}

function nextWord() {
  const words = getFilteredWords();
  if (!words.length) return;

  state.currentIndex = (state.currentIndex + 1) % words.length;
  state.revealed = false;
  document.getElementById("revealBtn").textContent = "뜻 보기";
  renderCurrentWord();
}

function setCategory(category) {
  state.category = category;
  state.currentIndex = 0;
  state.revealed = false;
  document.getElementById("revealBtn").textContent = "뜻 보기";

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.category === category);
  });

  renderCurrentWord();
  renderWordList();
}

function init() {
  updateProgressRing();
  renderCurrentWord();
  renderWordList();
  renderQuiz();

  document.getElementById("revealBtn").addEventListener("click", revealAnswer);
  document.getElementById("nextBtn").addEventListener("click", nextWord);
  items.streakValue.textContent = `연속 ${state.streak}일`;

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => setCategory(chip.dataset.category));
  });
}

init();
