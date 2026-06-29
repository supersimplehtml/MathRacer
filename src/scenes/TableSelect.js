import { Race } from "./Race";

export class TableSelect {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.root = null;
    this.selected = [];
  }

  render(root) {
    this.root = root;

    const container = document.createElement("div");

    Object.assign(container.style, {
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(#0a0a0a,#111)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      boxSizing: "border-box",
      color: "white",
      fontFamily: "Arial, sans-serif",
      overflowY: "auto"
    });

    container.innerHTML = `
      <h1 style="
        font-size:clamp(30px,5vw,56px);
        margin:0;
        text-align:center;
      ">
        📚 Select Tables
      </h1>

      <p style="
        font-size:clamp(16px,2vw,22px);
        margin:12px 0 30px;
        text-align:center;
      ">
        Pick one or more multiplication tables
      </p>

      <div id="grid"></div>

      <button id="startBtn">
        🚀 Start Race
      </button>
    `;

    root.appendChild(container);

    const grid = container.querySelector("#grid");

    Object.assign(grid.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))",
      gap: "15px",
      width: "100%",
      maxWidth: "700px",
      marginBottom: "35px"
    });

    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement("button");

      btn.textContent = `${i} ×`;

      Object.assign(btn.style, {
        padding: "18px",
        fontSize: "clamp(18px,2vw,24px)",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        background: "#333",
        color: "white",
        transition: ".2s",
        minHeight: "70px",
        touchAction: "manipulation"
      });

      btn.onclick = () => {
        if (this.selected.includes(i)) {
          this.selected = this.selected.filter(x => x !== i);
          btn.style.background = "#333";
          btn.style.transform = "scale(1)";
        } else {
          this.selected.push(i);
          btn.style.background = "#00c96d";
          btn.style.transform = "scale(1.05)";
        }
      };

      grid.appendChild(btn);
    }

    const startBtn = container.querySelector("#startBtn");

    Object.assign(startBtn.style, {
      padding: "18px 40px",
      fontSize: "clamp(18px,2vw,26px)",
      border: "none",
      borderRadius: "16px",
      background: "#ff3b3b",
      color: "white",
      cursor: "pointer",
      minWidth: "220px",
      touchAction: "manipulation"
    });

    startBtn.onclick = () => {
      if (this.selected.length === 0) {
        alert("Select at least one table!");
        return;
      }

      this.sceneManager.changeScene(
        new Race(
          this.sceneManager,
          this.selected,
          this.sceneManager.selectedCar
        )
      );
    };
  }

  destroy() {
    this.root.innerHTML = "";
  }
}