var checkDone = false
const QUANTITY_CELL = 36
const SIZE = 45
const COL = 14
const ROW = 14
const WIDTH = COL * SIZE
const HEIGHT = ROW * SIZE

var bord = []
var canvas = document.getElementById("canvas");
canvas.width = WIDTH
canvas.height = HEIGHT
var ctx = canvas.getContext("2d");
canvas.addEventListener('click', function (e) {
    let x = Math.floor(e.clientX / SIZE)
    let y = Math.floor(e.clientY / SIZE)
    console.log(x, y)
    // new Cell(x, y).drawLine("T")
    // new Cell(x, y).drawLine("L")

    check(x, y)
},);


class Cell {

    constructor(x, y) {
        this.x = x
        this.y = y

    }

    init() {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        if (bord[this.x][this.y] !== 0) {
            let img = new Image()
            img.src = `cell/${bord[this.x][this.y]}.png`
            img.onload = function () {
                draw(this)
            };
            let draw = (img) => {
                ctx.drawImage(img, this.x * SIZE, this.y * SIZE, SIZE, SIZE);
                ctx.strokeRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE)
            }
        } else {
            ctx.clearRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
        }

    }

    clear() {
        ctx.clearRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);

    }

    active() {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE)
    }

    drawLine(type) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        if (type === "L") {
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE) + SIZE, (this.y * SIZE) + (SIZE / 2));
            ctx.stroke();
        }
        if (type === "R") {
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE), (this.y * SIZE) + (SIZE / 2));
            ctx.stroke();
        }
        if (type === "T") {
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + SIZE);
            ctx.stroke();
        }
        if (type === "B") {
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE));
            ctx.stroke();
        }


    }

    equals(that) {
        if (this.x === that.x && this.y === that.y) return true
        return false
    }
}

const startGame = () => {

    for (let i = 0; i < ROW; i++) {
        let rI = []
        for (let j = 0; j < COL; j++) {
            let random = Math.floor(Math.random() * QUANTITY_CELL + 1)
            if (i === 0 || i === ROW - 1) {
                rI.push(0)
            } else {
                if (j === 0 || j === COL - 1) {
                    rI.push(0)
                } else {
                    rI.push(random)
                }
            }
        }
        bord.push(rI)

    }
}
const drawBord = () => {
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            new Cell(i, j).init()
        }
    }
}
startGame()
drawBord()
console.table(bord)
var p1;
var p2;

const check = (i, j) => {
    console.log(i, j)
    if (!p1) {
        p1 = new Cell(i, j)
        console.log(p1)
        p1.active()
        return;
    }
    if (p1.x === i && p1.y === j) {

        p1 = null
        p2 = null
        return;
    } else {
        p2 = new Cell(i, j)
        console.log(p2)
        p2.active()

    }
    if (p1 && p2 && bord[p1.x][p1.y] === bord[p2.x][p2.y]) {
        BFS(p1, p2)
    }
    checkDone = false
    p1 = null
    p2 = null
}
const BFS = (p1, p2) => {
    let visited = []
    bord.map(tmp => {
        let r = []
        tmp.map(tmp2 => {
            r.push(0)
        })
        visited.push(r)
    })
    let queue = []
    console.table(visited)
    queue.push(p1)
    while (queue.length !== 0) {
        let item = queue.shift()
        let moveX = [0, 0, 1, -1]
        let moveY = [1, -1, 0, 0]
        for (let i = 0; i < moveY.length; i++) {
            let pointTmp = new Cell(item.x + moveX[i], item.y + moveY[i])
            if (checkInside(pointTmp)) {
                if (bord[pointTmp.x][pointTmp.y] === 0 && visited[pointTmp.x][pointTmp.y] === 0) {
                    queue.push(pointTmp)
                    visited[pointTmp.x][pointTmp.y] = item
                }
                if (pointTmp.equals(p2)) {
                    visited[pointTmp.x][pointTmp.y] = item
                    console.log("Thanh cong")
                    findRsBFS(visited, p1, p2)
                }
            }
        }
    }
    console.log(queue)
    console.table(visited)
}
const findRsBFS = (bfs, start, end) => {
    let rs = [end]
    if (bfs[end.x][end.y] === 0) {
        console.log("Khong co duong di")
        return;
    }
    j = end;
    while (!bfs[j.x][j.y].equals(start)) {
        j = bfs[j.x][j.y]
        rs.push(j)
    }
    rs.push(start)
    console.log(rs)
    let cheap = countCheap(rs)
    if (cheap.size <= 3 && !checkDone) {
        checkDone = true
        console.log("Path: ", countCheap(rs))
        drawLine(rs, cheap)

    }
}
const drawLine = (arr, cheap) => {

    for (let i = 0; i < arr.length; i++) {
        if (i + 1 < arr.length) {
            if (arr[i].y === arr[i + 1].y) {
                if (arr[i].x > arr[i + 1].x) {
                    arr[i].drawLine("R")
                } else {
                    arr[i].drawLine("L")
                }
            }
        } else {
            if (arr[i].y === arr[i - 1].y) {
                if (arr[i].x > arr[i - 1].x) {
                    arr[i].drawLine("L")
                } else {
                    arr[i].drawLine("R")
                }
            }
            if (arr[i].x === arr[i - 1].x) {
                if (arr[i].y > arr[i - 1].y) {
                    arr[i].drawLine("B")
                } else {
                    arr[i].drawLine("T")
                }
            }
        }
    }
    setTimeout(() => {
        deleteItem(arr)
    }, 200)

}
const deleteItem = (arr) => {
    arr.map(tmp => {
        tmp.clear()
        bord[tmp.x][tmp.y] = 0
    })
    drawBord()

}

const checkInside = (point) => {
    if (point.x >= 0 && point.x < COL && point.y >= 0 && point.y < ROW) {
        return true
    } else {
        return false
    }
}


const countCheap = (arr) => {
    if (arr.length === 1) {
        return 99
    }
    let type = "Y"
    let start = arr[0]
    let tg = arr[1]
    if (start.x === tg.x) type = "X"
    let count = 0
    mapPath = new Map()
    mapPath.set(count, (mapPath.get(count) ? [...mapPath.get(count), start, tg] : [start, tg]))

    for (let i = 2; i < arr.length; i++) {
        if (type === "X") {
            if (arr[i].y === tg.y && arr[i].x !== tg.x) {
                count++
                type = "Y"
                // console.log(arr[i])
            }
            start = tg
            tg = arr[i]
        } else {
            if (arr[i].x === tg.x && arr[i].y !== tg.y) {
                count++
                type = "X"
                // console.log(arr[i], tg)

            }
            start = tg
            tg = arr[i]
        }
        mapPath.set(count, (mapPath.get(count) ? [...mapPath.get(count), arr[i]] : [arr[i]]))
    }

    return mapPath
}