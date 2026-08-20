import { Finish } from "./Finish";
import { generateQuestion } from "../Engine/MathGenerator";

export class Race {
  constructor(sceneManager, tables, car) {
    this.sceneManager = sceneManager;
    this.root = null;

    this.tables = tables;

    // =====================================================
    // DIFFICULTY
    // =====================================================

    this.difficulty =
      this.sceneManager.difficulty || "easy";

    // =====================================================
    // SELECTED CAR
    // =====================================================

    this.car = car || {
      speed: 2.2,
      boost: 4.0,
    };

    // =====================================================
    // GAME STATE
    // =====================================================

    this.gameOver = false;

    // =====================================================
    // STATS
    // =====================================================

    this.stats = {
      startTime: null,
      correct: 0,
      wrong: 0,
    };

    // =====================================================
    // TRACK
    // =====================================================

    this.finishLine = 11000;

    // =====================================================
    // RESPONSIVE SIZING
    // =====================================================

    this.scale = Math.min(
      window.innerWidth / 1400,
      1
    );

    this.carWidth = Math.max(
      40,
      Math.min(
        65,
        window.innerWidth * 0.045
      )
    );

    this.carHeight =
      this.carWidth * 1.6;

    this.roadHeight = Math.max(
      220,
      Math.min(
        320,
        window.innerHeight * 0.32
      )
    );

    // =====================================================
    // LANE POSITIONS
    // =====================================================

    const lane =
      this.roadHeight / 4;

    // =====================================================
    // PLAYER STATS
    // =====================================================

    this.playerBaseSpeed =
      Number(this.car.speed) || 2.2;

    this.playerBoost =
      Number(this.car.boost) || 4.0;

    // =====================================================
    // DIFFICULTY SETTINGS
    // =====================================================

    this.difficultySettings = {
      easy: {
        aiBaseSpeeds: [1.75, 1.85, 1.95],

        aiBoostEnabled: false,

        aiBoostMinDelay: Infinity,
        aiBoostMaxDelay: Infinity,

        aiBoostAmount: 0,

        aiBoostDurationMin: 0,
        aiBoostDurationMax: 0,

        wrongAnswerSlowdown: false,
      },

      medium: {
        aiBaseSpeeds: [1.95, 2.05, 2.15],

        aiBoostEnabled: true,

        aiBoostMinDelay: 7000,
        aiBoostMaxDelay: 10000,

        // Small AI boost.
        aiBoostAmount: 0.65,

        aiBoostDurationMin: 900,
        aiBoostDurationMax: 1400,

        wrongAnswerSlowdown: true,
      },

      hard: {
        aiBaseSpeeds: [2.15, 2.25, 2.35],

        aiBoostEnabled: true,

        aiBoostMinDelay: 4000,
        aiBoostMaxDelay: 6000,

        // Large, but controlled.
        aiBoostAmount: 1.15,

        aiBoostDurationMin: 1300,
        aiBoostDurationMax: 2000,

        wrongAnswerSlowdown: true,
      },
    };

    this.settings =
      this.difficultySettings[
        this.difficulty
      ] ||
      this.difficultySettings.easy;

    // =====================================================
    // AI STATS
    // =====================================================

    this.aiStats = {
      ai1: {
        baseSpeed:
          this.settings.aiBaseSpeeds[0],
      },

      ai2: {
        baseSpeed:
          this.settings.aiBaseSpeeds[1],
      },

      ai3: {
        baseSpeed:
          this.settings.aiBaseSpeeds[2],
      },
    };

    // =====================================================
    // CARS
    // =====================================================

    this.cars = {
      player: {
        x: 0,
        y: lane * 1.5,
        speed:
          this.playerBaseSpeed,
      },

      ai1: {
        x: 0,
        y: lane * 0.5,
        speed:
          this.aiStats.ai1.baseSpeed,
      },

      ai2: {
        x: 0,
        y: lane * 2.5,
        speed:
          this.aiStats.ai2.baseSpeed,
      },

      ai3: {
        x: 0,
        y: lane * 3.5,
        speed:
          this.aiStats.ai3.baseSpeed,
      },
    };

    // =====================================================
    // AI BOOST SYSTEM
    // =====================================================

    this.activeAIBoost = null;
    this.aiBoostUntil = 0;

    if (
      this.settings.aiBoostEnabled
    ) {
      this.aiNextBoost =
        Date.now() +
        this.randomBetween(
          this.settings.aiBoostMinDelay,
          this.settings.aiBoostMaxDelay
        );
    } else {
      this.aiNextBoost =
        Infinity;
    }

    // =====================================================
    // PLAYER BOOST SYSTEM
    // =====================================================

    this.playerBoostUntil = 0;

    // =====================================================
    // QUESTIONS
    // =====================================================

    this.question = null;
    this.questionStartTime = null;

    // =====================================================
    // BOOST MESSAGE
    // =====================================================

    this.boostMessageTimer = null;
  }

