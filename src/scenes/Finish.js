import { MainMenu } from "./MainMenu";

export class Finish {
  constructor(sceneManager, result) {
    this.sceneManager = sceneManager;
    this.result = result;
    this.root = null;
  }

  render(root) {
    this.root = root;

    const container = document.createElement("div");

    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.background = "#0a0a0a";
    container.style.color = "white";
    container.style.fontFamily = "Arial";

    container.innerHTML = `
      <h1 style="font-size:50px; margin-bottom:10px;">
        🏁 Race Finished
      </h1>

      <h2 style="margin-bottom:30px; color:#00d4ff;">
        ${this.result}
      </h2>

      <div style="display:flex; gap:15px;">
        <button id="retryBtn" style="
          padding:15px 30px;
          font-size:18px;
          border:none;
          border-radius:10px;
          cursor:pointer;
          background:#00ff88;
        ">
          🔁 Play Again
        </button>

        <button id="menuBtn" style="
          padding:15px 30px;
          font-size:18px;
          border:none;
          border-radius:10px;
          cursor:pointer;
          background:#ff3b3b;
          color:white;
        ">
          🏠 Main Menu
        </button>
      </div>
    `;

    root.appendChild(container);

    // -------------------------
    // BUTTON ACTIONS
    // -------------------------

    container.querySelector("#retryBtn").onclick = () => {
      this.sceneManager.changeScene(
        new MainMenu(this.sceneManager)
      );
    };

    container.querySelector("#menuBtn").onclick = () => {
      this.sceneManager.changeScene(
        new MainMenu(this.sceneManager)
      );
    };
  }

  destroy() {
    this.root.innerHTML = "";
  }
}