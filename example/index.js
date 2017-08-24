const Smoothie = window.smoothie;

let smoothie;
let nested;
function init() {
    smoothie = new Smoothie('.smoothie', {
        listener: document.querySelector('.smoothie-container')
    });
    smoothie.init();

    nested = new Smoothie('.nested', {
        listener: document.querySelector('.nested-container')
    });
    nested.init();
    nested.stop();
}

init();

setTimeout(() => {
    const els = document.querySelectorAll('.el');

    smoothie.addListener((status) => {
        els.forEach((el) => {
            if (smoothie.inViewport(el)) {
                el.setAttribute('data-animated', '');
            } else {
                el.removeAttribute('data-animated');
            }
        });
    });
}, 3000);


let toggle = true;
const $switch = document.querySelector('#switch');
$switch.addEventListener('click', () => {
    toggle = !toggle;

    if (!toggle) {
        smoothie.stop();
        nested.start();
    } else {
        smoothie.start();
        nested.stop();
    }
});

let enable = true;
const $enabler = document.querySelector('#enable');
$enabler.addEventListener('click', () => {
    enable = !enable;

    if (!enable) {
        smoothie.destroy();
        nested.destroy();
    } else {
        init();
    }
});
