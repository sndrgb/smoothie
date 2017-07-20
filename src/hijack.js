import Emitter from 'tiny-emitter';
import { Lethargy } from 'lethargy';

import support from './utils/support';
import clone from './utils/clone';
import bindAll from './utils/bindAll';

const eventId = 'hijack';
const keyCodes = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32, PAGEUP: 33, PAGEDOWN: 34 };

class Hijack {
    constructor(options) {
        bindAll(this, ['onWheel', 'onMouseWheel', 'onTouchStart', 'onTouchMove', 'onKeyDown']);

        this.el = window;

        if (options && options.el) {
            this.el = options.el;
            delete options.el;
        }

        this.options = Object.assign({
            mouseMultiplier: 1,
            touchMultiplier: 2,
            firefoxMultiplier: 15,
            keyStep: 120,
            preventTouch: false,
            unpreventTouchClass: 'hijack-touchmove-allowed',
            limitInertia: false
        }, options);

        if (this.options.limitInertia) this.lethargy = new Lethargy();

        this.emitter = new Emitter();
        this.event = {
            y: 0,
            x: 0,
            deltaX: 0,
            deltaY: 0
        };
        this.touchStartX = null;
        this.touchStartY = null;
        this.bodyTouchAction = null;

        if (this.options.passive !== undefined) {
            this.listenerOptions = { passive: this.options.passive };
        }
    }

    init() {}

    notify(e) {
        const evt = this.event;
        evt.x += evt.deltaX;
        evt.y += evt.deltaY;

        console.log(eventId);

        this.emitter.emit(eventId, {
            x: evt.x,
            y: evt.y,
            deltaX: evt.deltaX,
            deltaY: evt.deltaY,
            originalEvent: e
        });
    }

    onWheel(e) {
        console.log(e.target);
        const options = this.options;
        if (this.lethargy && this.lethargy.check(e) === false) return;
        const evt = this.event;

        // In Chrome and in Firefox (at least the new one)
        evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
        evt.deltaY = e.wheelDeltaY || e.deltaY * -1;

        // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
        // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
        if (support.isFirefox && e.deltaMode === 1) {
            evt.deltaX *= options.firefoxMultiplier;
            evt.deltaY *= options.firefoxMultiplier;
        }

        evt.deltaX *= options.mouseMultiplier;
        evt.deltaY *= options.mouseMultiplier;
        this.notify(e);
    }

    onMouseWheel(e) {
        console.log(e.target);
        if (this.options.limitInertia && this.lethargy.check(e) === false) return;

        const evt = this.event;

        // In Safari, IE and in Chrome if 'wheel' isn't defined
        evt.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
        evt.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;
        this.notify(e);
    }

    onTouchStart(e) {
        const t = (e.targetTouches) ? e.targetTouches[0] : e;
        this.touchStartX = t.pageX;
        this.touchStartY = t.pageY;
    }

    onTouchMove(e) {
        const options = this.options;

        if (options.preventTouch
            && !e.target.classList.contains(options.unpreventTouchClass)) {
            e.preventDefault();
        }

        const evt = this.event;
        const t = (e.targetTouches) ? e.targetTouches[0] : e;

        evt.deltaX = (t.pageX - this.touchStartX) * options.touchMultiplier;
        evt.deltaY = (t.pageY - this.touchStartY) * options.touchMultiplier;

        this.touchStartX = t.pageX;
        this.touchStartY = t.pageY;

        this.notify(e);
    }

    onKeyDown(e) {
        const evt = this.event;
        const windowHeight = window.innerHeight - 40;

        evt.deltaX = 0;
        evt.deltaY = 0;

        switch (e.keyCode) {
        case keyCodes.LEFT:
        case keyCodes.UP:
            evt.deltaY = this.options.keyStep;
            break;
        case keyCodes.RIGHT:
        case keyCodes.DOWN:
            evt.deltaY = -this.options.keyStep;
            break;
        case keyCodes.SPACE && e.shiftKey:
            evt.deltaY = windowHeight;
            break;
        case keyCodes.SPACE:
            evt.deltaY = -windowHeight;
            break;
        case keyCodes.PAGEUP:
            evt.deltaY = this.options.keyStep * 4;
            break;
        case keyCodes.PAGEDOWN:
            evt.deltaY = -this.options.keyStep * 4;
            break;
        default:
            return;
        }

        this.notify(e);
    }

    bind() {
        if (support.hasWheelEvent) this.el.addEventListener('wheel', this.onWheel, this.listenerOptions);
        if (support.hasMouseWheelEvent) this.el.addEventListener('mousewheel', this.onMouseWheel, this.listenerOptions);

        if (support.hasTouch) {
            this.el.addEventListener('touchstart', this.onTouchStart, this.listenerOptions);
            this.el.addEventListener('touchmove', this.onTouchMove, this.listenerOptions);
        }

        if (support.hasPointer && support.hasTouchWin) {
            this.bodyTouchAction = document.body.style.msTouchAction;
            document.body.style.msTouchAction = 'none';
            this.el.addEventListener('MSPointerDown', this.onTouchStart, true);
            this.el.addEventListener('MSPointerMove', this.onTouchMove, true);
        }

        if (support.hasKeyDown) document.addEventListener('keydown', this.onKeyDown);
    }

    unbind() {
        if (support.hasWheelEvent) this.el.removeEventListener('wheel', this.onWheel);
        if (support.hasMouseWheelEvent) this.el.removeEventListener('mousewheel', this.onMouseWheel);

        if (support.hasTouch) {
            this.el.removeEventListener('touchstart', this.onTouchStart);
            this.el.removeEventListener('touchmove', this.onTouchMove);
        }

        if (support.hasPointer && support.hasTouchWin) {
            document.body.style.msTouchAction = this.bodyTouchAction;
            this.el.removeEventListener('MSPointerDown', this.onTouchStart, true);
            this.el.removeEventListener('MSPointerMove', this.onTouchMove, true);
        }

        if (support.hasKeyDown) document.removeEventListener('keydown', this.onKeyDown);
    }

    on(cb, ctx) {
        this.emitter.on(eventId, cb, ctx);

        const events = this.emitter.e;
        if (events && events[eventId] && events[eventId].length === 1) this.bind();
    }

    off(cb, ctx) {
        this.emitter.off(eventId, cb, ctx);

        const events = this.emitter.e;
        if (!events[eventId] || events[eventId].length <= 0) this.unbind();
    }

    reset() {
        const evt = this.event;
        evt.x = 0;
        evt.y = 0;
    }

    destroy() {
        this.emitter.off();
        this.unbind();
    }
}

export default Hijack;
