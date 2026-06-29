import { TableSelect } from "./TableSelect";
import { cars } from "../data/car";

export class CarSelect {
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
    title.innerText = "🚗 Select Your Car";

    title.style.marginBottom = "30px";
    title.style.fontSize = "clamp(28px,5vw,52px)";
    title.style.textAlign = "center";

    container.appendChild(title);

    const list = document.createElement("div");

    Object.assign(list.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
      gap: "20px",
      width: "100%",
      maxWidth: "900px",
    });

    cars.forEach((car) => {
      const btn = document.createElement("button");

      btn.innerHTML = `
        <div style="font-size:1.4rem;font-weight:bold;">
            ${car.name}
        </div>

        <div style="opacity:.8;margin-top:8px;">
            Speed: ${car.speed}
        </div>
      `;

      Object.assign(btn.style, {
        padding: "22px",
        borderRadius: "18px",
        border: "none",
        cursor: "pointer",
        background: "#2d2d2d",
        color: "white",
        fontSize: "clamp(18px,2vw,24px)",
        transition: "0.2s",
        minHeight: "120px",
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
        this.sceneManager.selectedCar = car;

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