const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvas_Side = 512;
[canvas.width, canvas.height] = [canvas_Side, canvas_Side];
ctx.fillStyle = 'black';
ctx.fillRect(0,0,canvas_Side,canvas_Side);
ctx.strokeStyle = 'black';
let canvas_Size = 32;
let squareUnit = canvas_Side / canvas_Size;
let penSize = 16;

function initCanvas() {
    ctx.fillRect(0,0,canvas_Side,canvas_Side);
}

initCanvas(ctx);

let toolFlag = 'pencil';
const tools = document.querySelector('.tools').children;
for (let i = 0; i < tools.length - 3; i += 1) {
    tools[i].addEventListener('click', function() {        
        this.classList.add('active');
        for (let j = 0; j < tools.length - 1; j += 1) {
            if (tools[j].id !== this.id) tools[j].classList.remove('active');
        }
        toolFlag = this.id;
    })
}

let colorFlag = 'yellow';

document.getElementById('currentCircle').addEventListener('click', function() {
    document.getElementById('colorInput').click();
})

document.getElementById('colorInput').addEventListener('input', function() {
    colorFlag = document.getElementById('colorInput').value;
    const tmp = document.getElementById('currentCircle').style.background;
    document.getElementById('currentCircle').style.background = colorFlag;
    document.getElementById('previousCircle').style.background = tmp;
})

document.getElementById('previousCircle').addEventListener('click', function() {
    const tmp = document.getElementById('currentCircle').style.background;
    document.getElementById('currentCircle').style.background = this.style.background;
    colorFlag = this.style.background;
    this.style.background = tmp;
})

const canvasMemory = [];

function initCanvasMemory() {
    for (let i = 0; i < canvas_Size; i += 1) {
        canvasMemory[i] = new Array(canvas_Size);
        for (let j = 0; j < canvas_Size; j += 1) {
            canvasMemory[i][j] = 'black';
        }
    } 
}

initCanvasMemory();

function canvasMemory_Fill(penSize, tmpX, tmpY, squareUnit, colorFlag) {
    let counterX = 0;
    let counterY = 0;
    let base = penSize / squareUnit;
    while(counterY != base) {
        canvasMemory[tmpY + counterY][tmpX + counterX] = colorFlag;
        counterX += 1;
        if (counterX == base) {
            counterX = 0;
            counterY += 1;
        }
    }
}

const penSizes = document.querySelector('.penSizes').children;
for (let i = 0; i < penSizes.length; i += 1) {
    penSizes[i].addEventListener('click', function() {
        this.classList.add('activeSizeUnit');
        for (let j = 0; j < penSizes.length; j += 1) {
            if (penSizes[j].id !== this.id) {
                penSizes[j].classList.remove('activeSizeUnit');
            }
        }
        penSize = this.id.match(/\d+/)[0];
        console.log(penSize);
    })
}

canvas.addEventListener('mousedown', function(event) {
    switch (toolFlag) {
        case 'pencil': pencil(event); break;
        case 'colorPick': colorPick(event); break;
        case 'eraser': eraser(event); break;
        case 'wand': wand(event); break;
        default: break;
    }
})

function pencil(event) {
    ctx.fillStyle = colorFlag;
    ctx.fillRect(
        Math.floor(event.offsetX / squareUnit) * squareUnit, 
        Math.floor(event.offsetY / squareUnit) * squareUnit, 
        penSize, penSize
    );
    canvasMemory_Fill(
        penSize, Math.floor(event.offsetX / squareUnit), Math.floor(event.offsetY / squareUnit), squareUnit, colorFlag
    );
    canvas.onmousemove = function(event) {
        ctx.fillRect(
            Math.floor(event.offsetX / squareUnit) * squareUnit, 
            Math.floor(event.offsetY / squareUnit) * squareUnit, 
            penSize, penSize
        );
        canvasMemory_Fill(
            penSize, Math.floor(event.offsetX / squareUnit), Math.floor(event.offsetY / squareUnit), squareUnit, colorFlag
        );
    }
}

function colorPick(event) {
    let canvasCoordX = Math.floor(event.offsetX / squareUnit);
    let canvasCoordY = Math.floor(event.offsetY / squareUnit);
    colorFlag = canvasMemory[canvasCoordY][canvasCoordX];
    const tmp = document.getElementById('currentCircle').style.background;
    document.getElementById('currentCircle').style.background = colorFlag;
    document.getElementById('previousCircle').style.background = tmp;
}

function eraser(event) {
    ctx.fillStyle = 'black';
    ctx.fillRect(
        Math.floor(event.offsetX / squareUnit) * squareUnit,
        Math.floor(event.offsetY / squareUnit) * squareUnit,
        penSize, penSize
    );
    canvas.onmousemove = function(event) {
        ctx.strokeRect(
            Math.floor(event.offsetX / squareUnit) * squareUnit, 
            Math.floor(event.offsetY / squareUnit) * squareUnit, 
            penSize, penSize
        );
        ctx.fillRect(
            Math.floor(event.offsetX / squareUnit) * squareUnit, 
            Math.floor(event.offsetY / squareUnit) * squareUnit, 
            penSize, penSize
        );
        canvasMemory_Fill(
            penSize, Math.floor(event.offsetX / squareUnit), Math.floor(event.offsetY / squareUnit), squareUnit, 'black'
        );
    }
}

function wand(event) {
    ctx.fillStyle = colorFlag;
    let canvasCoordX = Math.floor(event.offsetX / squareUnit);
    let canvasCoordY = Math.floor(event.offsetY / squareUnit);
    const wandTmpColor = canvasMemory[canvasCoordY][canvasCoordX];
    for (let i = 0; i < canvasMemory.length; i += 1) {
        for (let j = 0; j < canvasMemory[i].length; j += 1) {
            if (canvasMemory[i][j] === wandTmpColor) {
                canvasMemory[i][j] = colorFlag;
                ctx.fillRect(
                    j * squareUnit, 
                    i * squareUnit, 
                    squareUnit, squareUnit
                );
            }
        }
    }
}

canvas.addEventListener('mouseup', function() {
    canvas.onmousemove = null;
    ctx.fillStyle = colorFlag;
})

canvas.addEventListener('mouseout', function() {
    canvas.onmousemove = null;
})

export { canvasMemory, canvas, initCanvas, initCanvasMemory };