  // =====================================================
  // RANDOM NUMBER
  // =====================================================

  randomBetween(min, max) {
    return (
      min +
      Math.random() *
        (max - min)
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  render(root) {
    this.root = root;

    const container =
      document.createElement("div");

    Object.assign(
      container.style,
      {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
        fontFamily: "Arial",
        position: "relative",
      }
    );

    container.innerHTML = `
      <div id="world" style="
        position:absolute;
        top:0;
        left:0;
        width:12000px;
        height:100vh;
        background:
          linear-gradient(
            #3cb043,
            #2e8b57
          );
      ">

        <div id="track" style="
          position:absolute;
          top:50%;
          transform:translateY(-50%);
          left:0;
          width:12000px;
          height:${this.roadHeight}px;
          background:#2c2c2c;
          border-top:5px solid white;
          border-bottom:5px solid white;
        ">

          <div style="
            position:absolute;
            top:${this.roadHeight * 0.25}px;
            width:100%;
            height:2px;
            background:
              repeating-linear-gradient(
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
            background:
              repeating-linear-gradient(
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
            background:
              repeating-linear-gradient(
                90deg,
                white,
                white 20px,
                transparent 20px,
                transparent 40px
              );
          "></div>

          <img
            id="player"
            class="car"
            src="/playercar2.png"
          >

          <img
            id="ai1"
            class="car"
            src="/aicar.png"
          >

          <img
            id="ai2"
            class="car"
            src="/aicar.png"
          >

          <img
            id="ai3"
            class="car"
            src="/aicar.png"
          >

          <div id="finish" style="
            position:absolute;
            top:50%;
            transform:translateY(-50%);
            left:11000px;
            width:${Math.max(
              50,
              this.scale * 80
            )}px;
            height:${this.roadHeight}px;
            font-size:${Math.max(
              30,
              this.scale * 40
            )}px;
            background:
              repeating-linear-gradient(
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

      <div style="
        position:absolute;
        bottom:0;
        left:0;
        width:100%;
        background:
          rgba(0,0,0,0.92);
        color:white;
        padding:
          clamp(12px,3vw,30px);
        box-sizing:border-box;
        text-align:center;
      ">

        <h1 id="qbox" style="
          margin:
            0 0 25px 0;
          font-size:
            clamp(28px,5vw,60px);
          font-weight:900;
          letter-spacing:2px;
          color:#FFD700;
          text-shadow:
            0 0 10px #ffae00,
            0 0 20px #ffae00,
            3px 3px 0 #000;
        "></h1>

        <div id="options" style="
          display:flex;
          justify-content:center;
          gap:
            clamp(10px,2vw,20px);
          flex-wrap:wrap;
        "></div>

      </div>

      <div id="boostMessage" style="
        position:absolute;
        top:12%;
        left:50%;
        transform:
          translateX(-50%);
        font-size:
          clamp(24px,4vw,50px);
        font-weight:900;
        color:#ffdd00;
        text-shadow:
          0 0 10px #ff6600,
          0 0 20px #ff0000,
          3px 3px 0 #000;
        opacity:0;
        pointer-events:none;
        z-index:500;
        transition:
          opacity 0.2s;
        text-align:center;
      "></div>
    `;

    root.appendChild(
      container
    );

    // =====================================================
    // ELEMENTS
    // =====================================================

    this.el = {
      world:
        container.querySelector(
          "#world"
        ),

      player:
        container.querySelector(
          "#player"
        ),

      ai1:
        container.querySelector(
          "#ai1"
        ),

      ai2:
        container.querySelector(
          "#ai2"
        ),

      ai3:
        container.querySelector(
          "#ai3"
        ),

      qbox:
        container.querySelector(
          "#qbox"
        ),

      options:
        container.querySelector(
          "#options"
        ),

      boostMessage:
        container.querySelector(
          "#boostMessage"
        ),
    };

    // =====================================================
    // CAR STYLING
    // =====================================================

    [
      this.el.player,
      this.el.ai1,
      this.el.ai2,
      this.el.ai3,
    ].forEach((car) => {
      car.style.position =
        "absolute";

      car.style.width =
        this.carWidth + "px";

      car.style.height =
        this.carHeight + "px";

      car.style.objectFit =
        "contain";

      car.style.transform =
        "translate(-50%, -50%) rotate(90deg)";

      car.style.transformOrigin =
        "center center";

      car.style.userSelect =
        "none";

      car.draggable = false;
    });

    // =====================================================
    // FIRST QUESTION
    // =====================================================

    this.nextQuestion();

    // =====================================================
    // COUNTDOWN
    // =====================================================

    this.startCountdown(() => {
      this.stats.startTime =
        Date.now();

      if (
        this.settings.aiBoostEnabled
      ) {
        this.aiNextBoost =
          Date.now() +
          this.randomBetween(
            this.settings.aiBoostMinDelay,
            this.settings.aiBoostMaxDelay
          );
      } else {
        this.aiNextBoost =
          Infinity;
      }

      this.loop();
    });

    // =====================================================
    // RESIZE
    // =====================================================

    this.resizeHandler = () => {
      this.scale =
        Math.min(
          window.innerWidth / 1400,
          1
        );

      this.carWidth =
        Math.max(
          40,
          Math.min(
            65,
            window.innerWidth *
              0.045
          )
        );

      this.carHeight =
        this.carWidth * 1.6;

      [
        this.el.player,
        this.el.ai1,
        this.el.ai2,
        this.el.ai3,
      ].forEach((car) => {
        car.style.width =
          this.carWidth + "px";

        car.style.height =
          this.carHeight + "px";
      });
    };

    window.addEventListener(
      "resize",
      this.resizeHandler
    );
  }

  // =====================================================
  // COUNTDOWN
  // =====================================================

  startCountdown(callback) {
    const overlay =
      document.createElement(
        "div"
      );

    Object.assign(
      overlay.style,
      {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize:
          "clamp(70px,18vw,140px)",
        fontWeight: "900",
        color: "white",
        background:
          "rgba(0,0,0,0.6)",
        zIndex: "999",
      }
    );

    document.body.appendChild(
      overlay
    );

    let count = 3;

    const interval =
      setInterval(() => {
        if (count > 0) {
          overlay.innerText =
            count;
        } else if (count === 0) {
          overlay.innerText =
            "GO!";
        } else {
          clearInterval(
            interval
          );

          overlay.remove();

          callback();
        }

        count--;
      }, 1000);

    this.countdownInterval =
      interval;
  }

  // =====================================================
  // GAME LOOP
  // =====================================================

  loop() {
    const tick = () => {
      this.update();

      if (!this.gameOver) {
        this.animationFrame =
          requestAnimationFrame(
            tick
          );
      }
    };

    tick();
  }

  // =====================================================
  // UPDATE
  // =====================================================

  update() {
    if (this.gameOver) {
      return;
    }

    const now = Date.now();

    // Move cars.

    this.move(
      this.cars.player
    );

    this.move(
      this.cars.ai1
    );

    this.move(
      this.cars.ai2
    );

    this.move(
      this.cars.ai3
    );

    // ===================================================
    // START AI BOOST
    // ===================================================

    if (
      this.settings.aiBoostEnabled &&
      !this.activeAIBoost &&
      now >= this.aiNextBoost
    ) {
      this.startAIBoost(now);
    }

    // ===================================================
    // END AI BOOST
    // ===================================================

    if (
      this.activeAIBoost &&
      now >= this.aiBoostUntil
    ) {
      const aiName =
        this.activeAIBoost;

      this.cars[aiName].speed =
        this.aiStats[
          aiName
        ].baseSpeed;

      this.activeAIBoost =
        null;

      this.aiBoostUntil =
        0;

      this.hideBoostMessage();

      this.aiNextBoost =
        now +
        this.randomBetween(
          this.settings.aiBoostMinDelay,
          this.settings.aiBoostMaxDelay
        );
    }

    // ===================================================
    // END PLAYER BOOST
    // ===================================================

    if (
      this.playerBoostUntil &&
      now >=
        this.playerBoostUntil
    ) {
      this.cars.player.speed =
        this.playerBaseSpeed;

      this.playerBoostUntil =
        0;
    }

    // ===================================================
    // RENDER
    // ===================================================

    this.renderPositions();

    this.renderCamera();

    // ===================================================
    // WIN CHECK
    // ===================================================

    this.checkWin();
  }

  // =====================================================
  // AI BOOST
  // =====================================================

  startAIBoost(now) {
    const aiNames = [
      "ai1",
      "ai2",
      "ai3",
    ];

    const chosenAI =
      aiNames[
        Math.floor(
          Math.random() *
            aiNames.length
        )
      ];

    this.activeAIBoost =
      chosenAI;

    const baseSpeed =
      this.aiStats[
        chosenAI
      ].baseSpeed;

    const boostSpeed =
      baseSpeed +
      this.settings.aiBoostAmount;

    const duration =
      this.randomBetween(
        this.settings
          .aiBoostDurationMin,
        this.settings
          .aiBoostDurationMax
      );

    this.cars[chosenAI].speed =
      boostSpeed;

    this.aiBoostUntil =
      now + duration;

    this.showBoostMessage(
      `⚠️ ${chosenAI.toUpperCase()} BOOST!`
    );
  }

  // =====================================================
  // BOOST MESSAGE
  // =====================================================

  showBoostMessage(text) {
    if (
      !this.el.boostMessage
    ) {
      return;
    }

    this.el.boostMessage.innerText =
      text;

    this.el.boostMessage.style.opacity =
      "1";

    clearTimeout(
      this.boostMessageTimer
    );

    this.boostMessageTimer =
      setTimeout(() => {
        this.hideBoostMessage();
      }, 1200);
  }

  hideBoostMessage() {
    if (
      !this.el.boostMessage
    ) {
      return;
    }

    this.el.boostMessage.style.opacity =
      "0";
  }

  // =====================================================
  // MOVE
  // =====================================================

  move(car) {
    car.x += car.speed;
  }

  // =====================================================
  // CAMERA
  // =====================================================

  renderCamera() {
    const cameraOffset =
      window.innerWidth *
      0.25;

    const cameraX =
      this.cars.player.x -
      cameraOffset;

    this.el.world.style.transform =
      `translateX(${-cameraX}px)`;
  }

  // =====================================================
  // POSITIONING
  // =====================================================

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

  // =====================================================
  // QUESTIONS
  // =====================================================

  nextQuestion() {
    this.question =
      generateQuestion(
        this.tables
      );

    this.el.qbox.innerText =
      `${this.question.question} = ?`;

    this.el.options.innerHTML =
      "";

    this.question.options.forEach(
      (opt) => {
        const btn =
          document.createElement(
            "button"
          );

        btn.innerText = opt;

        Object.assign(
          btn.style,
          {
            width:
              "clamp(80px,18vw,150px)",
            height:
              "clamp(50px,8vw,75px)",
            margin: "8px",
            fontSize:
              "clamp(20px,3vw,30px)",
            fontWeight: "bold",
            border: "none",
            borderRadius: "15px",
            background: "#2196F3",
            color: "white",
            cursor: "pointer",
            transition:
              "0.2s",
          }
        );

        btn.onmouseenter =
          () => {
            btn.style.transform =
              "scale(1.08)";
          };

        btn.onmouseleave =
          () => {
            btn.style.transform =
              "scale(1)";
          };

        btn.onclick = () =>
          this.answer(opt);

        this.el.options.appendChild(
          btn
        );
      }
    );

    this.questionStartTime =
      Date.now();
  }

  // =====================================================
  // ANSWER
  // =====================================================

  answer(val) {
    if (this.gameOver) {
      return;
    }

    const buttons =
      this.el.options.querySelectorAll(
        "button"
      );

    buttons.forEach(
      (button) => {
        button.disabled = true;
      }
    );

    const reactionTime =
      (Date.now() -
        this.questionStartTime) /
      1000;

    // ===================================================
    // CORRECT
    // ===================================================

    if (
      val ===
      this.question.correct
    ) {
      this.stats.correct++;

      let boostAmount;
      let duration;

      // EASY
      if (
        this.difficulty ===
        "easy"
      ) {
        boostAmount = 0.85;
        duration = 850;
      }

      // MEDIUM
      else if (
        this.difficulty ===
        "medium"
      ) {
        if (
          reactionTime <= 1
        ) {
          boostAmount = 1.0;
          duration = 850;
        } else if (
          reactionTime <= 2
        ) {
          boostAmount = 0.8;
          duration = 750;
        } else if (
          reactionTime <= 3
        ) {
          boostAmount = 0.6;
          duration = 650;
        } else {
          boostAmount = 0.4;
          duration = 550;
        }
      }

      // HARD
      else {
        if (
          reactionTime <=
          0.75
        ) {
          boostAmount = 1.35;
          duration = 950;
        } else if (
          reactionTime <=
          1.25
        ) {
          boostAmount = 1.15;
          duration = 850;
        } else if (
          reactionTime <= 2
        ) {
          boostAmount = 0.9;
          duration = 750;
        } else if (
          reactionTime <= 3
        ) {
          boostAmount = 0.65;
          duration = 650;
        } else {
          boostAmount = 0.4;
          duration = 500;
        }
      }

      this.cars.player.speed =
        this.playerBaseSpeed +
        boostAmount;

      this.playerBoostUntil =
        Date.now() + duration;

      this.showBoostMessage(
        `⚡ +${boostAmount.toFixed(
          1
        )} SPEED`
      );
    }

    // ===================================================
    // WRONG
    // ===================================================

    else {
      this.stats.wrong++;

      // Easy does NOT slow down.

      if (
        this.difficulty ===
        "easy"
      ) {
        this.showBoostMessage(
          "❌ WRONG!"
        );
      }

      // Medium + Hard slow down.

      else {
        this.cars.player.speed =
          Math.max(
            1.25,
            this.playerBaseSpeed -
              0.55
          );

        this.playerBoostUntil =
          Date.now() + 650;

        this.showBoostMessage(
          "❌ WRONG! - SPEED"
        );
      }
    }

    this.nextQuestion();
  }

  // =====================================================
  // WIN CHECK
  // =====================================================

  checkWin() {
    if (this.gameOver) {
      return;
    }

    let winner = null;

    // Player

    if (
      this.cars.player.x >=
      this.finishLine
    ) {
      winner = "player";
    }

    // AI 1

    else if (
      this.cars.ai1.x >=
      this.finishLine
    ) {
      winner = "ai1";
    }

    // AI 2

    else if (
      this.cars.ai2.x >=
      this.finishLine
    ) {
      winner = "ai2";
    }

    // AI 3

    else if (
      this.cars.ai3.x >=
      this.finishLine
    ) {
      winner = "ai3";
    }

    if (!winner) {
      return;
    }

    // ===================================================
    // GAME OVER
    // ===================================================

    this.gameOver = true;

    if (
      this.animationFrame
    ) {
      cancelAnimationFrame(
        this.animationFrame
      );
    }

    // ===================================================
    // RESULTS
    // ===================================================

    const timeTaken = (
      (Date.now() -
        this.stats.startTime) /
      1000
    ).toFixed(1);

    const total =
      this.stats.correct +
      this.stats.wrong;

    const accuracy =
      total > 0
        ? Math.round(
            (this.stats.correct /
              total) *
              100
          )
        : 0;

    let resultText;

    if (
      winner === "player"
    ) {
      resultText =
        "YOU WIN";
    } else if (
      winner === "ai1"
    ) {
      resultText =
        "AI 1 WINS";
    } else if (
      winner === "ai2"
    ) {
      resultText =
        "AI 2 WINS";
    } else {
      resultText =
        "AI 3 WINS";
    }

    // ===================================================
    // SEND RESULTS TO FINISH
    // ===================================================

    this.sceneManager.changeScene(
      new Finish(
        this.sceneManager,
        {
          result: resultText,
          winner: winner,
          time: timeTaken,
          correct:
            this.stats.correct,
          wrong:
            this.stats.wrong,
          accuracy:
            accuracy,
          difficulty:
            this.difficulty,
          tables:
            this.tables,
          car:
            this.car,
        }
      )
    );
  }

  // =====================================================
  // DESTROY
  // =====================================================

  destroy() {
    this.gameOver = true;

    if (
      this.animationFrame
    ) {
      cancelAnimationFrame(
        this.animationFrame
      );
    }

    if (
      this.countdownInterval
    ) {
      clearInterval(
        this.countdownInterval
      );
    }

    clearTimeout(
      this.boostMessageTimer
    );

    if (
      this.resizeHandler
    ) {
      window.removeEventListener(
        "resize",
        this.resizeHandler
      );
    }

    if (this.root) {
      this.root.innerHTML = "";
    }
  }
}
