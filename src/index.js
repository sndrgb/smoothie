import classie from 'classie';
import prefix from 'prefix';
import create from 'dom-create-element';
import event from 'dom-events';

import Hijack from './hijack';
import Scrollbar from './scrollbar';
import defaults from './default-options';

class Smoothie {
    constructor(opt = {}) {
        this.createBound();

        this.options = opt;

        this.prefix = prefix('transform');
        this.rAF = undefined;
        this.isRAFCanceled = false;

        const constructorName = this.constructor.name ? this.constructor.name : 'Smoothie';
        this.extends = constructorName !== 'Smoothie';
        this.vars = Object.assign({}, defaults.vars, this.options.vars);

        const hijackOptions = Object.assign({}, defaults.vs, this.options.vs);
        this.hijack = new Hijack(hijackOptions);

        const domOptions = {
            listener: this.options.listener,
            section: this.options.section
        };

        this.dom = Object.assign({}, domOptions, defaults.dom);
        this.dom.scrollbar = {
            state: {
                clicked: false,
                x: 0
            },
            el: create({
                selector: 'div',
                styles: `scrollbar-track scrollbar-${this.vars.direction} scrollbar-${constructorName.toLowerCase()}`
            }),
            drag: {
                el: create({
                    selector: 'div',
                    styles: 'scrollbar'
                }),
                delta: 0,
                height: 50
            }
        };
    }

    createBound() {
        ['run', 'calc', 'resize', 'mouseUp', 'mouseDown', 'mouseMove', 'calcScroll', 'scrollTo']
        .forEach((fn) => { this[fn] = this[fn].bind(this); });
    }

    init() {
        this.addClasses();

        console.log(ble);
        this.scrollbar = new Scrollbar();
        this.addScrollBar();


        this.addEvents();
        this.resize();
    }

    addClasses() {
        const direction = this.vars.direction === 'vertical' ? 'y' : 'x';

        classie.add(this.dom.listener, 'is-smoothed');
        classie.add(this.dom.listener, `${direction}-scroll`);
    }

    calc(e) {
        const delta = this.vars.direction === 'horizontal' ? e.deltaX : e.deltaY;

        this.vars.target += delta * -1;
        this.clampTarget();
    }

    run() {
        if (this.isRAFCanceled) return;

        this.vars.current += (this.vars.target - this.vars.current) * this.vars.ease;
        this.vars.current < 0.1 && (this.vars.current = 0);
        this.rAF = requestAnimationFrame(this.run);
        

        const position = this.vars.current.toFixed(2);
        window.smoothieTop = position;
        this.dom.section.style[this.prefix] = this.getTransform(-position);
        this.updateScrollbar();
    }

    getTransform(value) {
        return this.vars.direction === 'vertical' ? `translate3d(0, ${value}px, 0)` : `translate3d(${value}px,0,0)`;
    }

    on(requestAnimationFrame = true) {
        if (this.isRAFCanceled) this.isRAFCanceled = false;

        const node = this.dom.listener === document.body ? window : this.dom.listener;
        this.hijack.on(this.calc);

        if (requestAnimationFrame) this.requestAnimationFrame();
    }

    off(cancelAnimationFrame = true) {
        const node = this.dom.listener === document.body ? window : this.dom.listener;

        this.hijack.off(this.calc);
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
        this.on();
        event.on(window, 'resize', this.resize);
    }

    removeEvents() {
        this.off();
        event.off(window, 'resize', this.resize);
    }

    addScrollBar() {
        this.dom.listener.appendChild(this.dom.scrollbar.el);
        this.dom.scrollbar.el.appendChild(this.dom.scrollbar.drag.el);

        event.on(this.dom.scrollbar.el, 'click', this.calcScroll);
        event.on(this.dom.scrollbar.el, 'mousedown', this.mouseDown);

        event.on(document, 'mousemove', this.mouseMove);
        event.on(document, 'mouseup', this.mouseUp);
    }

    removeScrollBar() {
        event.off(this.dom.scrollbar.el, 'click', this.calcScroll);
        event.off(this.dom.scrollbar.el, 'mousedown', this.mouseDown);

        event.off(document, 'mousemove', this.mouseMove);
        event.off(document, 'mouseup', this.mouseUp);

        this.dom.listener.removeChild(this.dom.scrollbar.el);
    }

    mouseDown(e) {
        e.preventDefault();

        if (e.which === 1) this.dom.scrollbar.state.clicked = true;
    }

    mouseUp(e) {
        this.dom.scrollbar.state.clicked = false;
        classie.remove(this.dom.listener, 'is-dragging');
    }

    mouseMove(e) {
        this.dom.scrollbar.state.clicked && this.calcScroll(e);
    }

    calcScroll(e) {
        const client = this.vars.direction === 'vertical' ? e.clientY : e.clientX;
        const bounds = this.vars.direction === 'vertical' ? this.vars.height : this.vars.width;
        const delta = client * (this.vars.bounding / bounds);

        classie.add(this.dom.listener, 'is-dragging');

        this.vars.target = delta;
        this.clampTarget();
        this.dom.scrollbar && (this.dom.scrollbar.drag.delta = this.vars.target);
    }

    scrollTo(offset) {
        this.vars.target = offset;
        this.clampTarget();
    }

    resize() {
        const prop = this.vars.direction === 'vertical' ? 'height' : 'width';

        this.vars.height = window.innerHeight;
        this.vars.width = window.innerWidth;

        const bounding = this.dom.section.getBoundingClientRect();
        this.vars.bounding = this.vars.direction === 'vertical' ?
            bounding.height - this.vars.height :
            bounding.right - this.vars.width;

        this.dom.scrollbar.drag.height = this.vars.height * (this.vars.height / (this.vars.bounding + this.vars.height));
        this.dom.scrollbar.drag.el.style[prop] = `${this.dom.scrollbar.drag.height}px`;
        this.clampTarget();
    }

    clampTarget() {
        this.vars.target = Math.round(Math.max(0, Math.min(this.vars.target, this.vars.bounding)));
    }

    updateScrollbar() {
        const size = this.dom.scrollbar.drag.height;
        const bounds = this.vars.direction === 'vertical' ? this.vars.height : this.vars.width;
        const value = (Math.abs(this.vars.current) / (this.vars.bounding / (bounds - size))) + (size / 0.5) - size;
        const clamp = Math.max(0, Math.min(value - size, value + size));

        this.dom.scrollbar.drag.el.style[this.prefix] = this.getTransform(clamp.toFixed(2));
    }

    destroy() {
        classie.remove(this.dom.listener, 'is-smoothed');
        this.removeScrollBar();

        this.vars.direction === 'vertical' ? classie.remove(this.dom.listener, 'y-scroll') : classie.remove(this.dom.listener, 'x-scroll');
        this.vars.current = 0;
        this.hijack && (this.hijack.destroy(), this.hijack = null);

        this.removeEvents();
    }
}

export default Smoothie;
