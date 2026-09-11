(function () {
  const data = [
    {
      id: "3",
      text: "Main source of water",
      match: "a",
      icon: "🌧️",
      matchText: "Rain",
    },
    {
      id: "4",
      text: "Control of global warming",
      match: "b",
      icon: "🌳",
      matchText: "Trees",
    },
    {
      id: "5",
      text: "Used in making machines",
      match: "c",
      icon: "⚙️",
      matchText: "Iron & Aluminium",
    },
    {
      id: "2",
      text: "Planting trees",
      match: "d",
      icon: "🌱",
      matchText: "Afforestation",
    },
    {
      id: "1",
      text: "Type of soil",
      match: "e",
      icon: "🪱",
      matchText: "Loamy",
    },
  ];

  let selectedLeft = null;
  let matchesFound = 0;
  let score = 0;
  let connections = [];

  const leftCol = document.getElementById("leftColumn");
  const rightCol = document.getElementById("rightColumn");
  const svg = document.getElementById("line-canvas");
  const anchor = document.querySelector(".anchor");
  const left = document.querySelector(".left");
  const right = document.querySelector(".right");

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  function init() {
    const shuffledRight = shuffle(data);

    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item";
      div.dataset.id = item.id;
      div.dataset.match = item.match;
      div.innerHTML = `<span>${item.text}</span><div class="anchor"></div>`;
      div.onclick = () => {
        if (div.classList.contains("matched")) return;
        document
          .querySelectorAll(".left .item")
          .forEach((i) => i.classList.remove("active"));
        div.classList.add("active");
        selectedLeft = div;
        // speak(item.text);
      };
      leftCol.appendChild(div);
    });

    shuffledRight.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item";
      div.dataset.id = item.match;
      div.innerHTML = `<div class="anchor"></div><div class="content-wrapper"><span class="icon">${item.icon}</span><span>${item.matchText}</span></div>`;

      div.onclick = () => {
        if (!selectedLeft || div.classList.contains("matched")) return;

        if (selectedLeft.dataset.match === div.dataset.id) {
          handleMatch(selectedLeft, div);
        } else {
          // --- WRONG MATCH LOGIC ---
          speak("Wrong");

          // Add error class for blinking effect
          div.classList.add("error");

          setTimeout(() => {
            div.classList.remove("error");
          }, 400);
        }
      };
      rightCol.appendChild(div);
    });
  }

  function handleMatch(leftEl, rightEl) {
    speak("Correct!");
    score++;
    leftEl.classList.add("matched");
    rightEl.classList.add("matched");
    leftEl.classList.remove("active");

    drawCurve(leftEl, rightEl);
    connections.push({ from: leftEl, to: rightEl });

    selectedLeft = null;
    matchesFound++;
    if (matchesFound === data.length) setTimeout(showFinal, 600);
  }

  function drawCurve(el1, el2) {
    const rect1 = el1.querySelector(".anchor").getBoundingClientRect();
    const rect2 = el2.querySelector(".anchor").getBoundingClientRect();
    const containerRect = svg.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;

    const cx = (x1 + x2) / 2;
    const pathData = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#22c55e");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke-linecap", "round");

    const length = 1000;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    svg.appendChild(path);

    setTimeout(() => {
      path.style.transition = "stroke-dashoffset 0.5s ease-out";
      path.style.strokeDashoffset = "0";
    }, 10);
  }

  function speak(t) {
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(t));
  }

  function showFinal() {
    svg.style.zIndex = "0";
    left.style.zIndex = "0";
    right.style.zIndex = "0";
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

  window.addEventListener("resize", () => {
    svg.innerHTML = "";
    connections.forEach((conn) => drawCurve(conn.from, conn.to));
  });

  init();
})();
