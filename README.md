smoothie
=====

### Installation
```
npm i smoothie -S
```

### Usage & API
For in-depth usage and tutorial, you can check Bartek's article (link above).

- `new Smoothie(options)`
Return a new instance of Smoothie. See the options below.

- `instance.on(fn, context)`
Listen to the scroll event using the specified function (fn) and optional context.

- `instance.off(fn, context)`
Remove the listener.

- `instance.destroy()`
Will remove all events and unbind the DOM listeners.

Events note:
Each instance will listen only once to any DOM listener. These listener are enabled/disabled automatically. However, it's a good practice to always call `destroy()` on your Smoothie instance, especially if you are working with a SPA.

### Options
- el: the target element for mobile touch events. *Defaults to window.*
- mouseMultiplier: General multiplier for all mousewheel (including Firefox). *Default to 1.*
- touchMultiplier: Mutiply the touch action by this modifier to make scroll faster than finger movement. *Defaults to 2.*
- firefoxMultiplier: Firefox on Windows needs a boost, since scrolling is very slow. *Defaults to 15.*
- keyStep: How many pixels to move with each key press. *Defaults to 120.*
- preventTouch: If true, automatically call `e.preventDefault` on touchMove. *Defaults to false.*
- unpreventTouchClass: Elements with this class won't `preventDefault` on touchMove. For instance, useful for a scrolling text inside a Smoothie-controled element. *Defaults to `smoothie-touchmove-allowed`*.
- limitInertia: if true, will leverage [Lethargy](https://github.com/d4nyll/lethargy) to avoid everlasting scroll events (mostly on Apple Mouse, Trackpad, and free-wheel mouse). *Defaults to false.*
- passive: if used, will use [passive events declaration](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners) for the wheel and touch listeners. Can be true or false. *Defaults to undefined.*

### License
MIT.
