const dummy = document.createElement('div');
const eventNameHash = {
    webkit: 'webkitTransitionEnd',
    Moz: 'transitionend',
    O: 'oTransitionEnd',
    ms: 'MSTransitionEnd'
};

const transitionEnd = (() => {
    let retValue;
    let transitions
    retValue = 'transitionend';

    Object.keys(eventNameHash).some((vendor) => {
        if (`${vendor}TransitionProperty` in dummy.style) {
            retValue = eventNameHash[vendor];
            return true;
        }
    });

    return retValue;
})();

export default function (element, callback) {
    return element.addEventListener(transitionEnd, function eventend(event) {
        if (event.target && event.target !== event.currentTarget) return;

        element.removeEventListener(transitionEnd, eventend);
        callback(event);
    });
}
