const questions = [
  {
    q: "__________, __________ and __________ are the three types of soil.",
    a: "sandy clay loamy",
    img: "../assets/images/soils-img.png",
    hint: "Think of different kinds of soil found on land",
  },
  {
    q: "Trees control __________ by using carbon dioxide for the process of photosynthesis.",
    a: "global warming",
    img: "../assets/images/trees-img.png",
    hint: "It is related to increase in Earth’s temperature",
  },
  {
    q: "Animals like __________ and __________ help in dispersal of seeds.",
    a: "birds, animals",
    img: "../assets/images/animals-img.png",
    hint: "Some animals carry or scatter seeds",
  },
  {
    q: "Many minerals are obtained from deep inside the __________.",
    a: "earth",
    img: "../assets/images/minerals-img.png",
    hint: "It is the planet we live on",
  },
  {
    q: "__________, __________ and __________ are some examples of fossil fuels.",
    a: "coal petroleum natural gas",
    img: "../assets/images/fossil-img.png",
    hint: "These fuels are formed from dead plants and animals",
  },
];

let index = 0,
  score = 0;
const answers = Array(5).fill(null);

const qText = document.getElementById("qText");
const qImg = document.getElementById("qImg");
const input = document.getElementById("answerInput");
const check = document.getElementById("checkBtn");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const inputBox = document.getElementById("inputBox");
const levelTrack = document.getElementById("levelTrack");
const levelText = document.getElementById("levelText");
const hintBtn = document.querySelector(".hint-btn");
const hintPopup = document.getElementById("hintPopup");
const hintPopupText = document.getElementById("hintPopupText");

function buildLevel() {
  levelTrack.innerHTML = "";
  questions.forEach((_, i) => {
    const b = document.createElement("div");
    b.className = "level-box" + (answers[i] ? " active" : "");
    levelTrack.appendChild(b);
  });
}

function speak(t) {
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(t));
}

//HINT POPUP HANDLER
hintBtn.onclick = (e) => {
  const rect = e.target.getBoundingClientRect();

  hintPopupText.textContent = questions[index].hint;

  hintPopup.style.left = rect.left-200 + "px";
  hintPopup.style.top = rect.top - 70 + "px";

  hintPopup.style.display =
    hintPopup.style.display === "block" ? "none" : "block";
};

function load() {
  const q = questions[index];
  qText.textContent = q.q;
  qImg.src = q.img;
  input.value = answers[index] || "";
  input.disabled = !!answers[index];
  check.disabled = !!answers[index] || !input.value.trim();
  inputBox.classList.toggle("correct", !!answers[index]);
  prev.disabled = index === 0;
  next.disabled = !answers[index];
  levelText.textContent = `Question ${index + 1} of 5`;
  buildLevel();
  hintPopup.style.display = "none";
}

input.oninput = () => {
  if (!answers[index]) check.disabled = !input.value.trim();
};

check.onclick = () => {
  if (input.value.trim().toLowerCase() === questions[index].a) {
    answers[index] = questions[index].a;
    score++;
    speak("Correct answer");
    showPopup(true);
    load();
    if (index === 4) setTimeout(showFinal, 1600);
  } else {
    speak("Wrong answer");
    showPopup(false);
    input.value = "";
    check.disabled = true;
  }
};

prev.onclick = () => {
  index--;
  load();
};
next.onclick = () => {
  index++;
  load();
};

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

load();
