export class CheckersGame {
  play() {
    window.setup = () => {
      createCanvas(200, 200);
    }

    window.draw = () => {
      fill(255, 255, 0);
      ellipse(10, 10, 10, 10);
    }
  }
}