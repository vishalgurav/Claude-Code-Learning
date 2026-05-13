class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isComputerMode = false;
        this.computerPlayer = 'O';
        this.humanPlayer = 'X';

        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('pvp-btn').addEventListener('click', () => this.setGameMode(false));
        document.getElementById('pvc-btn').addEventListener('click', () => this.setGameMode(true));
    }

    setGameMode(isComputerMode) {
        this.isComputerMode = isComputerMode;
        this.resetGame();

        const pvpBtn = document.getElementById('pvp-btn');
        const pvcBtn = document.getElementById('pvc-btn');

        if (isComputerMode) {
            pvpBtn.classList.remove('active');
            pvcBtn.classList.add('active');
        } else {
            pvpBtn.classList.add('active');
            pvcBtn.classList.remove('active');
        }
    }

    handleCellClick(e) {
        const index = parseInt(e.target.dataset.index);

        if (this.board[index] !== null || !this.gameActive) {
            return;
        }

        this.board[index] = this.currentPlayer;
        this.checkGameEnd();

        if (this.gameActive) {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.render();

            if (this.isComputerMode && this.currentPlayer === this.computerPlayer && this.gameActive) {
                setTimeout(() => this.makeComputerMove(), 500);
            }
        } else {
            this.render();
        }
    }

    makeComputerMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === null ? index : null)
            .filter(val => val !== null);

        if (availableMoves.length === 0) return;

        // Try to win
        let move = this.findBestMove(this.computerPlayer);
        if (move === null) {
            // Try to block opponent
            move = this.findBestMove(this.humanPlayer);
        }
        if (move === null) {
            // Play center if available
            move = availableMoves.includes(4) ? 4 : availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        this.board[move] = this.computerPlayer;
        this.checkGameEnd();

        if (this.gameActive) {
            this.currentPlayer = this.humanPlayer;
            this.render();
        } else {
            this.render();
        }
    }

    findBestMove(player) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = player;
                if (this.checkWin(player)) {
                    this.board[i] = null;
                    return i;
                }
                this.board[i] = null;
            }
        }
        return null;
    }

    checkGameEnd() {
        if (this.checkWin(this.currentPlayer)) {
            this.gameActive = false;
            return;
        }

        if (this.board.every(cell => cell !== null)) {
            this.gameActive = false;
        }
    }

    checkWin(player) {
        return this.winningConditions.some(condition => {
            return condition.every(index => this.board[index] === player);
        });
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.render();
    }

    render() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.board[index] || '';
            cell.classList.remove('x', 'o');
            if (this.board[index]) {
                cell.classList.add(this.board[index].toLowerCase());
            }
        });

        const currentPlayerSpan = document.getElementById('current-player');
        const gameStatusSpan = document.getElementById('game-status');

        if (!this.gameActive) {
            if (this.checkWin('X')) {
                gameStatusSpan.textContent = this.isComputerMode ? 
                    (this.computerPlayer === 'X' ? 'Computer wins! 🤖' : 'You win! 🎉') :
                    'X wins! 🎉';
            } else if (this.checkWin('O')) {
                gameStatusSpan.textContent = this.isComputerMode ?
                    (this.computerPlayer === 'O' ? 'Computer wins! 🤖' : 'You win! 🎉') :
                    'O wins! 🎉';
            } else {
                gameStatusSpan.textContent = "It's a Draw! 🤝";
            }
        } else {
            gameStatusSpan.textContent = 'Game in Progress';
            currentPlayerSpan.textContent = this.currentPlayer;
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
