const canvas = document.querySelector("#game");
const c = canvas.getContext("2d");
const scoreEl = document.querySelector("#scoreEl");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position, width, height }) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  draw() {
    c.fillStyle = "whitesmoke";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "yellow";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class koulMan {
  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollision = [];
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Star {
  static width = 40;
  static height = 40;
  constructor({ position }) {
    this.position = position;
    this.width = this.height = 5;
    this.radius = 5;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "yellow";
    c.fill();
    c.closePath();
  }
}

const boundaries = [];
const stars = [];
const ghosts = [
  new koulMan({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: 2,
      y: 0,
    },
  }),
];
console.log(ghosts);
const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});
const keys = {
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let lastkey = "";
let score = 0;

map.forEach((row, index) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index,
            },
            width: 40,
            height: 2,
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index,
            },
            width: 2,
            height: 40,
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index,
            },
            width: 2,
            height: 40,
          }),
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index,
            },
            width: 40,
            height: 2,
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j - Boundary.width,
              y: Boundary.height * index,
            },
            width: 40,
            height: 2,
          }),
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index,
            },
            width: 2,
            height: 40,
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j - Boundary.width,
              y: Boundary.height * index,
            },
            width: 40,
            height: 2,
          }),
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index - Boundary.height,
            },
            width: 2,
            height: 40,
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index,
            },
            width: 40,
            height: 2,
          }),
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * index - Boundary.height,
            },
            width: 2,
            height: 40,
          })
        );
        break;
      case "star":
        stars.push(
          new Star({
            position: {
              x: Star.width * j - Star.width / 2,
              y: Star.height * index - Star.height / 2,
            },
          })
        );
        break;

      default:
        break;
    }
  });
});

console.log(stars, "stars");

function packmanCollisionDetection({ circle, rectangle }) {
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width
  );
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.up.pressed && lastkey === "z") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        packmanCollisionDetection({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.down.pressed && lastkey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        packmanCollisionDetection({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.right.pressed && lastkey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        packmanCollisionDetection({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  } else if (keys.left.pressed && lastkey === "q") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        packmanCollisionDetection({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  }

  //deleting stars when eaten koul man
  stars.forEach((star, index) => {
    star.draw();
    if (
      Math.hypot(
        star.position.x - player.position.x,
        star.position.y - player.position.y
      ) <
      star.radius + player.radius
    ) {
      stars.splice(index, 1);
      score += 10;
      scoreEl.innerHTML = score;
    }
  });

  boundaries.forEach((boundary) => {
    boundary.draw();
    if (
      packmanCollisionDetection({
        circle: player,
        rectangle: boundary,
      })
    ) {
      console.log("we are colliding");
      player.velocity.y = 0;
      player.velocity.x = 0;
    }
  });

  player.update();
  /*  player.velocity.y = 0;
  player.velocity.x = 0; */

  ghosts.forEach((ghost) => {
    ghost.update();
    const collisions = [];
    boundaries.forEach((boundary) => {
      if (
        !collisions.includes("right") &&
        packmanCollisionDetection({
          circle: {
            ...ghost,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("right");
      }

      if (
        !collisions.includes("left") &&
        packmanCollisionDetection({
          circle: {
            ...ghost,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("left");
      }

      if (
        !collisions.includes("up") &&
        packmanCollisionDetection({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("up");
      }

      if (
        !collisions.includes("down") &&
        packmanCollisionDetection({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("down");
      }
      /* console.log(collisions); */
    });
    if (collisions.length > ghost.prevCollision.length) {
      ghost.prevCollision = collisions;
    }
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollision)) {
      if (ghost.velocity.x > 0) ghost.prevCollision.push("right");
      else if (ghost.velocity.x < 0) ghost.prevCollision.push("left");
      else if (ghost.velocity.y < 0) ghost.prevCollision.push("up");
      else if (ghost.velocity.y > 0) ghost.prevCollision.push("down");
      const pathways = ghost.prevCollision.filter((collision) => {
        return !collisions.includes(collision);
      });
      const directions = pathways[Math.floor(Math.random() * pathways.length)];

      switch (directions) {
        case "down":
          ghost.velocity.x = 0;
          ghost.velocity.y = -2;
          break;
        case "up":
          ghost.velocity.x = 0;
          ghost.velocity.y = 2;
          break;
        case "right":
          ghost.velocity.x = 2;
          ghost.velocity.y = 0;
          break;
        case "left":
          ghost.velocity.x = -2;
          ghost.velocity.y = 0;
          break;

        default:
          break;
      }
      ghost.prevCollision = [];
    }
  });
}

animate();

addEventListener("keydown", ({ key }) => {
  console.log(key);

  switch (key) {
    case "z":
      keys.up.pressed = true;
      lastkey = "z";
      break;
    case "s":
      keys.down.pressed = true;
      lastkey = "s";
      break;
    case "d":
      keys.right.pressed = true;
      lastkey = "d";
      break;
    case "q":
      keys.left.pressed = true;
      lastkey = "q";
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  console.log(key);

  switch (key) {
    case "z":
      keys.up.pressed = false;
      break;
    case "s":
      keys.down.pressed = false;
      break;
    case "d":
      keys.right.pressed = false;
      break;
    case "q":
      keys.left.pressed = false;
      break;
  }
});

console.log(c);

/* new Bounady({
    position: {
      x: 0,
      y: 0,
    },
  }),
  new Bounady({
    position: {
      x: 41,
      y: 0,
    },
  }), */
