import * as frame from './canvas_main'
import { gifEncoder } from './gifEncode'

const frames = {};
let fps = 10;

let idRange = 0;
document.getElementById('appendFrame').addEventListener('click', function() {
    const tmpCanvas = document.createElement('canvas');
    const label = document.createElement('label');
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = 512;
    frameCanvas.height = 512;
    tmpCanvas.width = 128;
    tmpCanvas.height = 128;
    tmpCanvas.id = `frame${idRange}`;
    label.for = `frame${idRange}`;
    label.innerHTML = `Layer ${idRange}  [x]`;
    const frameCtx = frameCanvas.getContext('2d');
    const tmpCtx = tmpCanvas.getContext('2d');
    frameCtx.drawImage(frame.canvas, 0,0);
    tmpCtx.drawImage(frame.canvas, 0,0,128,128);
    tmpCanvas.classList.add('frame');
    label.classList.add('frameLabel');
    const frameScope = document.querySelector('.frameScope');
    label.addEventListener('click', function() {
        delete frames[tmpCanvas.id];
        tmpCanvas.remove();
        idRange -= 1;
        label.remove();
        for (let i = 0; i < frameScope.children.length; i += 1) {
            if (frameScope.children[i].outerHTML.slice(1,6) === 'label') {
                let labelString = frameScope.children[i].innerHTML;
                if (labelString.match(/\d+/)[0] > label.innerHTML.match(/\d+/)[0]) {
                    const newStr = frameScope.children[i].innerHTML.replace(
                        /\d+/, parseInt(labelString.match(/\d+/)[0]) - 1
                        );
                    frameScope.children[i].innerHTML = newStr;
                }
            }
        }
        framesPreview(fps);
    })
    frameScope.append(label);
    frameScope.append(tmpCanvas);
    frames[tmpCanvas.id] = {frame: frameCtx, canvasMemory: JSON.parse(JSON.stringify(frame.canvasMemory))};
    idRange += 1;
    frame.canvas.getContext('2d').fillStyle = 'black';
    frame.initCanvas();
    frame.initCanvasMemory();
    framesPreview(fps);
})

function framesPreview(fps) {
    const preview = document.getElementById('canvasPreview');
    const framesQueue = [];
    for (let i in frames) {
        const frameCtx = frames[i].frame;
        framesQueue.push(frameCtx);
    }
    const gif = gifEncoder(fps, framesQueue);
    preview.src = gif;
    const downloadGifBtn = document.getElementById('downloadGif');
    downloadGifBtn.href = gif;
}

const fpsMeter = document.getElementById('fpsMeter');
fpsMeter.addEventListener('input', function() {
    const fpsIndicator = document.getElementById('fpsValue');
    fps = this.value;
    fpsIndicator.innerHTML = `${fps} FPS`;
})

fpsMeter.addEventListener('mouseup', function() {
    if (frames) {
        framesPreview(fps);
    }
})