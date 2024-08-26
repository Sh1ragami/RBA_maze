# 穴掘り法と幅優先探索を使った迷路ミニゲーム
## https://rbamaze-321c0.web.app

## 1. 穴掘り法による迷路生成

### 概要
穴掘り法（Recursive Backtracking）は、再帰的に迷路の通路を掘り進める迷路生成アルゴリズム。迷路のセルを訪問しながらランダムに通路を作成。

### アルゴリズムの流れ
1. **迷路の初期化**:
   - 迷路を全て壁で埋める。
   
2. **通路の掘削**:
   - 開始点から、ランダムに選んだ方向に進む。進む先のマスが未訪問であれば、そのマスと進行方向の中間の壁を削る。
   - 新しいマスに移動し、再帰的に同じ操作を繰り返す。
   - すべての方向に進めなくなった場合には、以前の状態に戻って別の方向を試す。

### コード例
```javascript
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
```
<br>

## 幅優先探索（BFS）による距離計算

### 概要
幅優先探索（Breadth-First Search, BFS）は、グラフや迷路内のノードをレベルごとに探索するアルゴリズム。特に迷路において、指定されたスタート地点からゴール地点までの最短距離を計算するのに使われる。

### アルゴリズムの流れ

1. **初期化**:
   - スタート地点をキューに追加し、距離を0に設定。
   - 各セルの訪問状態を管理するための配列を用意し、スタート地点を訪問済みとしてマーク。

2. **探索**:
   - キューからセルを取り出し、そのセルがゴール地点であれば、現在の距離を返却。
   - 現在のセルから隣接するセル（上、下、左、右）をすべて調べ、未訪問かつ通路であるセルを見つける。
   - 未訪問のセルをキューに追加し、そのセルの距離を更新。

3. **終了条件**:
   - キューが空になるまで探索を続け、ゴール地点に到達するまでの距離を返却。

### コード例
```javascript
function bfsDistance(start, end) {
    // スタート地点を含むキューと距離を管理する変数
    const queue = [{ ...start, dist: 0 }];
    // 迷路の各セルの訪問状態を管理する配列
    const visited = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill(false));
    visited[start.y][start.x] = true;

    // キューが空になるまでループ
    while (queue.length > 0) {
        const { x, y, dist } = queue.shift(); // キューからセルを取り出す
        // ゴール地点に到達した場合、現在の距離を返す
        if (x === end.x && y === end.y) return dist;

        // 隣接するセルの方向
        const directions = [
            { x: 0, y: -1 }, // 上
            { x: 1, y: 0 },  // 右
            { x: 0, y: 1 },  // 下
            { x: -1, y: 0 }  // 左
        ];

        // 隣接するセルを探索
        directions.forEach(direction => {
            const nx = x + direction.x;
            const ny = y + direction.y;

            // 範囲内かつ通路であり、未訪問のセルがあるか
            if (nx >= 0 && nx < mazeWidth && ny >= 0 && ny < mazeHeight && maze[ny][nx] === 0 && !visited[ny][nx]) {
                visited[ny][nx] = true; // 訪問済みとしてマーク
                queue.push({ x: nx, y: ny, dist: dist + 1 }); // キューに追加
            }
        });
    }
    // ゴール地点に到達できない場合は -1 を返す
    return -1;
}
```
