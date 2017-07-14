const Smoothie = window.smoothie;

class Custom extends Smoothie {
    constructor(opt = {}) {
        super(opt);
    }

    run() {
        super.run();

        const second = document.querySelector('#second');
        const bounding = second.getBoundingClientRect();
    }

    resize() {
        this.vars.bounding = this.dom.section.getBoundingClientRect().height - this.vars.height;
        super.resize();
    }
}

const smoothie = new Custom({});
smoothie.init();
