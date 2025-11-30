const ROWS = 50;
const COLS = 50;

// Create a 2D array filled with false (all dead)
const grid: boolean[][] = [];

function randomBoolean(): boolean {
    return Math.random() < 0.2; // 20% chance to be true (alive)
}

for (let row = 0; row < ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < COLS; col++) {
        grid[row][col] = randomBoolean();
    }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

function drawGrid(ctx: CanvasRenderingContext2D, grid: boolean[][]) {
    // Draw the grid
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col]) {
                ctx!.fillStyle = "black";
            } else {
                ctx!.fillStyle = "white";
            }
            ctx!.fillRect(col * 10, row * 10, 10, 10);
        }
    }
}

// drawGrid(ctx!, grid);

function countAliveNeighbors(grid: boolean[][], row: number, col: number): number {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue; // Skip the cell itself
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                if (grid[newRow][newCol]) {
                    count++;
                }
            }
        }
    }
    return count;
}

function updateGrid(grid: boolean[][]): boolean[][] {
    const newGrid: boolean[][] = [];
    for (let row = 0; row < ROWS; row++) {
        newGrid[row] = [];
        for (let col = 0; col < COLS; col++) {
            const aliveNeighbors = countAliveNeighbors(grid, row, col);
            if (grid[row][col]) {
                // Cell is currently alive
                newGrid[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3;
            } else {
                // Cell is currently dead
                newGrid[row][col] = aliveNeighbors === 3;
            }
        }
    }
    return newGrid;
}

let lastUpdate = 0;

function animate(grid: boolean[][], timestamp: number = 0) {
    console.log("Animating at timestamp:", timestamp);
    if (timestamp - lastUpdate < 100) {
        requestAnimationFrame((ts) => animate(grid, ts));
        return;
    }
    lastUpdate = timestamp;

    // Clear the canvas
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx!, grid);

    // Request the next frame to continue the animation
    requestAnimationFrame((timestamp) => animate(updateGrid(grid)));
}

// Start the animation loop
requestAnimationFrame((timestamp) => animate(grid));