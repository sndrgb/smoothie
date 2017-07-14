/**
 * smoothie v0.0.1
 * Copyright (c) 2017 Alessandro Rigobello
 * MIT License
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["smoothie"] = factory();
	else
		root["smoothie"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classie__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_classie__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_dom_create_element__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_dom_create_element___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_dom_create_element__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prefix__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prefix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prefix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dom_events__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dom_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_dom_events__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hijack__ = __webpack_require__(12);







class Smoothie {
    constructor(opt = {}) {
        this.createBound();

        this.options = opt;

        this.prefix = __WEBPACK_IMPORTED_MODULE_2_prefix___default()('transform');
        this.rAF = undefined;

        /* It seems that under heavy load, Firefox will still call the RAF callback even though the
        RAF has been canceled
        To prevent that we set a flag to prevent any callback to be executed when RAF is removed */
        this.isRAFCanceled = false;

        const constructorName = this.constructor.name ? this.constructor.name : 'Smoothie';
        this.extends = constructorName !== 'Smoothie';

        this.vars = {
            direction: this.options.direction || 'vertical',
            native: this.options.native || false,
            ease: this.options.ease || 0.075,
            preload: this.options.preload || false,
            current: 0,
            target: 0,
            height: window.innerHeight,
            width: window.innerWidth,
            bounding: 0,
            timer: null,
            ticking: false
        };

        this.hijack = this.vars.native ? null : new __WEBPACK_IMPORTED_MODULE_4__hijack__["a" /* default */]({
            limitInertia: this.options.vs && this.options.vs.limitInertia || false,
            mouseMultiplier: this.options.vs && this.options.vs.mouseMultiplier || 1,
            touchMultiplier: this.options.vs && this.options.vs.touchMultiplier || 1.5,
            firefoxMultiplier: this.options.vs && this.options.vs.firefoxMultiplier || 30,
            preventTouch: this.options.vs && this.options.vs.preventTouch || true
        });

        this.dom = {
            listener: this.options.listener || document.body,
            section: this.options.section || document.querySelector('.smoothie') || null,
            scrollbar: this.vars.native || this.options.noscrollbar ? null : {
                state: {
                    clicked: false,
                    x: 0
                },
                el: __WEBPACK_IMPORTED_MODULE_1_dom_create_element___default()({ selector: 'div', styles: `vs-scrollbar vs-${this.vars.direction} vs-scrollbar-${constructorName.toLowerCase()}` }),
                drag: {
                    el: __WEBPACK_IMPORTED_MODULE_1_dom_create_element___default()({ selector: 'div', styles: 'vs-scrolldrag' }),
                    delta: 0,
                    height: 50
                }
            }
        };
    }

    createBound() {
        ['run', 'calc', 'debounce', 'resize', 'mouseUp', 'mouseDown', 'mouseMove', 'calcScroll', 'scrollTo'].forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }

    init() {
        this.addClasses();

        this.vars.preload && this.preloadImages();
        this.vars.native ? this.addFakeScrollHeight() : !this.options.noscrollbar && this.addFakeScrollBar();

        this.addEvents();
        this.resize();
    }

    addClasses() {
        const type = this.vars.native ? 'native' : 'virtual';
        const direction = this.vars.direction === 'vertical' ? 'y' : 'x';

        __WEBPACK_IMPORTED_MODULE_0_classie___default.a.add(this.dom.listener, `is-${type}-scroll`);
        __WEBPACK_IMPORTED_MODULE_0_classie___default.a.add(this.dom.listener, `${direction}-scroll`);
    }

    preloadImages() {
        const images = Array.prototype.slice.call(this.dom.listener.querySelectorAll('img'), 0);

        images.forEach(image => {
            const img = document.createElement('img');

            __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.once(img, 'load', () => {
                images.splice(images.indexOf(image), 1);
                images.length === 0 && this.resize();
            });

            img.src = image.getAttribute('src');
        });
    }

    calc(e) {
        const delta = this.vars.direction === 'horizontal' ? e.deltaX : e.deltaY;

        this.vars.target += delta * -1;
        this.clampTarget();

        console.log(this.vars.bounding, delta);
    }

    debounce() {
        const win = this.dom.listener === document.body;

        this.vars.target = this.vars.direction === 'vertical' ? win ? window.scrollY || window.pageYOffset : this.dom.listener.scrollTop : win ? window.scrollX || window.pageXOffset : this.dom.listener.scrollLeft;

        clearTimeout(this.vars.timer);

        if (!this.vars.ticking) {
            this.vars.ticking = true;
            __WEBPACK_IMPORTED_MODULE_0_classie___default.a.add(this.dom.listener, 'is-scrolling');
        }

        this.vars.timer = setTimeout(() => {
            this.vars.ticking = false;
            __WEBPACK_IMPORTED_MODULE_0_classie___default.a.remove(this.dom.listener, 'is-scrolling');
        }, 200);
    }

    run() {
        if (this.isRAFCanceled) return;

        this.vars.current += (this.vars.target - this.vars.current) * this.vars.ease;
        this.vars.current < 0.1 && (this.vars.current = 0);

        this.rAF = requestAnimationFrame(this.run);

        if (!this.extends) {
            this.dom.section.style[this.prefix] = this.getTransform(-this.vars.current.toFixed(2));
        }

        if (!this.vars.native && !this.options.noscrollbar) {
            const size = this.dom.scrollbar.drag.height;
            const bounds = this.vars.direction === 'vertical' ? this.vars.height : this.vars.width;
            const value = Math.abs(this.vars.current) / (this.vars.bounding / (bounds - size)) + size / 0.5 - size;
            const clamp = Math.max(0, Math.min(value - size, value + size));

            this.dom.scrollbar.drag.el.style[this.prefix] = this.getTransform(clamp.toFixed(2));
        }
    }

    getTransform(value) {
        return this.vars.direction === 'vertical' ? 'translate3d(0,' + value + 'px,0)' : 'translate3d(' + value + 'px,0,0)';
    }

    on(requestAnimationFrame = true) {
        if (this.isRAFCanceled) {
            this.isRAFCanceled = false;
        }

        const node = this.dom.listener === document.body ? window : this.dom.listener;
        // this.vars.native ? event.on(node, 'scroll', this.debounce) : (this.hijack && this.hijack.on(this.calc));
        this.hijack.on(this.calc);

        requestAnimationFrame && this.requestAnimationFrame();
    }

    off(cancelAnimationFrame = true) {
        const node = this.dom.listener === document.body ? window : this.dom.listener;

        this.vars.native ? __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.off(node, 'scroll', this.debounce) : this.hijack && this.hijack.off(this.calc);

        cancelAnimationFrame && this.cancelAnimationFrame();
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
        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.on(window, 'resize', this.resize);
    }

    removeEvents() {
        this.off();

        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.off(window, 'resize', this.resize);
    }

    addFakeScrollBar() {
        this.dom.listener.appendChild(this.dom.scrollbar.el);
        this.dom.scrollbar.el.appendChild(this.dom.scrollbar.drag.el);

        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.on(this.dom.scrollbar.el, 'click', this.calcScroll);
        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.on(this.dom.scrollbar.el, 'mousedown', this.mouseDown);

        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.on(document, 'mousemove', this.mouseMove);
        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.on(document, 'mouseup', this.mouseUp);
    }

    removeFakeScrollBar() {
        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.off(this.dom.scrollbar.el, 'click', this.calcScroll);
        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.off(this.dom.scrollbar.el, 'mousedown', this.mouseDown);

        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.off(document, 'mousemove', this.mouseMove);
        __WEBPACK_IMPORTED_MODULE_3_dom_events___default.a.off(document, 'mouseup', this.mouseUp);

        this.dom.listener.removeChild(this.dom.scrollbar.el);
    }

    mouseDown(e) {
        e.preventDefault();
        e.which === 1 && (this.dom.scrollbar.state.clicked = true);
    }

    mouseUp(e) {
        this.dom.scrollbar.state.clicked = false;
        __WEBPACK_IMPORTED_MODULE_0_classie___default.a.remove(this.dom.listener, 'is-dragging');
    }

    mouseMove(e) {
        this.dom.scrollbar.state.clicked && this.calcScroll(e);
    }

    addFakeScrollHeight() {
        this.dom.scroll = __WEBPACK_IMPORTED_MODULE_1_dom_create_element___default()({
            selector: 'div',
            styles: 'vs-scroll-view'
        });

        this.dom.listener.appendChild(this.dom.scroll);
    }

    removeFakeScrollHeight() {
        this.dom.listener.removeChild(this.dom.scroll);
    }

    calcScroll(e) {
        const client = this.vars.direction === 'vertical' ? e.clientY : e.clientX;
        const bounds = this.vars.direction === 'vertical' ? this.vars.height : this.vars.width;
        const delta = client * (this.vars.bounding / bounds);

        __WEBPACK_IMPORTED_MODULE_0_classie___default.a.add(this.dom.listener, 'is-dragging');

        this.vars.target = delta;
        this.clampTarget();
        this.dom.scrollbar && (this.dom.scrollbar.drag.delta = this.vars.target);
    }

    scrollTo(offset) {
        if (this.vars.native) {
            this.vars.direction === 'vertical' ? window.scrollTo(0, offset) : window.scrollTo(offset, 0);
        } else {
            this.vars.target = offset;
            this.clampTarget();
        }
    }

    resize() {
        const prop = this.vars.direction === 'vertical' ? 'height' : 'width';

        this.vars.height = window.innerHeight;
        this.vars.width = window.innerWidth;

        if (!this.extends) {
            const bounding = this.dom.section.getBoundingClientRect();
            this.vars.bounding = this.vars.direction === 'vertical' ? bounding.height - (this.vars.native ? 0 : this.vars.height) : bounding.right - (this.vars.native ? 0 : this.vars.width);
            console.log(bounding.height, this.vars.height);
        }

        if (!this.vars.native && !this.options.noscrollbar) {
            this.dom.scrollbar.drag.height = this.vars.height * (this.vars.height / (this.vars.bounding + this.vars.height));
            this.dom.scrollbar.drag.el.style[prop] = `${this.dom.scrollbar.drag.height}px`;
        } else if (this.vars.native) {
            this.dom.scroll.style[prop] = `${this.vars.bounding}px`;
        }

        !this.vars.native && this.clampTarget();
    }

    clampTarget() {
        this.vars.target = Math.round(Math.max(0, Math.min(this.vars.target, this.vars.bounding)));
    }

    destroy() {
        if (this.vars.native) {
            __WEBPACK_IMPORTED_MODULE_0_classie___default.a.remove(this.dom.listener, 'is-native-scroll');

            this.removeFakeScrollHeight();
        } else {
            __WEBPACK_IMPORTED_MODULE_0_classie___default.a.remove(this.dom.listener, 'is-virtual-scroll');

            !this.options.noscrollbar && this.removeFakeScrollBar();
        }

        this.vars.direction === 'vertical' ? __WEBPACK_IMPORTED_MODULE_0_classie___default.a.remove(this.dom.listener, 'y-scroll') : __WEBPACK_IMPORTED_MODULE_0_classie___default.a.remove(this.dom.listener, 'x-scroll');
        this.vars.current = 0;
        this.hijack && (this.hijack.destroy(), this.hijack = null);

        this.removeEvents();
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Smoothie);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * classie
 * http://github.amexpub.com/modules/classie
 *
 * Copyright (c) 2013 AmexPub. All rights reserved.
 */

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */


