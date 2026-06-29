import "./style.css";
import { SceneManager } from "./SceneManager";
import { MainMenu } from "./scenes/MainMenu";

const app = document.querySelector("#app");

if (!app) {
  console.error("❌ #app not found in index.html");
}

const sceneManager = new SceneManager(app);

sceneManager.changeScene(new MainMenu(sceneManager));