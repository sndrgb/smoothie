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

const smoothie = new Custom('.smoothie', {});
smoothie.init();
