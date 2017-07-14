const defaults = {
    vars: {
        direction: 'vertical',
        ease: 0.075,
        current: 0,
        target: 0,
        height: window.innerHeight,
        width: window.innerWidth,
        bounding: 0,
        timer: null,
        ticking: false
    },

    vs: {
        limitInertia: false,
        mouseMultiplier: 1,
        touchMultiplier: 1.5,
        firefoxMultiplier: 30,
        preventTouch: true,
    },

    dom: {
        listener: document.body,
        section: document.querySelector('.smoothie'),
    }
};

export default defaults;
