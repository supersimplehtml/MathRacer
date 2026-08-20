import { DifficultySelect } from "./DifficultySelect";

export class MainMenu {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.root = null;
    this.container = null;
    this.animationFrame = null;
  }

  render(root) {
    this.root = root;

    this.container = document.createElement("div");

    Object.assign(this.container.style, {
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      background: "#050505",
      color: "white",
      fontFamily: "Arial, sans-serif",
    });

    this.container.innerHTML = `
      <!-- BACKGROUND -->
      <div id="background"></div>

      <!-- GRID -->
      <div id="grid"></div>

      <!-- LIGHT EFFECT -->
      <div id="glow"></div>

      <!-- MAIN CONTENT -->
      <div id="content">

        <div id="badge">
          🏎️ MATH RACING
        </div>

        <h1 id="title">
          MULTI<span>PLACER</span>
        </h1>

        <p id="subtitle">
          Think Fast. Answer Faster. <strong>WIN THE RACE.</strong>
        </p>

        <button id="playBtn">
          <span class="playIcon">▶</span>
          PLAY
        </button>

        <div id="hint">
          🧠 Answer multiplication questions to accelerate
        </div>

        <div id="features">

          <div class="feature">
            <div class="featureIcon">⚡</div>
            <div>
              <strong>FAST</strong>
              <small>Answer quickly</small>
            </div>
          </div>

          <div class="feature">
            <div class="featureIcon">🏁</div>
            <div>
              <strong>RACE</strong>
              <small>Beat the AI</small>
            </div>
          </div>

          <div class="feature">
            <div class="featureIcon">🏆</div>
            <div>
              <strong>WIN</strong>
              <small>Master math</small>
            </div>
          </div>

        </div>

        <div id="footer">
          <span>MATHEMATICS × SPEED</span>
          <span>VERSION 1.0</span>
        </div>

      </div>
    `;

    root.appendChild(this.container);

    this.applyStyles();

    const playBtn =
      this.container.querySelector("#playBtn");

    playBtn.onclick = () => {
      this.sceneManager.changeScene(
        new DifficultySelect(this.sceneManager)
      );
    };

    this.startAnimation();
  }

  // =====================================================
  // STYLES
  // =====================================================

  applyStyles() {
    const style = document.createElement("style");

    style.innerHTML = `
      #background {
        position:absolute;
        inset:0;

        background:
          radial-gradient(
            circle at 50% 40%,
            rgba(0,180,255,.15),
            transparent 35%
          ),
          radial-gradient(
            circle at 20% 80%,
            rgba(0,255,150,.08),
            transparent 30%
          ),
          linear-gradient(
            135deg,
            #020509,
            #071018 50%,
            #020304
          );
      }

      #grid {
        position:absolute;
        inset:-50%;
        width:200%;
        height:200%;

        background-image:
          linear-gradient(
            rgba(0,180,255,.08) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(0,180,255,.08) 1px,
            transparent 1px
          );

        background-size:60px 60px;

        transform:
          perspective(500px)
          rotateX(60deg)
          translateY(10%);

        opacity:.45;
      }

      #glow {
        position:absolute;

        width:500px;
        height:500px;

        left:50%;
        top:45%;

        transform:
          translate(-50%,-50%);

        background:
          radial-gradient(
            circle,
            rgba(0,200,255,.13),
            transparent 65%
          );

        pointer-events:none;
      }

      #content {
        position:absolute;
        inset:0;

        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;

        text-align:center;

        padding:25px;
        box-sizing:border-box;
      }

      #badge {
        padding:8px 18px;

        border:1px solid rgba(0,200,255,.4);
        border-radius:999px;

        background:rgba(0,160,255,.08);

        color:#6ddcff;

        font-size:13px;
        font-weight:bold;

        letter-spacing:3px;

        margin-bottom:18px;

        box-shadow:
          0 0 20px rgba(0,180,255,.08);
      }

      #title {
        margin:0;

        font-size:
          clamp(52px,10vw,120px);

        line-height:.9;

        font-weight:1000;

        letter-spacing:-5px;

        color:white;

        text-shadow:
          0 8px 30px rgba(0,0,0,.7),
          0 0 30px rgba(0,190,255,.15);
      }

      #title span {
        color:#00cfff;

        text-shadow:
          0 0 10px rgba(0,210,255,.8),
          0 0 35px rgba(0,150,255,.45);
      }

      #subtitle {
        margin:22px 0 30px;

        color:#aaa;

        font-size:
          clamp(15px,2vw,21px);

        letter-spacing:1px;
      }

      #subtitle strong {
        color:white;
      }

      #playBtn {
        position:relative;

        padding:
          20px 65px;

        min-width:230px;

        border:none;
        border-radius:14px;

        background:
          linear-gradient(
            135deg,
            #00d9ff,
            #0077ff
          );

        color:white;

        font-size:25px;

        font-weight:900;

        letter-spacing:3px;

        cursor:pointer;

        box-shadow:
          0 8px 30px rgba(0,150,255,.3),
          inset 0 1px rgba(255,255,255,.35);

        transition:
          transform .2s,
          box-shadow .2s,
          filter .2s;

        overflow:hidden;
      }

      #playBtn::before {
        content:"";

        position:absolute;

        top:0;
        left:-100%;

        width:60%;
        height:100%;

        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.35),
            transparent
          );

        transform:skewX(-20deg);

        transition:left .5s;
      }

      #playBtn:hover {
        transform:translateY(-4px) scale(1.03);

        box-shadow:
          0 12px 40px rgba(0,170,255,.5),
          inset 0 1px rgba(255,255,255,.4);

        filter:brightness(1.1);
      }

      #playBtn:hover::before {
        left:130%;
      }

      #playBtn:active {
        transform:scale(.97);
      }

      .playIcon {
        margin-right:8px;
      }

      #hint {
        margin-top:16px;

        color:#777;

        font-size:13px;

        letter-spacing:.5px;
      }

      #features {
        display:flex;

        gap:15px;

        margin-top:40px;

        flex-wrap:wrap;

        justify-content:center;
      }

      .feature {
        display:flex;

        align-items:center;

        gap:10px;

        padding:
          10px 16px;

        min-width:130px;

        border-radius:12px;

        background:
          rgba(255,255,255,.035);

        border:
          1px solid rgba(255,255,255,.07);

        text-align:left;

        backdrop-filter:blur(8px);
      }

      .featureIcon {
        font-size:24px;
      }

      .feature strong {
        display:block;

        font-size:12px;

        letter-spacing:1px;
      }

      .feature small {
        display:block;

        color:#777;

        font-size:10px;

        margin-top:3px;
      }

      #footer {
        position:absolute;

        bottom:20px;

        left:0;

        width:100%;

        display:flex;

        justify-content:space-between;

        padding:0 25px;

        box-sizing:border-box;

        color:#444;

        font-size:10px;

        letter-spacing:2px;
      }

      @media(max-width:600px) {

        #title {
          letter-spacing:-3px;
        }

        #subtitle {
          margin-top:18px;
        }

        #features {
          margin-top:30px;
        }

        .feature {
          min-width:110px;
          padding:8px 12px;
        }

        #footer {
          font-size:8px;
        }
      }
    `;

    this.container.appendChild(style);
  }

  // =====================================================
  // ANIMATION
  // =====================================================

  startAnimation() {
    const grid =
      this.container.querySelector("#grid");

    let position = 0;

    const animate = () => {
      if (!this.container) return;

      position += 0.35;

      grid.style.transform = `
        perspective(500px)
        rotateX(60deg)
        translateY(${10 + position}%) 
      `;

      if (position > 30) {
        position = 0;
      }

      this.animationFrame =
        requestAnimationFrame(animate);
    };

    animate();
  }

  // =====================================================
  // CLEANUP
  // =====================================================

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.container) {
      this.container.remove();
      this.container = null;
    }

    this.root = null;
  }
}