// class helper functions from bonzo https://github.com/ded/bonzo
var classList = __webpack_require__(5),
    classie;

function classReg(className) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

function noop() {}

function isArr(classes) {
    if (Array.isArray(classes)) {
        return true;
    } else if (Object.prototype.toString.call(classes) === '[object Array]') {
        return true;
    } else {
        return false;
    }
}

function removeMultiple() {
    var c = arguments[1],
        elem = arguments[0];
    c.forEach(function(value) {
        if (classie.has(elem, value)) {
            noop();
        }
        classie.removeClass(elem, value);
    });
}


function addMultiple() {
    var c = arguments[1],
        elem = arguments[0];
    c.forEach(function(value) {
        if (classie.has(elem, value)) {
            noop();
        }
        classie.addClass(elem, value);
    });
}

function hasClass(elem, c) {
    return elem.classList.contains(c);
}

function addClass(elem, c) {
    if (isArr(c)) {
        addMultiple.apply(this, arguments);
    } else {
        elem.classList.add(c);
    }
}

function removeClass(elem, c) {
    if (isArr(c)) {
        removeMultiple.apply(this, arguments);
    } else {
        elem.classList.remove(c);
    }
}

function toggleClass(elem, c) {
    var fn = hasClass(elem, c) ? removeClass : addClass;
    fn(elem, c);
}

