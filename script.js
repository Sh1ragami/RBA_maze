let mazeWidth = 21;  // 迷路の幅（奇数）
let mazeHeight = 21; // 迷路の高さ（奇数）
let maze = [];
let playerPos = { x: 1, y: 1 };
let goalPos = { x: 0, y: 0 }; // ゴールの位置

// 迷路を生成する関数
function generateMaze(width, height) {
    // 迷路を全て壁で埋める
    maze = [];
    for (let y = 0; y < height; y++) {
        maze[y] = [];
        for (let x = 0; x < width; x++) {
            maze[y][x] = 1; // 壁
        }
    }

    // 穴掘り法を使って迷路を生成
    carvePassage(1, 1);

    // ゴール地点を設定
    setGoal();
}

// 穴掘り法のメインロジック
function carvePassage(cx, cy) {
    const directions = [
        { x: 0, y: -2 }, // 上
        { x: 2, y: 0 },  // 右
        { x: 0, y: 2 },  // 下
        { x: -2, y: 0 }  // 左
    ];

    shuffle(directions);

    directions.forEach(direction => {
        const nx = cx + direction.x;
        const ny = cy + direction.y;

        if (ny >= 1 && ny < mazeHeight - 1 && nx >= 1 && nx < mazeWidth - 1 && maze[ny][nx] === 1) {
            maze[ny][nx] = 0;
            maze[cy + direction.y / 2][cx + direction.x / 2] = 0;
            carvePassage(nx, ny);
        }
    });
}

// 配列をシャッフルする関数
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ゴール地点を設定する関数
function setGoal() {
    let maxDistance = -1;

    // 各セルの距離を計算
    for (let y = 1; y < mazeHeight; y += 2) {
        for (let x = 1; x < mazeWidth; x += 2) {
            if (maze[y][x] === 0) {
                let distance = bfsDistance({ x: 1, y: 1 }, { x, y });
                if (distance > maxDistance) {
                    maxDistance = distance;
                    goalPos = { x, y };
                }
            }
        }
    }
}

// 幅優先探索を使って距離を計算する関数
function bfsDistance(start, end) {
    const queue = [{ ...start, dist: 0 }];
    const visited = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill(false));
    visited[start.y][start.x] = true;

    while (queue.length > 0) {
        const { x, y, dist } = queue.shift();
        if (x === end.x && y === end.y) return dist;

        const directions = [
            { x: 0, y: -1 }, // 上
            { x: 1, y: 0 },  // 右
            { x: 0, y: 1 },  // 下
            { x: -1, y: 0 }  // 左
        ];

        directions.forEach(direction => {
            const nx = x + direction.x;
            const ny = y + direction.y;

            if (nx >= 0 && nx < mazeWidth && ny >= 0 && ny < mazeHeight && maze[ny][nx] === 0 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push({ x: nx, y: ny, dist: dist + 1 });
            }
        });
    }
    return -1;
}

// 迷路をHTMLに描画する関数
function drawMaze() {
    const mazeElement = document.getElementById('maze');

    // 既存の迷路をクリア
    mazeElement.innerHTML = '';

    mazeElement.style.gridTemplateColumns = `repeat(${mazeWidth}, 30px)`;

    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            if (cell === 1) {
                cellElement.classList.add('wall');
            }
            if (x === playerPos.x && y === playerPos.y) {
                cellElement.classList.add('player');
            }
            if (x === goalPos.x && y === goalPos.y) {
                cellElement.classList.add('goal');
            }
            mazeElement.appendChild(cellElement);
        });
    });
}

// プレイヤーの移動を処理する関数
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (maze[newY][newX] === 0) {
        playerPos.x = newX;
        playerPos.y = newY;
        drawMaze();
        checkGoal();
    }
}

// ゴールに到達したか確認する関数
function checkGoal() {
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
        alert('ゴール！ゲームクリア！');
        resetGame();
    }
}

// ゲームをリセットする関数
function resetGame() {
    const size = parseInt(document.getElementById('maze-size').value, 10);
    if (size % 2 === 1 && size >= 5) {
        mazeWidth = size;
        mazeHeight = size;
    } else {
        alert('迷路のサイズは5以上の奇数で指定してください。');
    }
    playerPos = { x: 1, y: 1 };
    generateMaze(mazeWidth, mazeHeight);
    drawMaze();
}

// ゲーム開始関数
function startGame() {
    resetGame();
}

// 操作設定
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
        case 's':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
            movePlayer(1, 0);
            break;
    }
});

// ゲームの初期化
alert('操作方法\n 上 ↑ or w\n 左 ← or a\n 下 ↓ or s\n 右 → or d');
startGame();
