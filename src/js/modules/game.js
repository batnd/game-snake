import {Snake} from "./snake.js";
import {Food} from "./food.js";
import {colors} from "../utils/colors.js";

export class Game {

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