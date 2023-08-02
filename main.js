const prompt = require("prompt-sync")({ sigint: true });
const { getRandomNumber } = require("./utils");

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
let gameOver;

const controls = {
  left: "a",
  right: "d",
  up: "w",
  down: "s",
};

class Field {
  constructor(field) {
    this._field = field;
    this._x = 0;
    this._y = 0;

    this.findStartPos();
  }

  print() {
    this._field.forEach((element) => {
      console.log(element.join(""));
    });
  }

  move(input) {
    if (Object.values(controls).includes(input)) {
      if (input === controls.down) {
        this.handleMovement(0, 1);
      } else if (input === controls.up) {
        this.handleMovement(0, -1);
      } else if (input === controls.left) {
        this.handleMovement(-1, 0);
      } else if (input === controls.right) {
        this.handleMovement(1, 0);
      }
    }
  }
  handleMovement(x, y) {
    const nextCharacter = this._field[this._y + y][this._x + x];
    if ([fieldCharacter, hole, hat].includes(nextCharacter)) {
      if (nextCharacter === fieldCharacter) {
        this._field[this._y + y][this._x + x] = pathCharacter;
      } else if (nextCharacter === hole) {
        gameOver = "Game Over you fell in a hole :( ";
      } else if (nextCharacter === hat) {
        gameOver = "You win you found your hat! :)";
      }
      this._x += x;
      this._y += y;
    }
  }
  findStartPos() {
    this._y = this._field.findIndex((el) => {
      return el.includes(pathCharacter);
    });
    this._x = this._field[this._y].indexOf(pathCharacter);
  }

  static generateField(width, height, percentage) {
    const field = [];

    for (let i = 0; i < height; i++) field.push([]);

    field.forEach((row) => this.buildTerrain(row, width, percentage));

    field[getRandomNumber(height)][getRandomNumber(width)] = pathCharacter;
    field[getRandomNumber(height)][getRandomNumber(width)] = hat;

    return field;
  }

  static buildTerrain(row, width, percentage) {
    for (let i = 0; i < width; i++) {
      const isHole = getRandomNumber(100) <= percentage;

      if (isHole) {
        row.push(hole);
      } else {
        row.push(fieldCharacter);
      }
    }
  }
}

const fieldLayout = Field.generateField(40, 40, 30);
const myField = new Field(fieldLayout);

do {
  // Show the Field
  console.clear();
  myField.print();

  // Handle Movement
  const dir = prompt("Which way!? ");
  myField.move(dir);

  // Check for game over
  if (gameOver) {
    console.log(gameOver);
  }
} while (!gameOver);
