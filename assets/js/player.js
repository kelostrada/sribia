import {field} from "./globals"
import {gameChannel} from "./channels/game_channel"

class Player {

  constructor() {
    this.id = window.user_id;

    this.position = {x: 0, y: 0};
    this.movingPosition = {x: 0, y: 0};
    this.direction = {x: 0, y: 0};
    // this.movingTime = 0;

    this.speed = 0;
    this.joined = false;
    this.sprite = null;
    this.moving = false;
    this.fps = 60;

    this.movingDistance = 1;

    gameChannel.on("player_move", payload => {
      console.log("Real position: ", payload);
      this.sprite.x = payload.x * field;
      this.sprite.y = payload.y * field;
      // this.movingPosition = {x: payload.x, y: payload.y}
      this.position = {x: payload.x, y: payload.y}
    });

    gameChannel.on("joined", payload => {
      this.movingDistance = field / Math.round(100000 / (2 * (payload.speed - 1) + 220)) * (1000 / this.fps);
      this.joined = true;
    });
  }

  update(direction, fps) {
    if (!this.joined) return;

    let input = (direction.x != 0 || direction.y != 0)

    if (!this.moving && input) {
      this.moving = true;

      this.movingPosition = {x: this.position.x + direction.x, y: this.position.y + direction.y};
      // this.movingTime = Date.now() + Math.round(100000 / (2 * (this.speed - 1) + 220));
      let animation = this.updateDirection(direction);
      gameChannel.push("move", {direction: animation});
    }

    if (input || !this.inDestination()) {
      if (input && this.inDestination()) {
        this.position.x = this.movingPosition.x;
        this.position.y = this.movingPosition.y;
        this.movingPosition.x += direction.x;
        this.movingPosition.y += direction.y;
        // this.movingTime = Date.now() + Math.round(100000 / (2 * (this.speed - 1) + 220));

        let animation = this.updateDirection(direction);

        console.log("Position: ", this.position);
        gameChannel.push("move", {direction: animation});
      }
      this.sprite.x += this.movingDistance * this.direction.x;
      this.sprite.y += this.movingDistance * this.direction.y;
    } else {
      this.position.x = this.movingPosition.x;
      this.position.y = this.movingPosition.y;

      if (this.moving) {
        console.log("Position: ", this.position);
        // gameChannel.push("move", {direction: "w"});
      }
      this.moving = false;
      this.sprite.animations.stop();
    }
  }

  updateDirection(direction) {
    this.direction = direction;
    let animation = "";
    if (direction.y > 0) animation += "s";
    if (direction.y < 0) animation += "n";
    if (direction.x > 0) animation += "e";
    if (direction.x < 0) animation += "w";

    this.sprite.animations.play(animation + '_move', 30, true);

    return animation;
  }

  // movingDistance() {
  //   // let now = Date.now();
  //   // let time = this.movingTime - now;
  //
  //   // let fullDistance = Math.sqrt(Math.pow(this.position.x * field - this.movingPosition.x * field, 2) + Math.pow(this.position.y * field - this.movingPosition.y * field, 2))
  //   // let distance = Math.sqrt(Math.pow(this.movingPosition.y * field - this.sprite.y, 2) + Math.pow(this.movingPosition.x * field - this.sprite.x, 2));
  //   // console.log(fullDistance);
  //   // console.log(distance);
  //
  //
  //   return field / Math.round(100000 / (2 * (this.speed - 1) + 220)) * (1000 / this.fps);
  //
  //   // s = v * t
  //   // t = 1000 / fps
  //   // v = distance / time
  //
  //   // return 1.45635673567;
  // }

  inDestination() {
    let reached = true;
    if (this.direction.y > 0) {
      reached = reached && this.movingPosition.y * field <= this.sprite.y;
    }
    if (this.direction.y < 0) {
      reached = reached && this.movingPosition.y * field >= this.sprite.y;
    }
    if (this.direction.x > 0) {
      reached = reached && this.movingPosition.x * field <= this.sprite.x;
    }
    if (this.direction.x < 0) {
      reached = reached && this.movingPosition.x * field >= this.sprite.x;
    }
    return reached;
  }

}

let player = new Player();

export {player};