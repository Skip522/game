document.addEventListener('DOMContentLoaded', () => {
    const mazeContainer = document.getElementById('maze-container');
    const levelInfo = document.getElementById('level-info');
    const screamer = document.getElementById('screamer');
    const screamerImg = document.getElementById('screamer-img');
    
    // Кнопки мобильного управления
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    let currentLevel = 1;
    let playerPosition = { row: 0, col: 0 };
    let finishPosition = { row: 0, col: 0 };
    let mazeGrid = [];
    let mazeRows = 0;
    let mazeCols = 0;
    
    // Определение лабиринтов для каждого уровня
    const mazeLevels = [
        // Уровень 1
        [
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
        ],
        // Уровень 2
        [
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
        ],
        // Уровень 3 (исправленный - добавлен проходимый путь)
        [
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    ];
    
    // Инициализация игры
    function initGame() {
        loadLevel(currentLevel);
        document.addEventListener('keydown', handleKeyPress);
        
        // Добавляем обработчики для мобильных кнопок
        setupMobileControls();
    }
    
    // Загрузка уровня
    function loadLevel(level) {
        currentLevel = level;
        levelInfo.textContent = `Уровень: ${level}`;
        
        const mazeData = mazeLevels[level - 1];
        mazeRows = mazeData.length;
        mazeCols = mazeData[0].length;
        
        mazeGrid = [];
        mazeContainer.innerHTML = '';
        mazeContainer.style.gridTemplateRows = `repeat(${mazeRows}, 30px)`;
        mazeContainer.style.gridTemplateColumns = `repeat(${mazeCols}, 30px)`;
        
        for (let row = 0; row < mazeRows; row++) {
            mazeGrid[row] = [];
            for (let col = 0; col < mazeCols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                const cellType = mazeData[row][col];
                if (cellType === 0) {
                    cell.classList.add('path');
                    mazeGrid[row][col] = 0;
                } else if (cellType === 1) {
                    cell.classList.add('wall');
                    mazeGrid[row][col] = 1;
                } else if (cellType === 2) {
                    cell.classList.add('finish');
                    mazeGrid[row][col] = 0;
                    finishPosition = { row, col };
                }
                
                mazeContainer.appendChild(cell);
            }
        }
        
        // Найти стартовую позицию (первый путь в первой строке)
        let startCol = 0;
        for (let col = 0; col < mazeCols; col++) {
            if (mazeData[0][col] === 0) {
                startCol = col;
                break;
            }
        }
        
        playerPosition = { row: 0, col: startCol };
        updatePlayerPosition();
    }
    
    // Обновление позиции игрока
    function updatePlayerPosition() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('player'));
        
        const index = playerPosition.row * mazeCols + playerPosition.col;
        cells[index].classList.add('player');
        
        // Проверка на достижение финиша
        if (playerPosition.row === finishPosition.row && playerPosition.col === finishPosition.col) {
            if (currentLevel < 3) {
                setTimeout(() => {
                    loadLevel(currentLevel + 1);
                }, 500);
            } else {
                showScreamer();
            }
        }
    }
    
    // Показать скример
    function showScreamer() {
        const screamSound = new Audio('scream.mp3');
        screamSound.volume = 0.7;
        screamSound.play().catch(e => console.log('Audio play failed:', e));
        
        // Громкий крик при появлении скримера
        screamer.classList.remove('hidden');
        
        // Отображение скримера на более длительное время для большего эффекта
        setTimeout(() => {
            screamer.classList.add('hidden');
            currentLevel = 1;
            loadLevel(1);
        }, 5000);  // 5 секунд вместо 3 для большего эффекта
    }
    
    // Обработка нажатий клавиш
    function handleKeyPress(e) {
        const key = e.key;
        movePlayer(key);
    }
    
    // Функция перемещения игрока
    function movePlayer(direction) {
        let newRow = playerPosition.row;
        let newCol = playerPosition.col;
        
        if (direction === 'ArrowUp' || direction === 'w') {
            newRow--;
        } else if (direction === 'ArrowDown' || direction === 's') {
            newRow++;
        } else if (direction === 'ArrowLeft' || direction === 'a') {
            newCol--;
        } else if (direction === 'ArrowRight' || direction === 'd') {
            newCol++;
        }
        
        // Проверка возможности хода
        if (
            newRow >= 0 && 
            newRow < mazeRows && 
            newCol >= 0 && 
            newCol < mazeCols && 
            mazeGrid[newRow][newCol] !== 1
        ) {
            playerPosition.row = newRow;
            playerPosition.col = newCol;
            updatePlayerPosition();
        }
    }
    
    // Настройка мобильных элементов управления
    function setupMobileControls() {
        // Обработчики нажатий для сенсорных экранов с использованием нескольких типов событий
        
        // Кнопка вверх
        upBtn.addEventListener('click', () => movePlayer('ArrowUp'));
        upBtn.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Предотвращаем прокрутку
            movePlayer('ArrowUp');
        });
        
        // Кнопка вниз
        downBtn.addEventListener('click', () => movePlayer('ArrowDown'));
        downBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            movePlayer('ArrowDown');
        });
        
        // Кнопка влево
        leftBtn.addEventListener('click', () => movePlayer('ArrowLeft'));
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            movePlayer('ArrowLeft');
        });
        
        // Кнопка вправо
        rightBtn.addEventListener('click', () => movePlayer('ArrowRight'));
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            movePlayer('ArrowRight');
        });
        
        // Останавливаем распространение других событий на кнопках
        [upBtn, downBtn, leftBtn, rightBtn].forEach(btn => {
            // Дополнительные обработчики, чтобы исключить другие события
            btn.addEventListener('touchmove', (e) => e.preventDefault());
            btn.addEventListener('touchend', (e) => e.preventDefault());
            btn.addEventListener('mousedown', (e) => e.preventDefault());
        });
    }
    
    // Запуск игры
    initGame();
}); 