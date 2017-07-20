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

const smoothie = new Custom('.smoothie', {
    listener: document.querySelector('.smoothie-container')
});
smoothie.init();

const nested = new Smoothie('.nested', {
    listener: document.querySelector('.nested-container')
});
nested.init();
nested.off();

let toggle = true;
const button = document.querySelector('#switch');
button.addEventListener('click', () => {
    toggle = !toggle;

    if (!toggle) {
        smoothie.off();
        nested.on();
    } else {
        smoothie.on();
        nested.off();
    }
});
