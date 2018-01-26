<p align="center">
  <a href="https://github.com/sndrgb/smoothie">
    <img width="150" src="https://raw.githubusercontent.com/sndrgb/smoothie/master/smoothie.png">
  </a>
  <p align="center">Smooth fake scrollbar for your `awesome` projects</p>
</p>

Inspired and written on top of smooth-scrolling by Baptiste Briel and VirtualScroll by Florian Morel

### Install
```
npm i smoothie-scroll --s
```

### Usage

Init your Smoothie with `new Smoothie(el, options)`  with el as smoothie wrapper

```
el: DOM element or DOM selector
```
and the following options (if you want)
```
orientation: 'vertical',
deltaX: true, || default: false (if you want horizontal scroll with side delta on mouse/trackpad)
ease: 0.075,
prefix: prefix('transform'),
listener: document.body,

vs: {
    limitInertia: false,
    mouseMultiplier: 1,
    touchMultiplier: 1.5,
    firefoxMultiplier: 30,
    preventTouch: true,
},
```

`vs` is options are for VirtualScroll utility

You can tween enter and exit of scrollbar using css classes:
`.is-entering` and `.is-leaving` on:
`.scrollbar-track`

### API
- `new Smoothie(options)`
Return a new instance of Smoothie. See the options below.

- `instance.init(: initial position :)`
Life comes here! 
Optional you can set initial position

- `instance.update()`
Update the instance with new bounds.

- `instance.on()`
Listen to the scroll.

- `instance.off()`
Remove the listener.

- `instance.destroy()`
Will remove all events and unbind the DOM listeners.

- `instance.setTo()`
Immediatly set position of your scrollbar.

Events note:
Each instance will listen only once to any DOM listener. These listener are enabled/disabled automatically. However, it's a good practice to always call `destroy()` on your Smoothie instance, especially if you are working with a SPA.

### Todo
- High priority: Unit and E2E tests

### License
MIT.
