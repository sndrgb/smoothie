import DOMEvents from 'events-mixin';
import isElement from 'lodash.isElement';
import merge from 'lodash.merge';

import { EventEmitter } from 'events';
import { nextUid } from './ui-manager';

class Component extends EventEmitter {
    constructor(el, options = { state: {} }) {
        super();
        this.setMaxListeners(0);

        this.el = this.$el = typeof el === 'string' ? document.querySelector(el) : el;

        if (!isElement(this.$el)) {
            // fail silently (kinda...);
            console.warn(`Element ${this.$el} is not a DOM element`);
            return this;
        }

        // DOM references
        this.$els = {};

        // sub components references
        this.$refs = {};

        this.options = merge(this.getDefaultOptions(), options);

        const domEvents = new DOMEvents(this.$el, this);
        this.delegate = (event, selector, fn) => domEvents.bind(event + (selector ? ' ' + selector : ''), fn);
        this.undelegate = () => domEvents.unbind(...arguments);

        this.state = new Map();
    }

    setRef(id, ComponentClass, ...opts) {
        const ref = ComponentClass instanceof Component ? ComponentClass : new ComponentClass(...opts);
        const prevRef = this.$refs[id];
        this.$refs[id] = ref;

        if (prevRef) {
            return prevRef.destroy().then(() => {
                if (this.$el.contains(prevRef.$el)) {
                    this.$el.replaceChild(ref.$el, prevRef.$el);
                } else {
                    this.$el.appendChild(ref.$el);
                }
                return ref.init();
            });
        }

        return Promise.resolve(ref.init());
    }

    init(state = {}) {
        // initialization placeholder
        if (this.$el.getAttribute('data-ui-uid')) {
            console.log(`Element ${this.$el.getAttribute('data-ui-uid')} is already created`, this.$el);
            return this;
        }

        this._uid = nextUid();
        this.$el.setAttribute('data-ui-uid', this._uid);

        if (!this.$el.id) {
            this.$el.id = `component${this._uid}`;
        }

        this.beforeInit();

        const stateEventsMap = this.bindStateEvents();
        Object.keys(stateEventsMap).forEach((key) => {
            this.on('change:' + key, stateEventsMap[key].bind(this));
        });

        const initialState = Object.assign({}, this.getInitialState(), state);
        Object.keys(initialState).forEach((key) => {
            this.setState(key, initialState[key]);
        });

        this._active = true;

        return this;
    }

    broadcast(event, ...params) {
        Object.keys(this.$refs).forEach((ref) => this.$refs[ref].emit('broadcast:' + event, ...params));
    }

    getState(key) {
        return this.state.get(key);
    }

    setState(key, newValue, silent = false) {
        const oldValue = this.state.get(key);
        if (oldValue !== newValue) {
            this.state.set(key, newValue);
            if (!silent) {
                this.emit('change:' + key, newValue, oldValue);
            }

            return newValue;
        }
    }

    bindStateEvents() {
        return {};
    }

    getPizza() {
        console.log('🍕 enjoy!');
    }

    getBomb() {
        console.log('💣  aaaaaaaaaa!');
    }

    getInitialState() {
        return {};
    }

    getDefaultOptions() {
        return {};
    }

    animationIn() {

    }

    beforeInit() {
    }

    closeRefs() {
        return Promise.all(Object.keys(this.$refs).map((ref) => {
            return this.$refs[ref].destroy();
        })).then(() => {
            this.$refs = {};
        }).catch((error) => {
            console.log('close refs', error);
        });
    }

    destroy() {
        this.emit('destroy');
        this.undelegate();
        this.removeAllListeners();
        this.$el.removeAttribute('data-ui-uid');

        return this.closeRefs().then(() => {
            this._active = false;
        }).catch((error) => {
            console.log('destroy catch: ', error);
        });
    }

}

export default Component;