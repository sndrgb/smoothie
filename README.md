<p align="center">
  <a href="https://github.com/sndrgb/smoothie">
    <img width="150" src="https://raw.githubusercontent.com/sndrgb/smoothie/master/smoothie.png">
  </a>
  <p align="center">Smooth fake scrollbar for your `awesome` projects</p>
</p>

Inspired and written on top of smooth-scrolling by Baptiste Briel and VirtualScroll by Florian Morel

### Usage

Init your Smoothie with `new Smoothie(options)` with the following options (if you want):
```
direction: 'vertical',
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

- `instance.init()`
Life comes here!

- `instance.update()`
Update the instance with new bounds.

- `instance.on()`
Listen to the scroll.

- `instance.off()`
Remove the listener.

- `instance.destroy()`
Will remove all events and unbind the DOM listeners.

Events note:
Each instance will listen only once to any DOM listener. These listener are enabled/disabled automatically. However, it's a good practice to always call `destroy()` on your Smoothie instance, especially if you are working with a SPA.

### Todo
- High priority: Unit and E2E tests

### License
MIT.
