var checkDone = false
const QUANTITY_CELL = 34
const SIZE = 45
var COL = 8
var ROW = 8
var WIDTH = COL * SIZE
var HEIGHT = ROW * SIZE
var LEVEL = 0
var onSound = true
var intervalCountDown
const timeInit = 6 * 60
var sec = timeInit
var totalSec = sec
var bord = []
var canvas = document.getElementById("canvas");
canvas.width = WIDTH
canvas.height = HEIGHT
var ctx = canvas.getContext("2d");
//Sự kiên click để chọn cell
canvas.addEventListener('click', function (e) {
    let left = canvas.getBoundingClientRect().left
    let top = canvas.getBoundingClientRect().top
    let x = Math.floor((e.clientX - left) / SIZE)
    let y = Math.floor((e.clientY - top) / SIZE)
    check(x, y)
},);

//Hiện thị thanh thời gian
function progress(timeleft, timetotal, element) {
    var progressBarWidth = timeleft * element.offsetWidth / timetotal;
    element.querySelector('div.bar').style.width = progressBarWidth + "px"


}

//Đếm ngược thời gian
const countDown = () => {
    return setInterval(() => {
        sec = sec - 1
        if (sec === 0) {
            playAudio("audio/lost.mp3")
            clearInterval(intervalCountDown)
            document.querySelector("#game__over").style.display = "flex"
        }
        progress(sec, totalSec, document.querySelector("#progressBar"));
    }, 1000)
}
//Kiểm tra level để dồn các cell theo từng cấp 
const fiterLevel = (rs) => {
    console.log(LEVEL)
    let arrMoveLevelX = [0, 1, -1, 0, 0]
    let arrMoveLevelY = [0, 0, 0, 1, -1]
    switch (LEVEL) {
        case 1:
            for (let i = 1; i < bord.length - 1; i++) {
                for (let j = 1; j < bord[i].length - 1; j++) {
                    if (bord[i][j] === 0) {
                        let cell = new Cell(i + arrMoveLevelX[LEVEL], j + arrMoveLevelY[LEVEL])
                        if (bord[cell.x][cell.y] === 0) {
                            cell = new Cell(cell.x + arrMoveLevelX[LEVEL], cell.y + arrMoveLevelY[LEVEL])
                        }
                        if (checkInside(cell)) {
                            console.log(cell)
                            bord[i][j] = bord[cell.x][cell.y]
                            bord[cell.x][cell.y] = 0
                            new Cell(i, j).init()
                            cell.init()
                        }

                    }
                }
            }
            break;
        case 2:
            for (let i = bord.length - 2; i >= 1; i--) {
                for (let j = bord[i].length - 2; j >= 1; j--) {
                    if (bord[i][j] === 0) {
                        let cell = new Cell(i + arrMoveLevelX[LEVEL], j + arrMoveLevelY[LEVEL])
                        if (bord[cell.x][cell.y] === 0) {
                            cell = new Cell(cell.x + arrMoveLevelX[LEVEL], cell.y + arrMoveLevelY[LEVEL])
                        }
                        if (checkInside(cell)) {
                            console.log(cell)
                            bord[i][j] = bord[cell.x][cell.y]
                            bord[cell.x][cell.y] = 0
                            new Cell(i, j).init()
                            cell.init()
                        }
                    }
                }
            }

            break;
        case 3:
            for (let i = bord.length - 2; i >= 1; i--) {
                for (let j = 1; j < bord[i].length - 1; j++) {
                    if (bord[i][j] === 0) {
                        let cell = new Cell(i + arrMoveLevelX[LEVEL], j + arrMoveLevelY[LEVEL])
                        if (bord[cell.x][cell.y] === 0) {
                            cell = new Cell(cell.x + arrMoveLevelX[LEVEL], cell.y + arrMoveLevelY[LEVEL])
                        }
                        if (checkInside(cell)) {
                            console.log(cell)
                            bord[i][j] = bord[cell.x][cell.y]
                            bord[cell.x][cell.y] = 0
                            new Cell(i, j).init()
                            cell.init()
                        }
                    }
                }
            }

            break;
        case 4:
            for (let i = 0; i < rs.length; i++) {
                console.log();
                let arr = bord[rs[i].x].slice(1, -1)

                bord[rs[i].x] = [0, ...moveZerosToTop(arr), 0]
                console.log(bord[rs[i].x]);
            }
            drawBord()

            break;
        case 5:
            for (let i = 0; i < rs.length; i++) {
                let arr = bord[rs[i].x].slice(1, -1)
                let arrTop = []
                let arrEnd = []
                for (let i = 0; i <= Math.floor(arr.length / 2) - 1; i++) {
                    arrTop.push(arr[i]);
                }
                for (let i = Math.floor(arr.length / 2); i < arr.length; i++) {
                    arrEnd.push(arr[i]);
                }
                arrTop = moveZerosToTop(arrTop)
                arrEnd = moveZerosToEnd(arrEnd)

                bord[rs[i].x] = [0, ...arrTop, ...arrEnd, 0]
            }
            drawBord()

            break;
        default:
            break;

    }

}

