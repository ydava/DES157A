(function () {
    'use strict';
    console.log('reading js');

    /* =========================
       DOM REFERENCES
    ========================= */

    const setupSection = document.querySelector('#setup');
    const gameboard = document.querySelector('#gameboard');
    const actionsSection = document.querySelector('#actions');
    const scoreSection = document.querySelector('#score');

    const startBtn = document.querySelector('#startgame');
    const rollBtn = document.querySelector('#roll');
    const passBtn = document.querySelector('#pass');
    const quitBtn = document.querySelector('#quit');

    const gameMessage = document.querySelector('#game-message');

    const die1Img = document.querySelector('#die1');
    const die2Img = document.querySelector('#die2');

    const p1Panel = document.querySelector('#player1panel');
    const p2Panel = document.querySelector('#player2panel');

    const p1ScoreEl = document.querySelector('#player1panel .total-score span');
    const p2ScoreEl = document.querySelector('#player2panel .total-score span');

    const p1NameEl = document.querySelector('#p1name');
    const p2NameEl = document.querySelector('#p2name');

    const thresholdInput = document.querySelector('#threshold');
    const thresholdDisplay = document.querySelector('#threshold-display');

    const vsComputerCheckbox = document.querySelector('#vscomputer');
    const name2Input = document.querySelector('#name2');

    const screenFlash = document.querySelector('#screen-flash');


    /* =========================
       BACKGROUND EYES 
    ========================= */

    const eyeContainer = document.querySelector('#eye-container');
    const eyes = [];

    function createEye() {
        const eye = document.createElement('img');
        eye.classList.add('eye');

        eye.src = 'images/eye-open.svg';

        eye.style.top = Math.random() * 100 + 'vh';
        eye.style.left = Math.random() * 100 + 'vw';

        const size = Math.random() * 60 + 40;
        eye.style.width = size + 'px';

        eye.style.opacity = Math.random() * 0.2 + 0.05;

        eyeContainer.appendChild(eye);
        eyes.push(eye);

        blinkLoop(eye);
    }

    function blinkLoop(eye) {
        function blink() {
            eye.src = 'images/eye-closed.svg';

            setTimeout(() => {
                eye.src = 'images/eye-open.svg';
            }, 180);

            schedule();
        }

        function schedule() {
            const delay = Math.random() * 6000 + 2000;
            setTimeout(blink, delay);
        }

        schedule();
    }

    // spawn multiple eyes
    for (let i = 0; i < 30; i++) {
        createEye();
    }

    /* =========================
       GAME STATE
    ========================= */

    const gameData = {
        dice: ['1die.svg', '2die.svg', '3die.svg', '4die.svg', '5die.svg', '6die.svg'],
        players: ['Player 1', 'Player 2'],
        score: [0, 0],
        roll1: 0,
        roll2: 0,
        rollSum: 0,
        index: 0,
        gameEnd: 30,
        vsComputer: false,
        turnScore: 0
    };

    /* =========================
       UI HELPERS
    ========================= */

    thresholdInput.addEventListener('input', function () {
        thresholdDisplay.textContent = thresholdInput.value;
    });

    vsComputerCheckbox.addEventListener('change', function () {
        name2Input.disabled = vsComputerCheckbox.checked;
        name2Input.value = '';
        name2Input.placeholder = vsComputerCheckbox.checked ? 'Computer' : 'Enter name';
    });

    function showCurrentScore() {
        p1ScoreEl.textContent = gameData.score[0];
        p2ScoreEl.textContent = gameData.score[1];
    }

    function updateActivePanel() {
        p1Panel.classList.toggle('active', gameData.index === 0);
        p2Panel.classList.toggle('active', gameData.index === 1);
    }

    function switchPlayer() {
        gameData.index = gameData.index ? 0 : 1;
        gameData.turnScore = 0;
    }

    function checkWinningCondition() {
        if (gameData.score[gameData.index] >= gameData.gameEnd) {

            scoreSection.innerHTML =
                '<h2>' +
                gameData.players[gameData.index] +
                ' wins with ' +
                gameData.score[gameData.index] +
                ' points!</h2>';

            rollBtn.disabled = true;
            passBtn.disabled = true;
            gameMessage.textContent = 'Game over!';
            quitBtn.textContent = 'Play Again';

        } else {
            showCurrentScore();
        }
    }

    /* =========================
       DICE ROLL
    ========================= */

    function cursedRoll() {
        const bias = Math.random();

        let r1, r2;

        if (bias < 0.09) {
            r1 = 1;
        } else {
            r1 = Math.floor(Math.random() * 6) + 1;
        }

        if (bias < 0.09) {
            r2 = 1;
        } else {
            r2 = Math.floor(Math.random() * 6) + 1;
        }

        return [r1, r2];
    }

    /* =========================
       TURN SETUP
    ========================= */

    function setUpTurn() {
        updateActivePanel();
        showCurrentScore();
        scoreSection.innerHTML = '';
        gameMessage.textContent = gameData.players[gameData.index] + "'s turn";

        rollBtn.disabled = false;
        passBtn.disabled = true;

        if (gameData.vsComputer && gameData.index === 1) {
            rollBtn.disabled = true;
            passBtn.disabled = true;
            setTimeout(computerTurn, 1200);
        }
    }

    /* =========================
       ANIMATION
    ========================= */

    function animateDice() {
        die1Img.classList.remove('rolling');
        die2Img.classList.remove('rolling');
        void die1Img.offsetWidth;
        void die2Img.offsetWidth;
        die1Img.classList.add('rolling');
        die2Img.classList.add('rolling');
    }

    /* =========================
       DICE LOGIC
    ========================= */

    function throwDice() {

        [gameData.roll1, gameData.roll2] = cursedRoll();

        gameData.rollSum = gameData.roll1 + gameData.roll2;

        die1Img.src = 'images/' + gameData.dice[gameData.roll1 - 1];
        die2Img.src = 'images/' + gameData.dice[gameData.roll2 - 1];

        die1Img.alt = 'Die showing ' + gameData.roll1;
        die2Img.alt = 'Die showing ' + gameData.roll2;

        animateDice();

        rollBtn.disabled = true;
        passBtn.disabled = true;

        /* =========================
           CURSED SNAKE EYES 
        ========================= */

        if (gameData.rollSum === 2) {

            screenFlash.classList.remove('active');
            void screenFlash.offsetWidth;
            screenFlash.classList.add('active');

            gameData.score[gameData.index] = 0;

            gameMessage.textContent =
                'CURSED SNAKE EYES! ' +
                gameData.players[gameData.index] +
                "'s score is destroyed.";

            showCurrentScore();

            switchPlayer();
            setTimeout(setUpTurn, 2000);

        /* =========================
           ROLL A 1
        ========================= */

        } else if (gameData.roll1 === 1 || gameData.roll2 === 1) {

            const nextPlayer = gameData.index ? 0 : 1;

            gameMessage.textContent =
                'Rolled a 1 - switching to ' +
                gameData.players[nextPlayer] + '.';

            switchPlayer();
            setTimeout(setUpTurn, 2000);

        /* =========================
           NORMAL TURN
        ========================= */

        } else {

            gameData.score[gameData.index] += gameData.rollSum;
            gameData.turnScore += gameData.rollSum;

            gameMessage.textContent =
                gameData.players[gameData.index] +
                ' rolled a ' + gameData.rollSum + '!';

            rollBtn.disabled = false;
            passBtn.disabled = false;

            checkWinningCondition();
        }
    }

    /* =========================
       COMPUTER AI
    ========================= */

    function computerTurn() {
        if (!gameData.vsComputer || gameData.index !== 1) return;

        throwDice();

        setTimeout(function () {

            if (!gameData.vsComputer || gameData.index !== 1 || passBtn.disabled) return;

            const nearWin = gameData.score[1] >= gameData.gameEnd - 5;
            const enoughThisTurn = gameData.turnScore >= 15;

            if (nearWin || enoughThisTurn) {

                gameMessage.textContent =
                    'Computer passes with ' + gameData.score[1] + ' pts.';

                setTimeout(function () {
                    switchPlayer();
                    setUpTurn();
                }, 800);

            } else {
                setTimeout(computerTurn, 1000);
            }

        }, 900);
    }

    /* =========================
       START GAME
    ========================= */

    startBtn.addEventListener('click', function () {

        document.querySelector('#main-header').classList.remove('hidden');
        document.querySelector('#main-footer').classList.remove('hidden');


        const name1 = document.querySelector('#name1').value.trim() || 'Player 1';
        const vsComp = vsComputerCheckbox.checked;

        gameData.players[0] = name1;
        gameData.vsComputer = vsComp;
        gameData.players[1] = vsComp ? 'Computer' : (name2Input.value.trim() || 'Player 2');

        const threshold = parseInt(thresholdInput.value);
        gameData.gameEnd = (threshold >= 10 && threshold <= 100) ? threshold : 30;

        gameData.score = [0, 0];
        gameData.turnScore = 0;
        gameData.index = Math.round(Math.random());

        p1NameEl.textContent = gameData.players[0];
        p2NameEl.textContent = gameData.players[1];

        setupSection.classList.add('hidden');
        gameboard.classList.remove('hidden');
        actionsSection.classList.remove('hidden');
        quitBtn.classList.remove('hidden');

        showCurrentScore();
        setUpTurn();
    });

    /* =========================
       BUTTONS
    ========================= */

    rollBtn.addEventListener('click', function () {
        throwDice();
    });

    passBtn.addEventListener('click', function () {
        switchPlayer();
        setUpTurn();
    });

    quitBtn.addEventListener('click', function () {
        location.reload();
    });

})();