const Smoothie = window.smoothie;

class Custom extends Smoothie {
    constructor(el, opt = {}) {
        super(el, opt);
    }

    run() {
        super.run();

        const second = document.querySelector('#second');
        const bounding = second.getBoundingClientRect();
    }

    resize() {
        this.options.bounding = this.$el.getBoundingClientRect().height - this.height;
        super.resize();
    }
}

let smoothie;
let nested;
function init() {
    smoothie = new Custom('.smoothie', {
        listener: document.querySelector('.smoothie-container')
    });
    smoothie.init();

    nested = new Smoothie('.nested', {
        listener: document.querySelector('.nested-container')
    });
    nested.init();
    nested.off();
}

init();

let toggle = true;
const $switch = document.querySelector('#switch');
$switch.addEventListener('click', () => {
    toggle = !toggle;

    if (!toggle) {
        smoothie.off();
        nested.on();
    } else {
        smoothie.on();
        nested.off();
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
