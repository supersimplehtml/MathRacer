import { TableSelect } from "./TableSelect";

export class DifficultySelect {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
  }

  render(root) {
    this.root = root;

    const container = document.createElement("div");

    Object.assign(container.style, {
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(180deg,#1b1b1b,#090909)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
      overflowY: "auto",
      fontFamily: "Arial, sans-serif",
    });

    const title = document.createElement("h1");
    title.innerText = "🏁 Select Difficulty";

    Object.assign(title.style, {
      marginBottom: "35px",
      fontSize: "clamp(28px,5vw,52px)",
      textAlign: "center",
    });

    container.appendChild(title);

    const list = document.createElement("div");

    Object.assign(list.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
      gap: "20px",
      width: "100%",
      maxWidth: "900px",
    });

    const difficulties = [
      {
        name: "🟢 Easy",
        difficulty: "easy",
        description: "Relaxed racing. Perfect for learning!",
      },
      {
        name: "🟡 Medium",
        difficulty: "medium",
        description: "A balanced challenge.",
      },
      {
        name: "🔴 Hard",
        difficulty: "hard",
        description: "The AI gets powerful speed boosts!",
      },
    ];

    difficulties.forEach((difficulty) => {
      const btn = document.createElement("button");

      btn.innerHTML = `
        <div style="
          font-size:1.5rem;
          font-weight:bold;
        ">
          ${difficulty.name}
        </div>

        <div style="
          opacity:.8;
          margin-top:10px;
          font-size:1rem;
        ">
          ${difficulty.description}
        </div>
      `;

      Object.assign(btn.style, {
        padding: "28px 22px",
        borderRadius: "18px",
        border: "none",
        cursor: "pointer",
        background: "#2d2d2d",
        color: "white",
        fontSize: "clamp(18px,2vw,24px)",
        transition: "0.2s",
        minHeight: "140px",
        touchAction: "manipulation",
      });

      btn.onmouseenter = () => {
        btn.style.transform = "scale(1.04)";
        btn.style.background = "#3e3e3e";
      };

      btn.onmouseleave = () => {
        btn.style.transform = "scale(1)";
        btn.style.background = "#2d2d2d";
      };

      btn.onclick = () => {
        this.sceneManager.difficulty = difficulty.difficulty;

        this.sceneManager.changeScene(
          new TableSelect(this.sceneManager)
        );
      };

      list.appendChild(btn);
    });

    container.appendChild(list);

    root.appendChild(container);
  }

  destroy() {
    this.root.innerHTML = "";
  }
}
