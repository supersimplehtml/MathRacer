import { Finish } from "./Finish";
import { generateQuestion } from "../Engine/MathGenerator";

export class Race {
  constructor(sceneManager, tables, car) {
    this.sceneManager = sceneManager;
    this.root = null;

    this.tables = tables;
    this.car = car || { speed: 2.2 };

    // 🛑 GAME STATE
    this.gameOver = false;

    // 📊 STATS
    this.stats = {
      startTime: null,
      correct: 0,
      wrong: 0,
    };

    // 🏁 TRACK
    this.finishLine = 11000;

    // 📱 Responsive sizing
    this.scale = Math.min(window.innerWidth / 1400, 1);

    this.carWidth = Math.max(
      40,
      Math.min(65, window.innerWidth * 0.045)
    );

    this.carHeight = this.carWidth * 1.6;

    this.roadHeight = Math.max(
      220,
      Math.min(320, window.innerHeight * 0.32)
    );

    // 🚗 Lane positions
    const lane = this.roadHeight / 4;

    // Base speed
    const BASE_SPEED = 2.2;

    // 🚗 Cars
    this.cars = {
      player: {
        x: 0,
        y: lane * 1.5,
        speed: BASE_SPEED,
      },

      ai1: {
        x: 0,
        y: lane * 0.5,
        speed: BASE_SPEED,
      },

      ai2: {
        x: 0,
        y: lane * 2.5,
        speed: BASE_SPEED,
      },

      ai3: {
        x: 0,
        y: lane * 3.5,
        speed: BASE_SPEED,
      },
    };

    // Player's normal speed
    this.car.speed = BASE_SPEED;

    // 🤖 AI BOOST SYSTEM
    // First boost happens randomly between 5 and 13 seconds.
    this.aiNextBoost = Date.now() + 5000 + Math.random() * 8000;
    this.aiBoostUntil = 0;

    // 🏎️ PLAYER BOOST SYSTEM
    this.playerBoostUntil = 0;

    // 🧠 Current question
    this.question = null;
    this.questionStartTime = null;
  }

  // -------------------
  // RENDER
  // -------------------
  render(root) {
    this.root = root;

    const container = document.createElement("div");

    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.overflow = "hidden";
    container.style.background = "#111";
    container.style.fontFamily = "Arial";
    container.style.position = "relative";

    container.innerHTML = `
      <!-- WORLD -->
      <div id="world" style="
        position:absolute;
        top:0;
        left:0;
        width:12000px;
        height:100vh;
        background: linear-gradient(#3cb043, #2e8b57);
      ">

        <!-- ROAD -->
        <div id="track" style="
          position:absolute;
          top:50%;
          transform: translateY(-50%);
          left:0;
          width:12000px;
          height:${this.roadHeight}px;
          background:#2c2c2c;
          border-top:5px solid white;
          border-bottom:5px solid white;
        ">

          <!-- LANES -->
          <div style="
            position:absolute;
            top:${this.roadHeight * 0.25}px;
            width:100%;
            height:2px;
            background: repeating-linear-gradient(
              90deg,
              white,
              white 20px,
              transparent 20px,
              transparent 40px
            );
          "></div>

          <div style="
            position:absolute;
            top:${this.roadHeight * 0.5}px;
            width:100%;
            height:2px;
            background: repeating-linear-gradient(
              90deg,
              white,
              white 20px,
              transparent 20px,
              transparent 40px
            );
          "></div>

          <div style="
            position:absolute;
            top:${this.roadHeight * 0.75}px;
            width:100%;
            height:2px;
            background: repeating-linear-gradient(
              90deg,
              white,
              white 20px,
              transparent 20px,
              transparent 40px
            );
          "></div>

          <!-- CARS -->
          <img id="player" class="car" src="/playercar2.png">
          <img id="ai1" class="car" src="/aicar.png">
          <img id="ai2" class="car" src="/aicar.png">
          <img id="ai3" class="car" src="/aicar.png">

          <!-- FINISH -->
          <div id="finish" style="
            position:absolute;
            top:50%;
            transform: translateY(-50%);
            left:11000px;
            width:${Math.max(50, this.scale * 80)}px;
            height:${this.roadHeight}px;
            font-size:${Math.max(30, this.scale * 40)}px;
            background: repeating-linear-gradient(
              45deg,
              white,
              white 10px,
              black 10px,
              black 20px
            );
            display:flex;
            align-items:center;
            justify-content:center;
          ">🏁</div>

        </div>
      </div>

      <!-- HUD -->
      <div style="
        position:absolute;
        bottom:0;
        left:0;
        width:100%;
        background:rgba(0,0,0,0.92);
        color:white;
        padding:clamp(12px,3vw,30px);
        box-sizing:border-box;
        text-align:center;
      ">

        <h1 id="qbox" style="
          margin:0 0 25px 0;
          font-size:clamp(28px,5vw,60px);
          font-weight:900;
          letter-spacing:2px;
          color:#FFD700;
          text-shadow:
            0 0 10px #ffae00,
            0 0 20px #ffae00,
            3px 3px 0 #000;
        ">
        </h1>

        <div id="options" style="
          display:flex;
          justify-content:center;
          gap:clamp(10px,2vw,20px);
          flex-wrap:wrap;
        "></div>

      </div>
    `;

    root.appendChild(container);

    // Elements
    this.el = {
      world: container.querySelector("#world"),
      player: container.querySelector("#player"),
      ai1: container.querySelector("#ai1"),
      ai2: container.querySelector("#ai2"),
      ai3: container.querySelector("#ai3"),
      qbox: container.querySelector("#qbox"),
      options: container.querySelector("#options"),
    };

    // Style all cars
    [this.el.player, this.el.ai1, this.el.ai2, this.el.ai3].forEach(
      (car) => {
        car.style.position = "absolute";

        car.style.width = this.carWidth + "px";
        car.style.height = this.carHeight + "px";

        car.style.objectFit = "contain";

        // Images point upward, rotate them to face right.
        car.style.transform =
          "translate(-50%, -50%) rotate(90deg)";

        car.style.transformOrigin = "center center";

        car.style.userSelect = "none";

        car.draggable = false;
      }
    );

    // First question
    this.nextQuestion();

    // ⏱ Start with countdown
    this.startCountdown(() => {
      this.stats.startTime = Date.now();
      this.loop();
    });

    // 📱 Resize
    window.addEventListener("resize", () => {
      this.scale = Math.min(window.innerWidth / 1400, 1);

      this.carWidth = Math.max(
        40,
        Math.min(65, window.innerWidth * 0.045)
      );

      this.carHeight = this.carWidth * 1.6;

      [this.el.player, this.el.ai1, this.el.ai2, this.el.ai3].forEach(
        (car) => {
          car.style.width = this.carWidth + "px";
          car.style.height = this.carHeight + "px";
        }
      );
    });
  }