function moveZerosToEnd(array) {
    let newArr = [];
    let count = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] !== 0) {
            newArr.push(array[i]);
        } else {
            count++;
        }
    }

    for (let i = 0; i < count; i++) {
        newArr.push(0);
    }

    return newArr;
}

function moveZerosToTop(arr) {


    let zeroes = [];
    let nonZeroes = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
            zeroes.push(arr[i]);
        } else {
            nonZeroes.push(arr[i]);
        }
    }

    return zeroes.concat(nonZeroes);

}

class Cell {

    constructor(x, y) {
        this.x = x
        this.y = y

    }

    //Vẽ cell
    init() {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        if (bord[this.x][this.y] !== 0) {
            let img = new Image()
            img.src = `img/cell/pokemon-${bord[this.x][this.y]}-2.jpg`
            img.width = SIZE
            img.height = SIZE
            img.onload = function () {
                draw(this)
            };
            let draw = (img) => {
                ctx.drawImage(img, this.x * SIZE, this.y * SIZE, SIZE, SIZE);
                ctx.strokeRect(this.x * SIZE + 0.5, this.y * SIZE + 0.5, SIZE - 1, SIZE - 1)
            }
        } else {
            ctx.clearRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
        }

    }

    //Xóa cell
    clear() {
        ctx.clearRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
    }

    //Tạo viền khi chọn cell
    active() {
        ctx.beginPath();
        ctx.lineWidth = 0.5
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.x * SIZE + 3, this.y * SIZE + 3, SIZE - 5, SIZE - 5)
    }

    //Vẽ các đường cho cell
    drawLine(type) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.beginPath();

        if (type === "L") {
            console.log(type)
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE) + SIZE, (this.y * SIZE) + (SIZE / 2));
        }
        if (type === "R") {
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE), (this.y * SIZE) + (SIZE / 2));
        }
        if (type === "T") {
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + SIZE);
        }
        if (type === "B") {
            ctx.moveTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE) + (SIZE / 2));
            ctx.lineTo((this.x * SIZE) + (SIZE / 2), (this.y * SIZE));
        }

        ctx.stroke()
    }

    //Kiểm tra 2 cell giống nhau không
    equals(that) {
        if (this.x === that.x && this.y === that.y) return true
        return false
    }
}

//Khởi tạo các cell
const startGame = () => {
    document.querySelector("#score").textContent = 0
    quantityRandom = 10
    document.querySelector(".quantityRandom").textContent = " " + quantityRandom
    document.querySelector("#quantityRand").setAttribute("value", quantityRandom)
    if (LEVEL === 0) {
        COL = 8
        ROW = 8
    }
    if (LEVEL > 1 && LEVEL <= 3) {
        COL = 10
        ROW = 10
    }
    if (LEVEL > 3) {
        COL = 12
        ROW = 12
    }
    WIDTH = COL * SIZE
    HEIGHT = ROW * SIZE
    canvas.width = WIDTH
    canvas.height = HEIGHT
    bord = []
    for (let i = 0; i < ROW; i++) {
        let rI = []
        for (let j = 0; j < COL; j++) {
            if (i === 0 || i === ROW - 1) {
                rI.push(0)
            } else {
                if (j === 0 || j === COL - 1) {
                    rI.push(0)
                } else {
                    rI.push(-1)
                }
            }
        }
        bord.push(rI)

    }
    for (let i = 1; i < bord.length - 1; i++) {
        for (let j = 1; j < bord[i].length - 1; j++) {
            if (bord[i][j] === -1) {
                let iRandom = Math.floor(Math.random() * bord.length);
                let jRandom = Math.floor(Math.random() * bord[i].length);
                while (bord[iRandom][jRandom] !== -1 || (iRandom === i && jRandom === j)) {
                    iRandom = Math.floor(Math.random() * (bord.length));
                    jRandom = Math.floor(Math.random() * (bord[i].length));
                }
                let rdImg = Math.floor(Math.random() * QUANTITY_CELL) + 1
                bord[i][j] = rdImg
                bord[iRandom][jRandom] = rdImg
            }
        }
    }

}
//Vẽ tất cả các cell
const drawBord = () => {
    for (let i = 1; i < bord.length - 1; i++) {
        for (let j = 1; j < bord[i].length - 1; j++) {

        }
    }
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            new Cell(i, j).init()
        }
    }

}

