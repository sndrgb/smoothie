import classie from 'classie';
import create from 'dom-create-element';
import Component from './utils/component';

class Scrollbar extends Component {
    constructor(el, opts = {}) {
        super(el, opts);
    }

    init() {
        super.init();

        this.$els.drag = create({ selector: 'div', styles: 'scrollbar' });

        this.resize();
        this.addScrollBar();
    }

    get getInitialState() {
        return {
            height: 0,
            width: 0,
            delta: 0,
            clicked: false,
            x: 0
        };
    }

    resize() {
        const prop = this.options.direction === 'vertical' ? 'height' : 'width';
        this.dragHeight = this.getState('height') * (this.getState('height') / (this.getState('bounding') + this.getState('height')));
        this.$els.drag.style[prop] = `${this.dragHeight}px`;
    }

    addScrollBar() {
        this.options.listener.appendChild(this.$el);
        this.$el.appendChild(this.$els.drag);
    }

    removeScrollBar() {
        event.off(this.dom.scrollbar.el, 'click', this.calcScroll);
        event.off(this.dom.scrollbar.el, 'mousedown', this.mouseDown);

        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.mouseUp);

        this.dom.listener.removeChild(this.dom.scrollbar.el);
    }

    getTransform(value) {
        return this.options.direction === 'vertical' ? `translate3d(0, ${value}px, 0)` : `translate3d(${value}px,0,0)`;
    }

    update(current) {
        const size = this.dragHeight;
        const bounds = this.options.direction === 'vertical' ? this.getState('height') : this.options.width;
        const value = (Math.abs(current) / (this.getState('bounding') / (bounds - size))) + (size / 0.5) - size;
        const clamp = Math.max(0, Math.min(value - size, value + size));

        this.$els.drag.style[this.options.prefix] = this.getTransform(clamp.toFixed(2));
    }
}

export default Scrollbar;
