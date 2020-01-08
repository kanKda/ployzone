const rightArrow = document.getElementById('rightArrow');
const leftArrow = document.getElementById('leftArrow');
const slider = document.getElementById('slider');

let maxTransform = slider.children.length * 100 - 100;
let transformCounter = 0;

function translate(direction) {
    if (Math.abs(transformCounter) === maxTransform && direction === 'right') {
        slider.style = `transform: translateX(0);`;
        transformCounter = 0;
        return;    
    }
    let translate;
    switch (direction) {
        case 'left': 
            if (transformCounter === 0) {
                return;
            } else {
                translate = 100;
            }
            break;
        case 'right': translate = -100; break;
    }
    transformCounter += translate;
    slider.style = `transform: translateX(${transformCounter}%);`;
}

rightArrow.onclick = () => translate('right');
leftArrow.onclick = () => translate('left');

console.log(maxTransform)