function playAudio(url) {
    if (onSound)
        new Audio(url).play();
}

var p1;
var p2;
//Tiền kiểm cho 2 cell trước khi tìm đường đi
const check = (i, j) => {
    if (bord[i][j] === 0) return
    if (!p1) {
        p1 = new Cell(i, j)
        console.log(p1, bord[p1.x][p1.y]);
        playAudio("audio/click.mp3")
        p1.active()
        return;
    }
    if (p1.x === i && p1.y === j) {
        playAudio("audio/click.mp3")

        p1.init()
        p1 = null
        p2 = null

        return;
    } else {
        p2 = new Cell(i, j)
        playAudio("audio/click.mp3")

        p2.active()

    }
    console.log("Check: ", p1, bord[p1.x][p1.y], ":", p2, bord[p1.x][p1.y])
    if (p1 && p2 && bord[p1.x][p1.y] === bord[p2.x][p2.y]) {
        if (p1.x < p2.x) {
            let tg = p1
            p1 = p2
            p2 = tg
        }
        BFS(p1, p2)
    } else {
        playAudio("audio/thatbai.mp3")

        p1.init()
        p2.init()

    }
    checkDone = false

    p1 = null
    p2 = null
}
//Tìm đường đi dùng thuật toán duyệt đồ thị theo chiều rộng
const BFS = (p1, p2) => {
    console.log("Chay")
    let visited = []
    bord.map(tmp => {
        let r = []
        tmp.map(tmp2 => {
            r.push(0)
        })
        visited.push(r)
    })
    let queue = []
    queue.push(p1)
    while (queue.length !== 0) {
        let item = queue.shift()
        let moveX = [0, 0, 1, -1,]
        let moveY = [1, -1, 0, 0,]
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
    if (!checkDone) {
        playAudio("audio/thatbai.mp3")
        p1.init()
        p2.init()
    }
}
//Kiểm tra đường đi thỏa điểu kiện có tối đa 2 nút 
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
    let cheap = countCheap(rs)
    console.log("Size Path: ", cheap.size)
    if (cheap.size <= 3 && !checkDone) {
        checkDone = true
        console.log("Path: ", cheap)
        drawPath(rs, cheap)
        if (bord[start.x][start.y] === 31) {

            if (sec + 20 >= timeInit) {
                sec = timeInit
            } else {
                sec = sec + 20
            }
        } else {
            document.querySelector("#score").textContent = Number(document.querySelector("#score").textContent) + 10
        }
    }

}
//Vẽ đường thẳng nối 2 nút
const drawLine = (arr) => {
    if (arr[0].y === arr[arr.length - 1].y) {
        pMin = arr[0]
        pMax = arr[arr.length - 1]
        if (pMin.x < pMax.x) {
            pMin = arr[arr.length - 1]
            pMax = arr[0]
        }
        pMin.drawLine("R")
        pMax.drawLine("L")
        for (let i = 1; i < arr.length - 1; i++) {
            arr[i].drawLine("L")
            arr[i].drawLine("R")
        }
    }
    if (arr[0].x === arr[arr.length - 1].x) {
        pMin = arr[0]
        pMax = arr[arr.length - 1]
        if (pMin.y < pMax.y) {
            pMin = arr[arr.length - 1]
            pMax = arr[0]
        }
        pMin.drawLine("B")
        pMax.drawLine("T")
        for (let i = 1; i < arr.length - 1; i++) {
            arr[i].drawLine("T")
            arr[i].drawLine("B")
        }
    }
}
//Vẽ đường đi
const drawPath = (arr, cheap) => {
    playAudio("audio/thanhcong.mp3")

    console.log("----------------------------");
    let arrCell = Array.from(cheap, ([name, value]) => ({name, value}));
    for (let i = 0; i < arrCell.length; i++) {
        let arrCellOfLine = arrCell[i].value
        if (i !== 0) {
            arrCellOfLine = [arrCell[i - 1].value[arrCell[i - 1].value.length - 1], ...arrCellOfLine]
        }
        drawLine(arrCellOfLine)
    }

    setTimeout(() => {
        deleteItem(arr)
    }, 200)

}
//Xóa nút khi vẽ xong đường đi
const deleteItem = (arr) => {

    arr.map(tmp => {
        bord[tmp.x][tmp.y] = 0
        tmp.clear()
    })
    if (checkWin()) {
        playAudio("audio/win.mp3")
        clearInterval(intervalCountDown)
        progress(0, timeInit, document.querySelector("#progressBar"))
        if (LEVEL === 5) {
            document.querySelector(".next_level").style.display = 'none'
            document.querySelector("#youwin h1").textContent = "YOU WIN ALL LEVEL"
            document.querySelector("#youwin").style.display = "flex"

        } else {
            document.querySelector(".next_level").textContent = "LEVEL " + (LEVEL + 2)
            document.querySelector("#youwin").style.display = "flex"
            document.querySelector(".next_level").style.display = "block"
            document.querySelector("#youwin h1").textContent = "YOU WIN"
        }


    }
    console.table(bord)

    fiterLevel(arr)
}
//Kiểm tra điểm đó có namgwf trong ma trận ko 
const checkInside = (point) => {
    if (point.x >= 0 && point.x < COL && point.y >= 0 && point.y < ROW) {
        return true
    } else {
        return false
    }
}

