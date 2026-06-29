import { CarSelect } from "./CarSelect";

export class MainMenu {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.root = null;
    this.interval = null;
    this.container = null;
  }

  render(root) {
    this.root = root;

    this.container = document.createElement("div");
    this.container.className = "menu";

    this.container.innerHTML = `
      <div class="bg"></div>

      <div class="content">
        <h1 class="title">🏎️ MultiPlacer</h1>
        <p class="subtitle">Learn • Race • Win</p>

        <button id="playBtn" class="play-btn">
          ▶ PLAY
        </button>

        <div class="footer">Version 1.0</div>
      </div>
    `;

    root.appendChild(this.container);

    const btn = this.container.querySelector("#playBtn");

    // Better for desktop + mobile
    btn.addEventListener("click", () => {
      this.sceneManager.changeScene(
        new CarSelect(this.sceneManager)
      );
    });

    this.startBackgroundAnimation();
  }

  startBackgroundAnimation() {
    if (this.interval) clearInterval(this.interval);

    let hue = 0;

    const bg = this.container.querySelector(".bg");

    this.interval = setInterval(() => {
      hue = (hue + 0.6) % 360;

      bg.style.background = `
        radial-gradient(
          circle at center,
          hsl(${hue},80%,20%),
          #000 70%
        )
      `;
    }, 40);
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
