import {Game} from "./modules/game.js";

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

(new App());