// Tính số nút của đường đi 
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
//Kiểm tra chiến thắng
const checkWin = () => {
    for (let i = 0; i < bord.length; i++) {
        for (let j = 0; j < bord[i].length; j++) {
            if (bord[i][j] !== 0) return false
        }
    }
    return true
}
//Đảo vị trí các cell 
const shuffleArray = array => {
    for (let i = 1; i < array.length - 1; i++) {
        for (let j = 1; j < array[i].length - 1; j++) {
            console.log(array[i][j]);
            if (array[i][j] != 0) {
                let iRandom = Math.floor(Math.random() * array.length);
                let jRandom = Math.floor(Math.random() * array[i].length);

                while (array[iRandom][jRandom] === 0) {
                    console.log(array[iRandom][jRandom]);
                    iRandom = Math.floor(Math.random() * array.length);
                    jRandom = Math.floor(Math.random() * array[i].length);
                }
                let temp = array[i][j]
                array[i][j] = array[iRandom][jRandom]
                array[iRandom][jRandom] = temp;
            }
        }
    }

}
var quantityRandom = 10
//Tạo sự kiện click chuột cho các button tương ứng
document.querySelector(".quantityRandom").textContent = " " + quantityRandom
document.querySelector("#quantityRand").setAttribute("value", quantityRandom)
document.querySelector("#random").addEventListener("click", () => {
    if (Number(document.querySelector("#quantityRand").value) > 0) {
        quantityRandom--
        shuffleArray(bord)
        drawBord()
        document.querySelector(".quantityRandom").textContent = (quantityRandom < 10 ? " 0" + quantityRandom : " " + quantityRandom)
        document.querySelector("#quantityRand").value = quantityRandom
    } else {
        alert("Hết lượt đổi !!!")
    }

})

document.querySelector(".pasue").addEventListener("click", () => {
    document.querySelector("#pasue").style.display = "flex"
    clearInterval(intervalCountDown)
})
document.querySelector(".continue").addEventListener("click", () => {
    document.querySelector("#pasue").style.display = "none"
    intervalCountDown = countDown()
})

document.querySelector(".play__again").addEventListener('click', function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    LEVEL = Number(document.querySelector("#level").value)
    sec = timeInit - (LEVEL * 30)
    totalSec = sec
    intervalCountDown = countDown()
    document.querySelector(".menu_game").style.display = "none"
    startGame()
    drawBord()
    document.querySelector("#game__over").style.display = "none"

},);
document.querySelectorAll(".openMenu").forEach(tmp => {
    tmp.addEventListener('click', () => {
        clearInterval(intervalCountDown)
        progress(0, timeInit, document.querySelector("#progressBar"))
        document.querySelector(".menu_game").style.display = "flex"
        document.querySelector("#game__over").style.display = "none"
        document.querySelector("#youwin").style.display = "none"


    })
})
document.querySelector("#start").addEventListener('click', () => {
    sec = timeInit - (LEVEL * 30)
    totalSec = sec

    intervalCountDown = countDown()
    document.querySelector(".menu_game").style.display = "none"
    LEVEL = Number(document.querySelector("#level").value)
    console.log(LEVEL);
    startGame()
    drawBord()

})

document.querySelector(".next_level").addEventListener('click', () => {
    quantityRandom = 10
    document.querySelector(".quantityRandom").textContent = " " + quantityRandom
    document.querySelector("#quantityRand").setAttribute("value", quantityRandom)
    LEVEL = LEVEL + 1
    sec = timeInit - (LEVEL * 30)
    totalSec = sec
    intervalCountDown = countDown()
    startGame()
    drawBord()
    document.querySelector("#youwin").style.display = "none"

})
document.querySelector(".sound").addEventListener('click', (e) => {
    onSound = !onSound
    if (!onSound) {
        e.target.style.backgroundColor = "yellow"
    } else {
        e.target.style.backgroundColor = "white"

    }
})