const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const gameOverScreen = document.querySelector('.game-over');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let score = 0;
let highScore = localStorage.getItem('high-score') || 0;
let gameSpeed = 200;
highScoreElement.textContent = `High Score: ${highScore}`;

function updateFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

function restartGame() {
    window.location.reload();
}

function handleGameOver() {
    gameOver = true;
    gameOverScreen.style.display = 'block';
}

function adjustSpeed() {
    if (score % 5 === 0 && score !== 0) {
        gameSpeed = Math.max(100, gameSpeed - 20);
        clearInterval(interval);
        interval = setInterval(initGame, gameSpeed);
    }
}

function initGame() {
    if (gameOver) return;

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        scoreElement.textContent = `Score: ${score}`;
        adjustSpeed();

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('high-score', highScore);
            highScoreElement.textContent = `High Score: ${highScore}`;
        }
    }

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) handleGameOver();

    snakeBody.unshift([snakeX, snakeY]);
    if (snakeBody.length > score + 1) snakeBody.pop();

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }

    playBoard.innerHTML = html;
}

let interval = setInterval(initGame, gameSpeed);
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && velocityY !== 1) [velocityX, velocityY] = [0, -1];
    if (e.key === 'ArrowDown' && velocityY !== -1) [velocityX, velocityY] = [0, 1];
    if (e.key === 'ArrowLeft' && velocityX !== 1) [velocityX, velocityY] = [-1, 0];
    if (e.key === 'ArrowRight' && velocityX !== -1) [velocityX, velocityY] = [1, 0];
});

updateFoodPosition();
