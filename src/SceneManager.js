export class SceneManager {
  constructor(rootElement) {
    this.root = rootElement;
    this.currentScene = null;
  }

  changeScene(scene) {
    // Clean up old scene
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }

    // Clear the app
    this.root.innerHTML = "";

    // Switch scene
    this.currentScene = scene;

    // Render new scene
    this.currentScene.render(this.root);
  }
}