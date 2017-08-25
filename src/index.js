import classie from 'classie';
import create from 'dom-create-element';
import prefix from 'prefix';

import Hijack from './hijack';
import Scrollbar from './scrollbar';
import Component from './utils/component';

class Smoothie extends Component {
    constructor(el = '.smoothie', opt = {}) {
        super(el, opt);

        this.createBound();
        this.rAF = undefined;
        this.isRAFCanceled = false;

        const constructorName = this.constructor.name ? this.constructor.name : 'Smoothie';
        this.extends = constructorName !== 'Smoothie';

        this.current = 0;
        this.target = 0;
    }

    get getInitialState() {
        return {
            height: window.innerHeight,
            width: window.innerWidth,
            currentItem: 0,
            isAnimating: false,
            emitEventOnScrolling: false,
        };
    }

    get getDefaultOptions() {
        return {
            direction: 'vertical',
            ease: 0.075,
            prefix: prefix('transform'),
            listener: document.body,

            vs: {
                limitInertia: false,
                mouseMultiplier: 1,
                touchMultiplier: 1.5,
                firefoxMultiplier: 30,
                preventTouch: true,
                listenToScroll: true,
            },
        };
    }

    createBound() {
        ['run', 'calc', 'resize', 'scrollTo', 'mouseUp', 'mouseDown', 'mouseMove', 'calcScroll', 'inViewport', 'addListener']
        .forEach((fn) => { this[fn] = this[fn].bind(this); });
    }

    addListener(callback) {
        this.setState('emitEventOnScrolling', true);

        this.on('scrolling', (stat) => {
            callback(stat);
        });
    }

    inViewport(el, index) {
        // if (!this.cache || this.resizing) return false;
        const bounding = el.getBoundingClientRect();
        const bounds = {
            top: bounding.top + this.current
        }
        const viewport = {};
        viewport.top = this.current;
        viewport.bottom = this.current + window.innerHeight;

        bounds.bottom = bounds.top + el.clientHeight;

        return (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom)
            || (bounds.top <= viewport.bottom && bounds.top >= viewport.top);
    }

    init() {
        super.init();

        this.addClasses();

        // starting hijacking
        this.setRef('hijack', Hijack, this.options.vs);


        // passing scrollbar track
        this.$els.scrollbar = create({
            selector: 'div',
            styles: `scrollbar-track scrollbar-${this.options.direction} is-entering`
        });
        this.setRef('scrollbar', Scrollbar, this.$els.scrollbar, this.options);

        this.resize();
        this.update = this.resize;
        this.addEvents();
    }

    addClasses() {
        const direction = this.options.direction === 'vertical' ? 'y' : 'x';

        classie.add(this.options.listener, 'is-smoothed');
        classie.add(this.options.listener, `${direction}-scroll`);
    }

    calc(e) {
        const delta = this.options.direction === 'horizontal' ? e.deltaX : e.deltaY;

        this.target += delta * -1;
        this.clampTarget();
    }

    run() {
        if (this.isRAFCanceled) return;

        this.current += (this.target - this.current) * this.options.ease;
        this.current < 0.1 && (this.current = 0);
        this.rAF = window.requestAnimationFrame(this.run);

        const position = this.current.toFixed(2);


        this.$el.style[this.options.prefix] = this.getTransform(-position);
        this.$refs.scrollbar.update(this.current);

        if (this.getState('emitEventOnScrolling')) {
            this.emit('scrolling', {
                current: this.current
            });
        }
    }

    getTransform(value) {
        return this.options.direction === 'vertical' ? `translate3d(0, ${value}px, 0)` : `translate3d(${value}px,0,0)`;
    }

    start(requestAnimationFrame = true) {
        if (this.isRAFCanceled) this.isRAFCanceled = false;

        const node = this.options.listener === document.body ? window : this.options.listener;
        this.$refs.hijack.on(this.calc);

        if (requestAnimationFrame) this.requestAnimationFrame();
    }

    stop(cancelAnimationFrame = true) {
        const node = this.options.listener === document.body ? window : this.options.listener;

        this.$refs.hijack.off(this.calc);
        if (cancelAnimationFrame) this.cancelAnimationFrame();
    }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.run);
    }

    cancelAnimationFrame() {
        this.isRAFCanceled = true;
        cancelAnimationFrame(this.rAF);
    }

    addEvents() {
        this.start();
        window.addEventListener('resize', this.resize);

        this.$refs.scrollbar.el.addEventListener('click', this.calcScroll);
        this.$refs.scrollbar.el.addEventListener('mousedown', this.mouseDown);

        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseUp);
    }

    removeEvents() {
        this.stop();
        window.removeEventListener('resize', this.resize);
    }

    scrollTo(offset) {
        this.target = offset;
        this.clampTarget();
    }

    resize() {
        const prop = this.options.direction === 'vertical' ? 'height' : 'width';

        const h = this.options.listener === document.body ?
            window.innerHeight : this.options.listener.clientHeight;
        const w = this.options.listener === document.body ?
            window.innerWidth : this.options.listener.clientWidth;

        this.setState('height', h);
        this.setState('width', w);
        this.$refs.scrollbar.setState('height', h);
        this.$refs.scrollbar.setState('width', w);

        const bounding = this.$el.getBoundingClientRect();
        const bounds = this.options.direction === 'vertical' ?
            bounding.height - this.getState('height') :
            bounding.right - this.getState('width');

        this.setState('bounding', bounds);
        this.$refs.scrollbar.setState('bounding', bounds);

        this.clampTarget();

        this.$refs.scrollbar.resize();
    }

    clampTarget() {
        this.target = Math.round(Math.max(0, Math.min(this.target, this.getState('bounding'))));
    }

    mouseDown(e) {
        e.preventDefault();

        if (e.which === 1) this.setState('clicked', true);
    }

    mouseUp(e) {
        this.setState('clicked', false);
        classie.remove(this.options.listener, 'is-dragging');
    }

    mouseMove(e) {
        if (this.getState('clicked')) this.calcScroll(e);
    }

    calcScroll(e) {
        const client = this.options.direction === 'vertical' ? e.clientY : e.clientX;
        const bounds = this.options.direction === 'vertical' ? this.getState('height') : this.getState('width');
        const delta = client * (this.getState('bounding') / bounds);

        classie.add(this.options.listener, 'is-dragging');

        this.target = delta;
        this.clampTarget();
        this.$refs.scrollbar.setState('delta', this.target);
    }

    destroy() {
        super.destroy();
        classie.remove(this.options.listener, 'is-smoothed');

        this.options.direction === 'vertical' ? classie.remove(this.options.listener, 'y-scroll') : classie.remove(this.options.listener, 'x-scroll');
        this.current = 0;

        this.removeEvents();
    }
}

export default Smoothie;
