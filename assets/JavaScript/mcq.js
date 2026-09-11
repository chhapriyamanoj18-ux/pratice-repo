const quizData = [
  {
    q: "Living things require ________________ for breathing.",
    img: "../assets/images/boy-img.png",
    options: [
      { t: "🫁 argon" },
      { t: "🟣 oxygen" },
      { t: "🟢 nitrogen" },
      { t: "🔴 carbon dioxide" },
    ],
    a: 1,
  },
  {
    q: "________________ of the Earth is covered by water.",
    img: "../assets/images/earth-img.png",
    options: [
      { t: "🌊 80%" },
      { t: "💧 10%" },
      { t: "🌍 70%" },
      { t: "🪣 20%" },
    ],
    a: 2,
  },
  {
    q: "The roots of trees and plants bind the soil preventing ________________.",
    img: "../assets/images/tree-img.png",
    options: [
      { t: "🌱 soil erosion" },
      { t: "💎 minerals" },
      { t: "🫁 oxygen" },
      { t: "🏭 pollution" },
    ],
    a: 0,
  },
  {
    q: "________________ is refined to make petrol or diesel.",
    img: "../assets/images/oil-img.png",
    options: [
      { t: "🍂 Dead plant" },
      { t: "🛢️ Crude oil" },
      { t: "🔥 Fossil fuel" },
      { t: "⚙️ Metal" },
    ],
    a: 1,
  },
  {
    q: "A ________________ is a large area which is almost covered with woody vegetation or trees.",
    img: "../assets/images/forest-img.png",
    options: [
      { t: "🌿 plant" },
      { t: "🌳 forest" },
      { t: "🪨 soil" },
      { t: "🦴 fossil" },
    ],
    a: 1,
  },
];

let current = 0;
let score = 0;
let answered = Array(quizData.length).fill(null);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const questionImg = document.getElementById("questionImg");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function speak(text) {
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function loadQuestion() {
  const q = quizData[current];
  questionEl.textContent = q.q;
  questionImg.src = q.img;
  optionsEl.innerHTML = "";

  q.options.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `<span>${o.t}</span>`;

    // ✅ RESTORE STATE if already answered
    if (answered[current] !== null) {
      if (i === q.a) {
        div.classList.add("correct");
      } else {
        div.classList.add("disabled");
      }
    }

    div.onclick = () => {
      if (answered[current] !== null) return;

      if (i === q.a) {
        answered[current] = i;
        score++;
        speak("Correct");
        showPopup(true);

        div.classList.add("correct");
        [...optionsEl.children].forEach((el, idx) => {
          if (idx !== q.a) el.classList.add("disabled");
        });

        nextBtn.disabled = false;

        if (answered.every((a) => a !== null)) {
          setTimeout(showFinal, 1600);
        }
      } else {
        speak("Wrong");
        showPopup(false);
      }
    };

    optionsEl.appendChild(div);
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = answered[current] === null;
}

prevBtn.onclick = () => {
  current--;
  loadQuestion();
};
nextBtn.onclick = () => {
  current++;
  loadQuestion();
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

loadQuestion();