var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
};

// transport

if (typeof module === "object" && module && typeof module.exports === "object") {
    // commonjs / browserify
    module.exports = classie;
} else {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (classie),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/* 
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException, DOMTokenList */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

    // Full polyfill for browsers with no classList support
    if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

        (function(view) {

            "use strict";

            if (!('Element' in view)) {
                return;
            }

            var classListProp = "classList",
                protoProp = "prototype",
                elemCtrProto = view.Element[protoProp],
                objCtr = Object,
                strTrim = String[protoProp].trim || function() {
                    return this.replace(/^\s+|\s+$/g, "");
                }, arrIndexOf = Array[protoProp].indexOf || function(item) {
                    var
                    i = 0,
                        len = this.length;
                    for (; i < len; i++) {
                        if (i in this && this[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                },
                // Vendors: please allow content code to instantiate DOMExceptions
                DOMEx = function(type, message) {
                    this.name = type;
                    this.code = DOMException[type];
                    this.message = message;
                }, checkTokenAndGetIndex = function(classList, token) {
                    if (token === "") {
                        throw new DOMEx(
                            "SYNTAX_ERR", "An invalid or illegal string was specified");
                    }
                    if (/\s/.test(token)) {
                        throw new DOMEx(
                            "INVALID_CHARACTER_ERR", "String contains an invalid character");
                    }
                    return arrIndexOf.call(classList, token);
                }, ClassList = function(elem) {
                    var
                    trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                        classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                        i = 0,
                        len = classes.length;
                    for (; i < len; i++) {
                        this.push(classes[i]);
                    }
                    this._updateClassName = function() {
                        elem.setAttribute("class", this.toString());
                    };
                }, classListProto = ClassList[protoProp] = [],
                classListGetter = function() {
                    return new ClassList(this);
                };
            // Most DOMException implementations don't allow calling DOMException's toString()
            // on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function(i) {
                return this[i] || null;
            };
            classListProto.contains = function(token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function() {
                var
                tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token, updated = false;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function() {
                var
                tokens = arguments,
                    i = 0,
                    l = tokens.length,
                    token, updated = false,
                    index;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function(token, force) {
                token += "";

                var
                result = this.contains(token),
                    method = result ?
                        force !== true && "remove" :
                        force !== false && "add";

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.toString = function() {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter,
                    enumerable: true,
                    configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    if (ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));

    } else {
        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.

        (function() {
            "use strict";

            var testElement = document.createElement("_");

            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function(token) {
                        var i, len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function(token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };

            }

            testElement = null;
        }());
    }

}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/*
`dom-create-element`

var create = require('dom-create-element');

var el = create({
  selector: 'div',
  styles: 'preloader',
  html: '<span>Text</span>'
});
*/

module.exports = create;

function create(opt) {

	opt = opt || {};
	
	var el = document.createElement(opt.selector);
	
	if(opt.attr) for(var index in opt.attr)
		opt.attr.hasOwnProperty(index) && el.setAttribute(index, opt.attr[index]);
	
	"a" == opt.selector && opt.link && (
		el.href = opt.link,
		opt.target && el.setAttribute("target", opt.target)
	);

	"img" == opt.selector && opt.src && (
		el.src = opt.src,
		opt.lazyload && (
			el.style.opacity = 0,
			el.onload = function(){
				el.style.opacity = 1;
			}
		)
	);

	opt.id && (el.id = opt.id);
	opt.styles && (el.className = opt.styles);

	opt.html && (el.innerHTML = opt.html);
	opt.children && (el.appendChild(opt.children));
	
	return el;
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// check document first so it doesn't error in node.js
var style = typeof document != 'undefined'
  ? document.createElement('p').style
  : {}

var prefixes = ['O', 'ms', 'Moz', 'Webkit']
var upper = /([A-Z])/g
var memo = {}

/**
 * prefix `key`
 *
 *   prefix('transform') // => WebkitTransform
 *
 * @param {String} key
 * @return {String}
 * @api public
 */
function prefix(key){
  // Camel case
  key = key.replace(/-([a-z])/g, function(_, char){
    return char.toUpperCase()
  })

  // Without prefix
  if (style[key] !== undefined) return key

  // With prefix
  var Key = key.charAt(0).toUpperCase() + key.slice(1)
  var i = prefixes.length
  while (i--) {
    var name = prefixes[i] + Key
    if (style[name] !== undefined) return name
  }

  return key
}

/**
 * Memoized version of `prefix`
 *
 * @param {String} key
 * @return {String}
 * @api public
 */
function prefixMemozied(key){
  return key in memo
    ? memo[key]
    : memo[key] = prefix(key)
}

/**
 * Create a dashed prefix
 *
 * @param {String} key
 * @return {String}
 * @api public
 */
function prefixDashed(key){
  key = prefix(key)
  if (upper.test(key)) {
    key = '-' + key.replace(upper, '-$1')
    upper.lastIndex = 0
  }
  return key.toLowerCase()
}

module.exports = prefixMemozied
module.exports.dash = prefixDashed


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


var synth = __webpack_require__(9);

var on = function(element, name, fn, capture) {
    return element.addEventListener(name, fn, capture || false);
};

var off = function(element, name, fn, capture) {
    return element.removeEventListener(name, fn, capture || false);
};

var once = function (element, name, fn, capture) {
    function tmp (ev) {
        off(element, name, tmp, capture);
        fn(ev);
    }
    on(element, name, tmp, capture);
};

var emit = function(element, name, opt) {
    var ev = synth(name, opt);
    element.dispatchEvent(ev);
};

if (!document.addEventListener) {
    on = function(element, name, fn) {
        return element.attachEvent('on' + name, fn);
    };
}

if (!document.removeEventListener) {
    off = function(element, name, fn) {
        return element.detachEvent('on' + name, fn);
    };
}

if (!document.dispatchEvent) {
    emit = function(element, name, opt) {
        var ev = synth(name, opt);
        return element.fireEvent('on' + ev.type, ev);
    };
}

module.exports = {
    on: on,
    off: off,
    once: once,
    emit: emit
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {


// for compression
var win = window;
var doc = document || {};
var root = doc.documentElement || {};

// detect if we need to use firefox KeyEvents vs KeyboardEvents
var use_key_event = true;
try {
    doc.createEvent('KeyEvents');
}
catch (err) {
    use_key_event = false;
}

// Workaround for https://bugs.webkit.org/show_bug.cgi?id=16735
function check_kb(ev, opts) {
    if (ev.ctrlKey != (opts.ctrlKey || false) ||
        ev.altKey != (opts.altKey || false) ||
        ev.shiftKey != (opts.shiftKey || false) ||
        ev.metaKey != (opts.metaKey || false) ||
        ev.keyCode != (opts.keyCode || 0) ||
        ev.charCode != (opts.charCode || 0)) {

        ev = document.createEvent('Event');
        ev.initEvent(opts.type, opts.bubbles, opts.cancelable);
        ev.ctrlKey  = opts.ctrlKey || false;
        ev.altKey   = opts.altKey || false;
        ev.shiftKey = opts.shiftKey || false;
        ev.metaKey  = opts.metaKey || false;
        ev.keyCode  = opts.keyCode || 0;
        ev.charCode = opts.charCode || 0;
    }

    return ev;
}

// modern browsers, do a proper dispatchEvent()
var modern = function(type, opts) {
    opts = opts || {};

    // which init fn do we use
    var family = typeOf(type);
    var init_fam = family;
    if (family === 'KeyboardEvent' && use_key_event) {
        family = 'KeyEvents';
        init_fam = 'KeyEvent';
    }

    var ev = doc.createEvent(family);
    var init_fn = 'init' + init_fam;
    var init = typeof ev[init_fn] === 'function' ? init_fn : 'initEvent';

    var sig = initSignatures[init];
    var args = [];
    var used = {};

    opts.type = type;
    for (var i = 0; i < sig.length; ++i) {
        var key = sig[i];
        var val = opts[key];
        // if no user specified value, then use event default
        if (val === undefined) {
            val = ev[key];
        }
        used[key] = true;
        args.push(val);
    }
    ev[init].apply(ev, args);

    // webkit key event issue workaround
    if (family === 'KeyboardEvent') {
        ev = check_kb(ev, opts);
    }

    // attach remaining unused options to the object
    for (var key in opts) {
        if (!used[key]) {
            ev[key] = opts[key];
        }
    }

    return ev;
};

var legacy = function (type, opts) {
    opts = opts || {};
    var ev = doc.createEventObject();

    ev.type = type;
    for (var key in opts) {
        if (opts[key] !== undefined) {
            ev[key] = opts[key];
        }
    }

    return ev;
};

// expose either the modern version of event generation or legacy
// depending on what we support
// avoids if statements in the code later
module.exports = doc.createEvent ? modern : legacy;

var initSignatures = __webpack_require__(10);
var types = __webpack_require__(11);
var typeOf = (function () {
    var typs = {};
    for (var key in types) {
        var ts = types[key];
        for (var i = 0; i < ts.length; i++) {
            typs[ts[i]] = key;
        }
    }

    return function (name) {
        return typs[name] || 'Event';
    };
})();


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
	"initEvent": [
		"type",
		"bubbles",
		"cancelable"
	],
	"initUIEvent": [
		"type",
		"bubbles",
		"cancelable",
		"view",
		"detail"
	],
	"initMouseEvent": [
		"type",
		"bubbles",
		"cancelable",
		"view",
		"detail",
		"screenX",
		"screenY",
		"clientX",
		"clientY",
		"ctrlKey",
		"altKey",
		"shiftKey",
		"metaKey",
		"button",
		"relatedTarget"
	],
	"initMutationEvent": [
		"type",
		"bubbles",
		"cancelable",
		"relatedNode",
		"prevValue",
		"newValue",
		"attrName",
		"attrChange"
	],
	"initKeyboardEvent": [
		"type",
		"bubbles",
		"cancelable",
		"view",
		"ctrlKey",
		"altKey",
		"shiftKey",
		"metaKey",
		"keyCode",
		"charCode"
	],
	"initKeyEvent": [
		"type",
		"bubbles",
		"cancelable",
		"view",
		"ctrlKey",
		"altKey",
		"shiftKey",
		"metaKey",
		"keyCode",
		"charCode"
	]
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = {
	"MouseEvent": [
		"click",
		"mousedown",
		"mouseup",
		"mouseover",
		"mousemove",
		"mouseout"
	],
	"KeyboardEvent": [
		"keydown",
		"keyup",
		"keypress"
	],
	"MutationEvent": [
		"DOMSubtreeModified",
		"DOMNodeInserted",
		"DOMNodeRemoved",
		"DOMNodeRemovedFromDocument",
		"DOMNodeInsertedIntoDocument",
		"DOMAttrModified",
		"DOMCharacterDataModified"
	],
	"HTMLEvents": [
		"load",
		"unload",
		"abort",
		"error",
		"select",
		"change",
		"submit",
		"reset",
		"focus",
		"blur",
		"resize",
		"scroll"
	],
	"UIEvent": [
		"DOMFocusIn",
		"DOMFocusOut",
		"DOMActivate"
	]
};

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tiny_emitter__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tiny_emitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tiny_emitter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lethargy__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lethargy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lethargy__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_support__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_support___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__utils_support__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_clone__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_bindAll__ = __webpack_require__(17);







const eventId = 'hijack';
const keyCodes = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32 };

class Hijack {
    constructor(options) {
        Object(__WEBPACK_IMPORTED_MODULE_4__utils_bindAll__["a" /* default */])(this, ['onWheel', 'onMouseWheel', 'onTouchStart', 'onTouchMove', 'onKeyDown']);

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

        if (this.options.limitInertia) this.lethargy = new __WEBPACK_IMPORTED_MODULE_1_lethargy___default.a();

        this.emitter = new __WEBPACK_IMPORTED_MODULE_0_tiny_emitter___default.a();
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

    notify(e) {
        const evt = this.event;
        evt.x += evt.deltaX;
        evt.y += evt.deltaY;

        this.emitter.emit('blabla');

        this.emitter.emit(eventId, {
            x: evt.x,
            y: evt.y,
            deltaX: evt.deltaX,
            deltaY: evt.deltaY,
            originalEvent: e
        });
    }

    onWheel(e) {
        const options = this.options;
        if (this.lethargy && this.lethargy.check(e) === false) return;
        const evt = this.event;

        // In Chrome and in Firefox (at least the new one)
        evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
        evt.deltaY = e.wheelDeltaY || e.deltaY * -1;

        // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
        // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.isFirefox && e.deltaMode === 1) {
            evt.deltaX *= options.firefoxMultiplier;
            evt.deltaY *= options.firefoxMultiplier;
        }

        evt.deltaX *= options.mouseMultiplier;
        evt.deltaY *= options.mouseMultiplier;
        this.notify(e);
    }

    onMouseWheel(e) {
        if (this.options.limitInertia && this.lethargy.check(e) === false) return;

        const evt = this.event;

        // In Safari, IE and in Chrome if 'wheel' isn't defined
        evt.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0;
        evt.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta;
        this.notify(e);
    }

    onTouchStart(e) {
        const t = e.targetTouches ? e.targetTouches[0] : e;
        this.touchStartX = t.pageX;
        this.touchStartY = t.pageY;
    }

    onTouchMove(e) {
        const options = this.options;

        if (options.preventTouch && !e.target.classList.contains(options.unpreventTouchClass)) {
            e.preventDefault();
        }

        const evt = this.event;
        const t = e.targetTouches ? e.targetTouches[0] : e;

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
            default:
                return;
        }

        this.notify(e);
    }

    bind() {
        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasWheelEvent) this.el.addEventListener('wheel', this.onWheel, this.listenerOptions);
        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasMouseWheelEvent) this.el.addEventListener('mousewheel', this.onMouseWheel, this.listenerOptions);

        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasTouch) {
            this.el.addEventListener('touchstart', this.onTouchStart, this.listenerOptions);
            this.el.addEventListener('touchmove', this.onTouchMove, this.listenerOptions);
        }

        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasPointer && __WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasTouchWin) {
            this.bodyTouchAction = document.body.style.msTouchAction;
            document.body.style.msTouchAction = 'none';
            this.el.addEventListener('MSPointerDown', this.onTouchStart, true);
            this.el.addEventListener('MSPointerMove', this.onTouchMove, true);
        }

        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasKeyDown) document.addEventListener('keydown', this.onKeyDown);
    }

    unbind() {
        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasWheelEvent) this.el.removeEventListener('wheel', this.onWheel);
        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasMouseWheelEvent) this.el.removeEventListener('mousewheel', this.onMouseWheel);

        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasTouch) {
            this.el.removeEventListener('touchstart', this.onTouchStart);
            this.el.removeEventListener('touchmove', this.onTouchMove);
        }

        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasPointer && __WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasTouchWin) {
            document.body.style.msTouchAction = this.bodyTouchAction;
            this.el.removeEventListener('MSPointerDown', this.onTouchStart, true);
            this.el.removeEventListener('MSPointerMove', this.onTouchMove, true);
        }

        if (__WEBPACK_IMPORTED_MODULE_2__utils_support___default.a.hasKeyDown) document.removeEventListener('keydown', this.onKeyDown);
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

/* harmony default export */ __webpack_exports__["a"] = (Hijack);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.9.2
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Lethargy = (function() {
    function Lethargy(stability, sensitivity, tolerance, delay) {
      this.stability = stability != null ? Math.abs(stability) : 8;
      this.sensitivity = sensitivity != null ? 1 + Math.abs(sensitivity) : 100;
      this.tolerance = tolerance != null ? 1 + Math.abs(tolerance) : 1.1;
      this.delay = delay != null ? delay : 150;
      this.lastUpDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.lastDownDeltas = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
      this.deltasTimestamp = (function() {
        var i, ref, results;
        results = [];
        for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
          results.push(null);
        }
        return results;
      }).call(this);
    }

    Lethargy.prototype.check = function(e) {
      var lastDelta;
      e = e.originalEvent || e;
      if (e.wheelDelta != null) {
        lastDelta = e.wheelDelta;
      } else if (e.deltaY != null) {
        lastDelta = e.deltaY * -40;
      } else if ((e.detail != null) || e.detail === 0) {
        lastDelta = e.detail * -40;
      }
      this.deltasTimestamp.push(Date.now());
      this.deltasTimestamp.shift();
      if (lastDelta > 0) {
        this.lastUpDeltas.push(lastDelta);
        this.lastUpDeltas.shift();
        return this.isInertia(1);
      } else {
        this.lastDownDeltas.push(lastDelta);
        this.lastDownDeltas.shift();
        return this.isInertia(-1);
      }
      return false;
    };

    Lethargy.prototype.isInertia = function(direction) {
      var lastDeltas, lastDeltasNew, lastDeltasOld, newAverage, newSum, oldAverage, oldSum;
      lastDeltas = direction === -1 ? this.lastDownDeltas : this.lastUpDeltas;
      if (lastDeltas[0] === null) {
        return direction;
      }
      if (this.deltasTimestamp[(this.stability * 2) - 2] + this.delay > Date.now() && lastDeltas[0] === lastDeltas[(this.stability * 2) - 1]) {
        return false;
      }
      lastDeltasOld = lastDeltas.slice(0, this.stability);
      lastDeltasNew = lastDeltas.slice(this.stability, this.stability * 2);
      oldSum = lastDeltasOld.reduce(function(t, s) {
        return t + s;
      });
      newSum = lastDeltasNew.reduce(function(t, s) {
        return t + s;
      });
      oldAverage = oldSum / lastDeltasOld.length;
      newAverage = newSum / lastDeltasNew.length;
      if (Math.abs(oldAverage) < Math.abs(newAverage * this.tolerance) && (this.sensitivity < Math.abs(newAverage))) {
        return direction;
      } else {
        return false;
      }
    };

    Lethargy.prototype.showLastUpDeltas = function() {
      return this.lastUpDeltas;
    };

    Lethargy.prototype.showLastDownDeltas = function() {
      return this.lastDownDeltas;
    };

    return Lethargy;

  })();

}).call(this);


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function getSupport() {
    return {
        hasWheelEvent: 'onwheel' in document,
        hasMouseWheelEvent: 'onmousewheel' in document,
        hasTouch: 'ontouchstart' in document,
        hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
        hasPointer: !!window.navigator.msPointerEnabled,
        hasKeyDown: 'onkeydown' in document,
        isFirefox: navigator.userAgent.indexOf('Firefox') > -1
    };
}();

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = (function (source) {
    return JSON.parse(JSON.stringify(source));
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const bindAll = (ctx, methods) => {
    methods.forEach(m => {
        ctx[m] = ctx[m].bind(ctx);
    });
};

/* harmony default export */ __webpack_exports__["a"] = (bindAll);

/***/ })
/******/ ]);
});