class App {

    settings = {
        positionsCount: 30,
        positionsSize: 20
    }

    constructor() {
        this.createCanvas();
        this.newGame();

        this.reloadCanvasEvent();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', (this.settings.positionsCount * this.settings.positionsSize).toString());
        canvas.setAttribute('height', (this.settings.positionsCount * this.settings.positionsSize).toString());
        document.querySelector('.rules').before(canvas);
    }

    newGame() {
        const canvas = document.querySelector('canvas');
        const context = canvas.getContext('2d');
        new Game(context, this.settings);
    }

    reloadCanvasEvent() {
        document.getElementById('end').addEventListener('click', () => {
            const canvas = document.querySelector('canvas');
            document.querySelector('.score span').innerHTML = '0';
            canvas.remove();

            this.createCanvas();
            this.newGame();
        });
    }
}

const colors = {
    snake: '#6bba62',
    grid: 'rgba(0, 0, 0, 0.15)',
    food: '#e04b5a'
}

class Food {
    foodRadius = null;
    foodPosition = {
        x: 1,
        y: 1
    }
    context = null;
    positionsCount = 20;
    positionsSize = 30;
    foodColor = colors.food;

    constructor(context, positionsCount, positionsSize) {
        this.context = context;
        this.positionsCount = positionsCount;
        this.positionsSize = positionsSize;

        this.foodRadius = this.positionsSize / 2;
    }

    setNewFoodPosition() {
        this.foodPosition = {
            x: NumberUtils.getRandomInt(1, this.positionsCount),
            y: NumberUtils.getRandomInt(1, this.positionsCount),
        }
    }

    showFood() {
        this.context.fillStyle = this.foodColor;
        this.context.beginPath();
        this.context.arc(this.foodPosition.x * this.positionsSize - this.foodRadius,
            this.foodPosition.y * this.positionsSize - this.foodRadius, this.foodRadius,
            0, 2 * Math.PI);
        this.context.fill();
    }
}

class Game {

    snake = null;
    context = null;
    positionsCount = null;
    positionsSize = null;
    scoreElement = null;
    interval = null;
    score = 0;
    gridColor = colors.grid;

    constructor(context, settings) {
        this.context = context;

        this.positionsCount = settings.positionsCount;
        this.positionsSize = settings.positionsSize;

        this.scoreElement = document.getElementById('score');

        document.getElementById('start').onclick = () => {
            this.startGame();
        }
    }

    startGame() {
        this.score = 0;
        this.scoreElement.innerText = this.score;

        if (this.interval) {
            clearInterval(this.interval);
        }

        this.food = new Food(this.context, this.positionsCount, this.positionsSize);
        this.snake = new Snake(this.context, this.positionsCount, this.positionsSize);
        this.food.setNewFoodPosition();
        this.interval = setInterval(this.gameProcess.bind(this), 100);

    }

    gameProcess() {
        this.context.clearRect(0, 0, this.positionsCount * this.positionsSize, this.positionsCount * this.positionsSize);

        this.showGrid();
        this.food.showFood();
        let result = this.snake.showSnake(this.food.foodPosition);
        if (result) {
            if (result.collision) {
                this.endGame();
            } else if (result.gotFood) {
                this.score += 1;
                this.scoreElement.innerText = this.score;
                this.food.setNewFoodPosition();
            }
        }
    }

    endGame() {
        clearInterval(this.interval);

        this.context.fillStyle = '#2a2a2a';
        this.context.font = '700 48px PTSans';
        this.context.textAlign = 'center';
        this.context.fillText('You scored: ' + this.score + ' points!',
            (this.positionsCount * this.positionsSize) / 2,
            (this.positionsCount * this.positionsSize) / 2);
    }

    showGrid() {
        const size = this.positionsCount * this.positionsSize;
        for (let x = 0; x <= size; x += this.positionsSize) {
            this.context.moveTo(0.5 + x + this.positionsSize, 0);
            this.context.lineTo(0.5 + x + this.positionsSize, size + this.positionsSize);
        }

        for (let x = 0; x <= size; x += this.positionsSize) {
            this.context.moveTo(0, 0.5 + x + this.positionsSize);
            this.context.lineTo(size + this.positionsSize, 0.5 + x + this.positionsSize);
        }
        // this.context.strokeStyle = "rgba(0, 0, 0, 0.25)";
        this.context.strokeStyle = this.gridColor;
        this.context.stroke();
    }

}

class Snake {

    currentDirection = 'right';
    snake = [
        {x: 10, y: 20},
    ];
    context = null;
    positionsCount = 20;
    positionsSize = 30;
    snakeColor = colors.snake;

    constructor(context, positionsCount, positionsSize) {
        this.context = context;
        this.positionsCount = positionsCount;
        this.positionsSize = positionsSize;

        this.addKeyboardHandler();
    }

    addKeyboardHandler() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft' && this.currentDirection !== 'right') {
                this.currentDirection = 'left';
            } else if (event.key === 'ArrowRight' && this.currentDirection !== 'left') {
                this.currentDirection = 'right';
            } else if (event.key === 'ArrowUp' && this.currentDirection !== 'down') {
                this.currentDirection = 'up';
            } else if (event.key === 'ArrowDown' && this.currentDirection !== 'up') {
                this.currentDirection = 'down';
            }
        })
    }

    showSnake(foodPosition) {
        let result = {
            gotFood: false,
            collision: false,
        };
        for (let i = 0; i < this.snake.length; i++) {
            this.context.fillStyle = this.snakeColor;
            this.context.beginPath();
            this.context.fillRect(this.snake[i].x * this.positionsSize - this.positionsSize,
                this.snake[i].y * this.positionsSize - this.positionsSize,
                this.positionsSize, this.positionsSize);
        }

        let newHeadPosition = {
            x: this.snake[0].x,
            y: this.snake[0].y,
        }

        if (foodPosition && foodPosition.x === newHeadPosition.x && foodPosition.y === newHeadPosition.y) {
            result.gotFood = true;
        } else {
            this.snake.pop();
        }

        if (this.currentDirection === 'left') {
            if (newHeadPosition.x === 1) {
                newHeadPosition.x = this.positionsCount;
            } else {
                newHeadPosition.x -= 1;
            }
        } else if (this.currentDirection === 'right') {
            if (newHeadPosition.x === this.positionsCount) {
                newHeadPosition.x = 1;
            } else {
                newHeadPosition.x += 1;
            }
        } else if (this.currentDirection === 'up') {
            if (newHeadPosition.y === 1) {
                newHeadPosition.y = this.positionsCount;
            } else {
                newHeadPosition.y -= 1;
            }
        } else if (this.currentDirection === 'down') {
            if (newHeadPosition.y === this.positionsCount) {
                newHeadPosition.y = 1;
            } else {
                newHeadPosition.y += 1;
            }
        }

        if (!this.checkNewHeadPositionForCollision(newHeadPosition)) {
            this.snake.unshift(newHeadPosition);
        } else {
            result.collision = true;
        }

        return result;
    }

    checkNewHeadPositionForCollision (newHeadPosition) {
        for (let i = 0; i < this.snake.length; i++) {
            if (newHeadPosition.x === this.snake[i].x && newHeadPosition.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    }

}

class NumberUtils {
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

(new App());