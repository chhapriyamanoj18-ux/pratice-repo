const questions = [
  { q: "Air does not help in the dispersal of seeds.", a: false },
  { q: "Renewable resources can be replenished naturally.", a: true },
  { q: "It takes one year for the formation of fossil fuels.", a: false },
  { q: "The process of planting trees is called afforestation.", a: true },
  { q: "Gold and silver are used to make jewellery.", a: true },
];

let index = 0,
  score = 0;
const answers = Array(questions.length).fill(null);

const qEl = document.getElementById("question");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const trueBtn = document.getElementById("trueBtn");
const falseBtn = document.getElementById("falseBtn");

function renderProgress() {
  progress.innerHTML = "";
  questions.forEach((_, i) => {
    const s = document.createElement("div");
    s.className = "station";
    if (i < index) s.classList.add("done");
    if (i === index) s.classList.add("active");
    if (i === questions.length - 1) {
      s.classList.add("finish");
      s.textContent = "🏁";
    } else {
      s.textContent = i === index ? "🚆" : i + 1;
    }
    progress.appendChild(s);
  });
}

function render() {
  qEl.textContent = questions[index].q;

  trueBtn.disabled = false;
  falseBtn.disabled = false;
  trueBtn.classList.remove("correct");
  falseBtn.classList.remove("correct");

  if (answers[index] !== null) {
    if (answers[index] === true) {
      trueBtn.classList.add("correct");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("correct");
      trueBtn.disabled = true;
    }
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }

  prevBtn.disabled = index === 0;
  renderProgress();
}

function speak(text) {
  window.speechSynthesis.cancel(); // stop previous speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function answer(val) {
  if (answers[index] !== null) return;

  if (questions[index].a === val) {
    answers[index] = val;
    score++;
    speak("Correct");
    showPopup(true);
    if (val) {
      trueBtn.classList.add("correct");
      falseBtn.disabled = true;
    } else {
      falseBtn.classList.add("correct");
      trueBtn.disabled = true;
    }
    nextBtn.disabled = false;
    if (index === questions.length - 1) setTimeout(showFinal, 1600);
  } else {
    speak("Wrong");
    showPopup(false);
  }
  renderProgress();
}

trueBtn.onclick = () => answer(true);
falseBtn.onclick = () => answer(false);

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    render();
  }
};
nextBtn.onclick = () => {
  if (index < questions.length - 1) {
    index++;
    render();
  }
};

/* POPUPS */
function showPopup(isCorrect) {
  const popup = document.getElementById("answerPopup");
  const icon = document.getElementById("popupIcon");
  const title = document.getElementById("popupTitle");
  const msg = document.getElementById("popupMsg");
  popup.className = "popup " + (isCorrect ? "correct" : "wrong");
  popup.style.display = "flex";
  if (isCorrect) {
    icon.textContent = "🎉";
    title.textContent = "Correct!";
    msg.textContent = "Well done!";
  } else {
    icon.textContent = "😔";
    title.textContent = "Wrong!";
    msg.textContent = "Try again!";
  }
  setTimeout(() => {
    popup.style.display = "none";
  }, 1200);
}

function showFinal() {
  const finalPopup = document.getElementById("finalPopup");
  finalPopup.style.display = "flex";

  document.getElementById("finalScore").textContent = `Score: ${score}/5`;
  document.getElementById("stars").textContent = "⭐".repeat(score);

  // 🎉 CONFETTI EFFECT
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

render();