  // -------------------
  // COUNTDOWN
  // -------------------
  startCountdown(callback) {
    const overlay = document.createElement("div");

    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.fontSize = "clamp(70px,18vw,140px)";
    overlay.style.color = "white";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = "999";

    document.body.appendChild(overlay);

    let count = 3;

    const interval = setInterval(() => {
      if (count > 0) {
        overlay.innerText = count;
      } else if (count === 0) {
        overlay.innerText = "GO!";
      } else {
        clearInterval(interval);
        overlay.remove();
        callback();
      }

      count--;
    }, 1000);
  }

  // -------------------
  // LOOP
  // -------------------
  loop() {
    const tick = () => {
      this.update();
      requestAnimationFrame(tick);
    };

    tick();
  }

  // -------------------
  // UPDATE
  // -------------------
  update() {
    if (this.gameOver) return;

    const now = Date.now();

    // 🚗 MOVE CARS
    this.move(this.cars.player);
    this.move(this.cars.ai1);
    this.move(this.cars.ai2);
    this.move(this.cars.ai3);

    // 🤖 RANDOM AI BOOST
    if (now >= this.aiNextBoost) {
      const boosts = [
        {
          car: this.cars.ai1,
          speed: 5.0,
          name: "AI 1",
        },
        {
          car: this.cars.ai2,
          speed: 5.3,
          name: "AI 2",
        },
        {
          car: this.cars.ai3,
          speed: 5.6,
          name: "AI 3",
        },
      ];

      // Pick random AI
      const chosen =
        boosts[Math.floor(Math.random() * boosts.length)];

      // Big boost
      chosen.car.speed = chosen.speed;

      // Boost lasts between 2 and 4 seconds
      const duration = 2000 + Math.random() * 2000;

      this.aiBoostUntil = now + duration;

      // Next boost happens 7–15 seconds later
      this.aiNextBoost =
        now + 7000 + Math.random() * 8000;
    }

    // 🤖 END AI BOOST
    if (
      this.aiBoostUntil &&
      now >= this.aiBoostUntil
    ) {
      this.cars.ai1.speed = 2.2;
      this.cars.ai2.speed = 2.2;
      this.cars.ai3.speed = 2.2;

      this.aiBoostUntil = 0;
    }

    // 🏎️ END PLAYER BOOST
    if (
      this.playerBoostUntil &&
      now >= this.playerBoostUntil
    ) {
      this.cars.player.speed = this.car.speed;
      this.playerBoostUntil = 0;
    }

    this.renderPositions();
    this.renderCamera();
    this.checkWin();
  }

  // -------------------
  // MOVE
  // -------------------
  move(car) {
    car.x += car.speed;
  }

  // -------------------
  // CAMERA
  // -------------------
  renderCamera() {
    const cameraOffset = window.innerWidth * 0.25;

    const cameraX =
      this.cars.player.x - cameraOffset;

    this.el.world.style.transform =
      `translateX(${-cameraX}px)`;
  }

  // -------------------
  // POSITIONING
  // -------------------
  renderPositions() {
    this.el.player.style.left =
      this.cars.player.x + "px";

    this.el.player.style.top =
      this.cars.player.y + "px";

    this.el.ai1.style.left =
      this.cars.ai1.x + "px";

    this.el.ai1.style.top =
      this.cars.ai1.y + "px";

    this.el.ai2.style.left =
      this.cars.ai2.x + "px";

    this.el.ai2.style.top =
      this.cars.ai2.y + "px";

    this.el.ai3.style.left =
      this.cars.ai3.x + "px";

    this.el.ai3.style.top =
      this.cars.ai3.y + "px";
  }

