<p align="center">
  <a href="https://github.com/sndrgb/smoothie">
    <img height="257" width="114" src="https://raw.githubusercontent.com/sndrgb/smoothie/master/smoothie.png">
  </a>
  <p align="center">Smooth fake scrollbar for your `awesome` projects</p>
</p>

=====
Inspired and written on top of smooth-scrolling by Baptiste Briel and VirtualScroll by Florian Morel

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

### License
MIT.
