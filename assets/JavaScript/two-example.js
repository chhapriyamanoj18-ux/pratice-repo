const questions = [
  {
    text: "Give two examples of types of soil.",
    img: "../assets/images/Newsoil-img.png",
    answers: ["sandy", "clay"],
    options: [
      { id: "sandy", label: "Sandy Soil", emoji: "🏖️" },
      { id: "clay", label: "Clay Soil", emoji: "🧱" },
      { id: "rocky", label: "Rocky Soil", emoji: "🪨" },
      { id: "dust", label: "Dust", emoji: "💨" },
    ],
  },
  {
    text: "Give two examples of renewable resources.",
    img: "../assets/images/renewable-img.png",
    answers: ["sunlight", "wind"],
    options: [
      { id: "coal", label: "Coal", emoji: "🕳️" },
      { id: "sunlight", label: "Sunlight", emoji: "☀️" },
      { id: "wind", label: "Wind", emoji: "🌬️" },
      { id: "petrol", label: "Petrol", emoji: "⛽" },
    ],
  },
  {
    text: "Give two examples of non-renewable resources.",
    img: "../assets/images/Nonrenewable-img.png",
    answers: ["coal", "petroleum"],
    options: [
      { id: "coal", label: "Coal", emoji: "⬛" },
      { id: "water", label: "Water", emoji: "💧" },
      { id: "petroleum", label: "Petroleum", emoji: "🛢️" },
      { id: "air", label: "Air", emoji: "☁️" },
    ],
  },
  {
    text: "Give two examples of metals.",
    img: "../assets/images/metal-img.png",
    answers: ["iron", "gold"],
    options: [
      { id: "wood", label: "Wood", emoji: "🪵" },
      { id: "iron", label: "Iron", emoji: "⛓️" },
      { id: "gold", label: "Gold", emoji: "🥇" },
      { id: "plastic", label: "Plastic", emoji: "🥤" },
    ],
  },
  {
    text: "Give two examples of natural resources.",
    img: "../assets/images/natural-img.png",
    answers: ["water", "forests"],
    options: [
      { id: "water", label: "Water", emoji: "🌊" },
      { id: "cars", label: "Cars", emoji: "🚗" },
      { id: "forests", label: "Forests", emoji: "🌲" },
      { id: "buildings", label: "Buildings", emoji: "🏢" },
    ],
  },
];

let index = 0,
  score = 0;
const state = questions.map(() => ({ selected: [], completed: false }));

function speak(t) {
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(t));
}

function render() {
  const q = questions[index];
  document.getElementById("qText").textContent = q.text;
  document.getElementById("topicImg").src = q.img;

  const optBox = document.getElementById("optionsBox");
  optBox.innerHTML = "";

  resetDropZone("drop1");
  resetDropZone("drop2");

  q.options.forEach((o) => {
    const div = document.createElement("div");
    const isSelected = state[index].selected.includes(o.id);
    const isFinished = state[index].completed;
    const shouldBeDisabled = isSelected || isFinished;

    div.className = `option-card ${shouldBeDisabled ? "disabled" : ""}`;
    div.id = o.id;
    div.innerHTML = `<span class="option-emoji">${o.emoji}</span><span class="option-label">${o.label}</span>`;

    if (!shouldBeDisabled) {
      div.draggable = true;
      div.ondragstart = (e) => {
        e.dataTransfer.setData("text", e.target.closest(".option-card").id);
      };
    }
    optBox.appendChild(div);
  });

  state[index].selected.forEach((id, i) => {
    const optionData = q.options.find((o) => o.id === id);
    showInDropZone(optionData, document.getElementById(`drop${i + 1}`));
  });

  updateUI();
}

function allowDrop(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add("hover");
}

// Remove hover on leave
document.querySelectorAll(".drop-box").forEach((box) => {
  box.ondragleave = (e) => e.currentTarget.classList.remove("hover");
});

function drop(ev) {
  ev.preventDefault();
  const zone = ev.currentTarget;
  zone.classList.remove("hover");
  if (zone.classList.contains("filled")) return;

  const id = ev.dataTransfer.getData("text");
  const q = questions[index];

  if (q.answers.includes(id)) {
    state[index].selected.push(id);
    const optionData = q.options.find((o) => o.id === id);
    showInDropZone(optionData, zone);
    speak("Correct");

    if (state[index].selected.length === q.answers.length) {
      state[index].completed = true;
      score++;
      setTimeout(render, 500);
      if (index === questions.length - 1) setTimeout(showFinal, 800);
    } else {
      render();
    }
  } else {
    speak("Wrong");
    zone.classList.add("error");
    setTimeout(() => zone.classList.remove("error"), 500);
  }
}

function showInDropZone(option, target) {
  target.innerHTML = `<span style="font-size:30px; margin-right:15px">${option.emoji}</span>
            <span style="color:var(--brand-dark); font-size: 20px;">${option.label}</span>`;
  target.classList.add("filled");
}

function resetDropZone(id) {
  const zone = document.getElementById(id);
  zone.classList.remove("filled");
  zone.innerHTML = `<span class="drop-hint">DRAG EXAMPLE ${id.slice(-1)} HERE</span>`;
}

function updateUI() {
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  prev.disabled = index === 0;
  next.disabled = !state[index].completed;
}

function changeQuestion(step) {
  index += step;
  render();
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
