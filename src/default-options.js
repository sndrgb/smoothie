import prefix from 'prefix';

const defaults = {
    direction: 'vertical',
    ease: 0.075,
    bounding: 0,
    timer: null,
    ticking: false,
    prefix: prefix('transform'),
    listener: document.body,

    scrollbar: {
        dragHeight: 50,
    },

    vs: {
        limitInertia: false,
        mouseMultiplier: 1,
        touchMultiplier: 1.5,
        firefoxMultiplier: 30,
        preventTouch: true,
    },
};

export default defaults;
