const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;


const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;

function drawScore() {
    ctx.font = "20px Courier";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "Black";
    ctx.fillText("Score: " + score, blockSize, blockSize);
}
drawScore();

function drawBorder() {
    ctx.fillStyle = 'Gray';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);

}
drawBorder();

function gameOver() {
    // clearInterval(intervalid);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game over", width / 2, height / 2);
}

let circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

let Block = function (col, row) {
    this.col = col;
    this.row = row;
};

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};

let Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    this.direction = 'right';
    this.nextDirection = 'left';
};

Snake.prototype.draw = function () {
    for(let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare('Blue');
    }
};

Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    if(this.direction === 'right') {
        newHead = new Block(head.col + 1, head.row);
    } else if(this.direction === 'down') {
        newHead = new Block(head.col, head.row + 1);
    } else if(this.direction === 'left') {
        newHead = new Block(head.col - 1, head.row);
    } else if(this.direction === 'up'){
        newHead = new Block(head.col, head.row = 1);
    }
    if(this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if(newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

Snake.prototype.checkCollision = function () {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let downCollision = (head.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision ||
        rightCollision || downCollision;

    let selfCollision = false;
    for(let i = 0; i < this.segments.length; i++) {
        if(head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};

let directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
}

${'body'}.keydown(function (event) {
    let newDirection = directions[event.keyCode];
    if(newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});

Snake.prototype.setDirection = function (newDirection) {
  if(this.direction === 'up' && newDirection === 'down') {
      return;
  } else if(this.direction === 'right' && newDirection === 'left') {
      return;
  } else if(this.direction === 'down' && newDirection === 'up') {
      return;
  } else if(this.direction === 'left' && newDirection === 'right') {
      return;
  }
  this.nextDirection = newDirection;
};