  // -------------------
  // QUESTIONS
  // -------------------
  nextQuestion() {
    this.question = generateQuestion(this.tables);

    this.el.qbox.innerText =
      `${this.question.question} = ?`;

    this.el.options.innerHTML = "";

    this.question.options.forEach((opt) => {
      const btn = document.createElement("button");

      btn.innerText = opt;

      btn.style.width = "clamp(80px,18vw,150px)";
      btn.style.height = "clamp(50px,8vw,75px)";
      btn.style.margin = "8px";
      btn.style.fontSize = "clamp(20px,3vw,30px)";
      btn.style.fontWeight = "bold";
      btn.style.border = "none";
      btn.style.borderRadius = "15px";
      btn.style.background = "#2196F3";
      btn.style.color = "white";
      btn.style.cursor = "pointer";
      btn.style.transition = "0.2s";

      btn.onmouseenter = () => {
        btn.style.transform = "scale(1.08)";
      };

      btn.onmouseleave = () => {
        btn.style.transform = "scale(1)";
      };

      btn.onclick = () => this.answer(opt);

      this.el.options.appendChild(btn);
    });

    // ⏱ Start reaction timer
    this.questionStartTime = Date.now();
  }

  // -------------------
  // ANSWER
  // -------------------
  answer(val) {
    if (this.gameOver) return;

    const reactionTime =
      (Date.now() - this.questionStartTime) / 1000;

    // ✅ CORRECT
    if (val === this.question.correct) {
      this.stats.correct++;

      let boost = 0;
      let duration = 0;

      // 🚀 EXTREMELY FAST
      if (reactionTime <= 1) {
        boost = 4.5;
        duration = 1000;
      }

      // 🔥 FAST
      else if (reactionTime <= 2) {
        boost = 3.5;
        duration = 900;
      }

      // ⚡ DECENT
      else if (reactionTime <= 3) {
        boost = 2.5;
        duration = 800;
      }

      // 👍 SLOW
      else if (reactionTime <= 5) {
        boost = 1.2;
        duration = 600;
      }

      // 🐌 VERY SLOW
      else {
        boost = 0.5;
        duration = 400;
      }

      // Apply player boost
      this.cars.player.speed =
        this.car.speed + boost;

      this.playerBoostUntil =
        Date.now() + duration;
    }

    // ❌ WRONG
    else {
      this.stats.wrong++;

      // Slow player down
      this.cars.player.speed = Math.max(
        1.2,
        this.car.speed - 0.7
      );

      this.playerBoostUntil =
        Date.now() + 600;
    }

    // Next question
    this.nextQuestion();
  }

  // -------------------
  // WIN CHECK
  // -------------------
  checkWin() {
    if (this.gameOver) return;

    const win = (text) => {
      this.gameOver = true;

      const timeTaken = (
        (Date.now() - this.stats.startTime) /
        1000
      ).toFixed(1);

      const total =
        this.stats.correct +
        this.stats.wrong;

      const accuracy = total
        ? Math.round(
            (this.stats.correct / total) * 100
          )
        : 0;

      const endScreen =
        document.createElement("div");

      endScreen.style.position = "absolute";
      endScreen.style.top = "0";
      endScreen.style.left = "0";
      endScreen.style.width = "100vw";
      endScreen.style.height = "100vh";
      endScreen.style.background = "#000";
      endScreen.style.color = "white";
      endScreen.style.display = "flex";
      endScreen.style.flexDirection = "column";
      endScreen.style.alignItems = "center";
      endScreen.style.justifyContent = "center";
      endScreen.style.fontSize = "28px";
      endScreen.style.zIndex = "1000";

      endScreen.innerHTML = `
        <h1>${text}</h1>

        <p>⏱ Time: ${timeTaken}s</p>

        <p>✅ Correct: ${this.stats.correct}</p>

        <p>❌ Wrong: ${this.stats.wrong}</p>

        <p>🎯 Accuracy: ${accuracy}%</p>

        <button
          onclick="location.reload()"
          style="
            margin-top:20px;
            padding:15px 30px;
            font-size:22px;
            font-weight:bold;
            border:none;
            border-radius:12px;
            cursor:pointer;
          "
        >
          Play Again
        </button>
      `;

      document.body.appendChild(endScreen);
    };

    // 🏁 PLAYER WINS
    if (
      this.cars.player.x >= this.finishLine
    ) {
      win("You Win! 🏆");
      return;
    }

    // 🤖 AI WINS
    if (
      this.cars.ai1.x >= this.finishLine
    ) {
      win("AI 1 Wins! 🤖");
      return;
    }

    if (
      this.cars.ai2.x >= this.finishLine
    ) {
      win("AI 2 Wins! 🤖");
      return;
    }

    if (
      this.cars.ai3.x >= this.finishLine
    ) {
      win("AI 3 Wins! 🤖");
      return;
    }
  }
}
