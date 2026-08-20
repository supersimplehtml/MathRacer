import { MainMenu } from "./MainMenu";
import { DifficultySelect } from "./DifficultySelect";

export class Finish {
  constructor(sceneManager, results) {
    this.sceneManager = sceneManager;
    this.results = results;
    this.root = null;
  }

  render(root) {
    this.root = root;

    const container =
      document.createElement("div");

    Object.assign(
      container.style,
      {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `
          radial-gradient(
            circle at 50% 35%,
            #18252f 0%,
            #0b1116 45%,
            #05070a 100%
          )
        `,
        color: "white",
        fontFamily:
          "Arial, sans-serif",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
      }
    );

    // =====================================================
    // BACKGROUND
    // =====================================================

    const background =
      document.createElement(
        "div"
      );

    Object.assign(
      background.style,
      {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        opacity: "0.12",
        background: `
          repeating-linear-gradient(
            135deg,
            transparent 0px,
            transparent 80px,
            #ffffff 81px,
            transparent 82px
          )
        `,
        transform:
          "scale(1.5)",
      }
    );

    container.appendChild(
      background
    );

    // =====================================================
    // CARD
    // =====================================================

    const card =
      document.createElement(
        "div"
      );

    Object.assign(
      card.style,
      {
        width:
          "min(92vw, 650px)",
        maxHeight: "90vh",
        overflowY: "auto",
        padding:
          "clamp(28px,6vw,55px)",
        boxSizing: "border-box",
        textAlign: "center",
        borderRadius: "28px",
        background:
          "rgba(15,20,25,0.90)",
        border:
          "1px solid rgba(255,255,255,0.12)",
        boxShadow: `
          0 30px 80px
          rgba(0,0,0,0.65),
          inset 0 1px 0
          rgba(255,255,255,0.08)
        `,
        backdropFilter:
          "blur(14px)",
        position: "relative",
        zIndex: "2",
        animation:
          "finishCardIn 0.6s ease-out",
      }
    );

    // =====================================================
    // ICON
    // =====================================================

    const icon =
      document.createElement(
        "div"
      );

    icon.innerText =
      this.results.winner ===
      "player"
        ? "🏆"
        : "🏁";

    Object.assign(
      icon.style,
      {
        fontSize:
          "clamp(55px,10vw,85px)",
        marginBottom: "8px",
        filter:
          "drop-shadow(0 8px 15px rgba(0,0,0,0.5))",
        animation:
          "finishIcon 1s ease-out",
      }
    );

    card.appendChild(icon);

    // =====================================================
    // TITLE
    // =====================================================

    const title =
      document.createElement(
        "h1"
      );

    title.innerText =
      "RACE FINISHED";

    Object.assign(
      title.style,
      {
        margin: "0",
        fontSize:
          "clamp(28px,6vw,52px)",
        fontWeight: "900",
        letterSpacing: "4px",
        lineHeight: "1.1",
      }
    );

    card.appendChild(title);

    // =====================================================
    // RESULT
    // =====================================================

    const result =
      document.createElement(
        "div"
      );

    result.innerText =
      this.results.result;

    const playerWon =
      this.results.winner ===
      "player";

    Object.assign(
      result.style,
      {
        marginTop: "15px",
        marginBottom: "28px",
        fontSize:
          "clamp(22px,4vw,34px)",
        fontWeight: "800",
        letterSpacing: "1px",
        color: playerWon
          ? "#00ff9d"
          : "#ff5252",
        textShadow:
          playerWon
            ? "0 0 18px rgba(0,255,157,0.35)"
            : "0 0 18px rgba(255,82,82,0.35)",
      }
    );

    card.appendChild(
      result
    );

    // =====================================================
    // STATS GRID
    // =====================================================

    const statsGrid =
      document.createElement(
        "div"
      );

    Object.assign(
      statsGrid.style,
      {
        display: "grid",
        gridTemplateColumns:
          "repeat(2, 1fr)",
        gap: "12px",
        marginBottom:
          "18px",
      }
    );

    const createStat = (
      label,
      value
    ) => {
      const box =
        document.createElement(
          "div"
        );

      Object.assign(
        box.style,
        {
          padding:
            "18px 12px",
          borderRadius:
            "15px",
          background:
            "rgba(255,255,255,0.045)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }
      );

      box.innerHTML = `
        <div style="
          font-size:11px;
          font-weight:800;
          letter-spacing:2px;
          color:rgba(255,255,255,0.42);
          margin-bottom:8px;
        ">
          ${label}
        </div>

        <div style="
          font-size:clamp(22px,4vw,30px);
          font-weight:900;
          color:white;
        ">
          ${value}
        </div>
      `;

      statsGrid.appendChild(
        box
      );
    };

    createStat(
      "TIME",
      `${this.results.time}s`
    );

    createStat(
      "ACCURACY",
      `${this.results.accuracy}%`
    );

    createStat(
      "CORRECT",
      this.results.correct
    );

    createStat(
      "WRONG",
      this.results.wrong
    );

    card.appendChild(
      statsGrid
    );

    // =====================================================
    // DIFFICULTY
    // =====================================================

    const difficulty =
      document.createElement(
        "div"
      );

    const difficultyNames = {
      easy: "🟢 EASY",
      medium: "🟡 MEDIUM",
      hard: "🔴 HARD",
    };

    difficulty.innerText =
      difficultyNames[
        this.results.difficulty
      ] ||
      "UNKNOWN";

    Object.assign(
      difficulty.style,
      {
        display:
          "inline-block",
        padding:
          "8px 16px",
        borderRadius:
          "999px",
        background:
          "rgba(255,255,255,0.06)",
        border:
          "1px solid rgba(255,255,255,0.1)",
        color:
          "rgba(255,255,255,0.65)",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "2px",
        marginBottom:
          "28px",
      }
    );

    card.appendChild(
      difficulty
    );

    // =====================================================
    // DIVIDER
    // =====================================================

    const divider =
      document.createElement(
        "div"
      );

    Object.assign(
      divider.style,
      {
        width: "70%",
        height: "1px",
        margin:
          "0 auto 25px",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      }
    );

    card.appendChild(
      divider
    );

    // =====================================================
    // BUTTON CONTAINER
    // =====================================================

    const buttons =
      document.createElement(
        "div"
      );

    Object.assign(
      buttons.style,
      {
        display: "flex",
        flexDirection:
          "column",
        gap: "12px",
        width: "100%",
        maxWidth: "380px",
        margin:
          "0 auto",
      }
    );

    // =====================================================
    // PLAY AGAIN
    // =====================================================

    const retryBtn =
      document.createElement(
        "button"
      );

    retryBtn.innerHTML = `
      <span style="
        font-size:21px;
      ">↻</span>

      <span>
        PLAY AGAIN
      </span>
    `;

    Object.assign(
      retryBtn.style,
      {
        width: "100%",
        padding:
          "17px 25px",
        border: "none",
        borderRadius:
          "14px",
        cursor: "pointer",
        background:
          "linear-gradient(135deg,#00f5a0,#00c878)",
        color: "#04130d",
        fontSize: "17px",
        fontWeight: "900",
        letterSpacing: "1px",
        boxShadow:
          "0 8px 25px rgba(0,200,120,0.22)",
        transition:
          "transform .2s, box-shadow .2s",
        display: "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        gap: "10px",
      }
    );

    // =====================================================
    // MAIN MENU
    // =====================================================

    const menuBtn =
      document.createElement(
        "button"
      );

    menuBtn.innerHTML = `
      <span style="
        font-size:18px;
      ">⌂</span>

      <span>
        MAIN MENU
      </span>
    `;

    Object.assign(
      menuBtn.style,
      {
        width: "100%",
        padding:
          "16px 25px",
        border:
          "1px solid rgba(255,255,255,0.15)",
        borderRadius:
          "14px",
        cursor: "pointer",
        background:
          "rgba(255,255,255,0.05)",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        letterSpacing: "1px",
        transition:
          "transform .2s, background .2s",
        display: "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        gap: "10px",
      }
    );

    buttons.appendChild(
      retryBtn
    );

    buttons.appendChild(
      menuBtn
    );

    card.appendChild(
      buttons
    );

    // =====================================================
    // FOOTER
    // =====================================================

    const footer =
      document.createElement(
        "div"
      );

    footer.innerText =
      "MULTIPLACER • RACE RESULTS";

    Object.assign(
      footer.style,
      {
        marginTop: "25px",
        fontSize: "10px",
        letterSpacing: "3px",
        color:
          "rgba(255,255,255,0.25)",
        fontWeight: "700",
      }
    );

    card.appendChild(
      footer
    );

    container.appendChild(
      card
    );

    // =====================================================
    // ANIMATIONS
    // =====================================================

    const style =
      document.createElement(
        "style"
      );

    style.innerHTML = `
      @keyframes finishCardIn {
        from {
          opacity: 0;
          transform:
            translateY(30px)
            scale(.96);
        }

        to {
          opacity: 1;
          transform:
            translateY(0)
            scale(1);
        }
      }

      @keyframes finishIcon {
        0% {
          opacity: 0;
          transform:
            scale(.5)
            rotate(-15deg);
        }

        60% {
          transform:
            scale(1.12)
            rotate(4deg);
        }

        100% {
          opacity: 1;
          transform:
            scale(1)
            rotate(0);
        }
      }

      button:hover {
        transform:
          translateY(-2px);
      }

      button:active {
        transform:
          translateY(1px);
      }

      #retryBtn:hover {
        box-shadow:
          0 12px 30px
          rgba(0,200,120,0.35);
      }

      #menuBtn:hover {
        background:
          rgba(255,255,255,0.1);
      }

      @media(max-width:500px) {
        .stats-grid {
          grid-template-columns:
            repeat(2,1fr);
        }
      }
    `;

    container.appendChild(
      style
    );

    root.appendChild(
      container
    );

    // =====================================================
    // BUTTON ACTIONS
    // =====================================================

    retryBtn.onclick = () => {
      // Keep the same difficulty,
      // but let the player choose
      // tables/car again.

      this.sceneManager.changeScene(
        new DifficultySelect(
          this.sceneManager
        )
      );
    };

    menuBtn.onclick = () => {
      this.sceneManager.changeScene(
        new MainMenu(
          this.sceneManager
        )
      );
    };
  }

  // =====================================================
  // DESTROY
  // =====================================================

  destroy() {
    if (this.root) {
      this.root.innerHTML = "";
    }
  }
}
