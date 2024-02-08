import {NumberUtils} from "../utils/number-utils.js";
import {colors} from "../utils/colors.js";

export class Food {
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