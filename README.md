#RadReveal
** a JavaScript library to help you create add-ons for [Reveal.js - the HTML Presentation Framework](http://lab.hakim.se/reveal-js/).**

<a href="http://joelarson4.github.io/radReveal/demo.html#/">Check out the demo slideshow</a> to get see how RadReveal works.

##Why isn't _everybody_ hacking Reveal.js?

[Reveal.js](http://lab.hakim.se/reveal-js/) rocks!  Web Developers seem to love Reveal.js, as evidenced by the fact that every other presentation on JavaScript seems to use it.  Personally, I love Reveal.js because it is hackable.

But not a lot of people customize or extend it -- despite the fact that Reveal.js builds in extensibility.  Or, if people are extending Reveal.js, they aren't sharing!

Maybe that's because, the out of the box, Reveal.js is not _easy_ to extend...

##The solution? RadReveal

I put together RadReveal after noticing that every presentation I was doing had some level of customization, and the types of things I was doing had a lot in common.  So I consolidated what I'd done into a simple to use library, RadReveal.

RadReveal provides these benefits.

* Makes customizing Reveal.js easy.
* Attach behaviors to slides using data attributes.
* Encourages small, shareable packages.

If you didn't already, <a href="http://joelarson4.github.io/radReveal/demo.html#/">take a look at the demo slideshow</a> to see RadReveal in action.

#How to create a RadReveal add-on

Note: I plan to write a lot more on this soon, including some skeleton example repos you can check out and use.

##Running the demo slideshow locally
To run the demo slideshow locally, simply:

    git clone https://github.com/joelarson4/radReveal.git
    cd radReveal
    npm install

Now you should be able to run demo.html in your browser.

Note that you may need to `sudo npm install` to get everything installed properly.

##API JsDoc for RadReveal

You may want to to skip to [the API documentation for the library](https://github.com/joelarson4/radReveal/blob/master/radReveal.md).

##Simple example

What does an add-on look like?

`example.js` - the addon script

```javascript
var RadReveal = require('rad-reveal');

RadReveal.register({
  name: 'example',
  initialize: function(radConfig, slides) {
    for(var s = 0, len = slides.length; s < len; s++) {
      slides[s].className += ' ' + radConfig.addClass;
    }
  }
});
```

`index.html` modifications for initializing RadReveal and Reveal.js

```html
<script src="node_modules/reveal.js/lib/js/head.min.js"></script>
<script src="node_modules/reveal.js/js/reveal.js"></script>
<script src="node_modules/rad-reveal/build/radReveal.min.js"></script>
```
```javascript
RadReveal.initialize({ //replace Reveal.initialize w/ RadReveal.initialize
  ...normal Reveal configuration goes here
  dependencies: [
    { 
      src: 'somepath/example.js', 
      radName: 'example',
      radConfig: { addClass: 'example' } 
    }
    ...other plugins go here
  ]
});
...
```

So what happens when you run this?

1. `RadReveal.initialize` calls `Reveal.initialize` for you, passing in the configuration.
2. `Reveal.initialize` loads dependencies, including `rad-example.js`.
3. The example add-on registers itself with an `initialize` function.
4. After Reveal is initialized, RadReveal triggers example's `initialize` function.
5. When calling `initialize`, RadReveal passes in the `radConfig` value and all slides defined.
6. `example` add-on does whatever it wants to.  In this example, the add-on appends a class `example` to every slide.

##Beyond initialize

You can run your code only for certain slides with an attribute by using `attributeEventListeners`.

```javascript
RadReveal.register({
  name: 'example',
  attributeEventListeners: {
    'data-rad-example': {
      setup: someFunction
    }
  }
});
```

Each slide with the `data-rad-example` attribute will have `someFunction` called after RadReveal initialization completes. 

The listener function is called with four arguments:

* `attrVal` - the value of the attribute for this slide.
* `slideObj` - an object representing the slide.
* `event` - the event object.
* `radEventName` - the name of the event.

You could use this to do something to the slide element itself.  For example, we could add a class based on the value of the attribute.

```javascript
function addTheClass(attrVal, slideObj, event, radEventName) {
  slideObj.element.className += ' ' + attrVal;
}

RadReveal.register({
  name: 'example',
  attributeEventListeners: {
    'data-rad-example': {
      setup: addTheClass
    }
  }
});
```

So, this slide:

```html
<section data-rad-example="totallyRad">
```

would end up having an additional class of `totallyRad` added to it:

```html
<section data-rad-example="totallyRad" class="totallyRad">
```
    
which is a silly example but illustrates the point.

##Trigger something upon showing/hiding a slide

You can also register to run something on showing/arriving or hiding/leaving a slide with an attribute.

```javascript
RadReveal.register({
  name: 'example',
  attributeEventListeners: {
    'data-rad-example': {
      shown: anotherFunction,
      hidden: andAnotherFunction
    }
  }
});
```

This means that `anotherFunction` will run each time a slide is displayed with a `data-rad-example` attribute, and then when you leave that slide `andAnotherFunction` will run.



##The functionRunner example add-on.

The core RadReveal repo includes `functionRunner`, a simple add-on that triggers a function to run for any slide with a `data-rad-functionrunner-{eventName}` attribute. 
There is also [API documentation for functionRunner](https://github.com/joelarson4/radReveal/blob/master/functionRunner.md).

For example, here is a slide with a `data-rad-functionrunner-setup` attr:

```html
<section data-rad-functionrunner-setup='{ "root" : "bar", "func" : "baz" }'>
```

and the page has a (global) object defined:

```javascript
var bar = {
  value: 'Hello world!',
  baz: function(slideObj, event, radEventName) {
    var span = document.createElement('span');
    span.innerHTML = radEventName + ': ' + this.value;
    slideObj.element.appendChild(span);
  }
}
```

Together this results in `setup: Hello world!` text being appended to the slide one time at setup (before any slides are shown).

You can also pass arguments through a functionRunner attribute.  This slide has a `data-rad-functionrunner-shown` attr:

```html
<section data-rad-functionrunner-shown='{ "func" : "foo", "args": ["shown", "2"] }'>
```

and the page has a (global) function defined:

```javascript
function foo(arg0, arg1, slideObj, event, radEventName) {
  var span = document.createElement('span');
  span.className = 'functionRunnerAdded';
  span.innerHTML =  radEventName + ': ' + arg0 + ' at ' + arg1;
  slideObj.element.appendChild(span);
}
```
    
which results in `shown: shown at 2` being appending to the slide every time it is shown.

Likewise you could use the attribute name `data-rad-functionrunner-hidden` to run a function when leaving the slide.

You also can use the same attributes on inner/vertical slides.

#In closing
Before you go, a few more things you should know.

##Browser support
I need to put more effort into formalizing my policy and approach on this, as well as testing IE.  Currently I am manually testing this in recent versions of Chrome (40.0) and Firefox (31.4), and running automated tests in PhantomJS (1.9.8).  

I am making an assumption that devs using Reveal.js are able to keep fairly up to date with browsers.  I realize this limits slide-sharing capabilities but I think that's a tradeoff worth making.  I'm also very open to help figuring out a better approach.  Please feel free to file an issue and tell me why I'm wrong and what I can do better!

##More addons coming

* I have a several other addons in prototype that I will clean up and release (as separate repos) soon.
* I will list these on main RadReveal README.
* And hopefully remember to update this slide!

##Please write your own add-ons!

The dream would be a tiny ecosystem of well written addons that folks can use to make **rad** presentations.