#RadReveal [![Build Status](https://travis-ci.org/joelarson4/radReveal.svg)](https://travis-ci.org/joelarson4/radReveal)
RadReveal is a JavaScript library to help you extend [Reveal.js - the HTML Presentation Framework](http://lab.hakim.se/reveal-js/).

Check out the [demo slideshow](http://joelarson4.github.io/radReveal/demo.html) to see how RadReveal works.

##Currently available add-ons
I've published three add-ons so far, and more are on the way:

* [functionRunner](#the-functionrunner-example-add-on) helps you run arbitrary functions when slides are shown, hidden, etc.
* [rad-randomizer](https://github.com/joelarson4/rad-randomizer) is for attaching seeded Psuedo Random Number Generators to your slides.
* [rad-colorizer](https://github.com/joelarson4/rad-colorizer) automatically adds foreground and background colors to your slides.


Anyway...

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

Note that you will need to `sudo npm install` to get everything installed properly.

##API JsDoc for RadReveal

You may want to to skip to [the API documentation for the library](https://github.com/joelarson4/radReveal/blob/master/radReveal.md).

##Simple example

What does an add-on look like?

`example.js` - the add-on script:

```javascript
(function() { 
  var RadReveal = require('rad-reveal');

  function exampleInit(radConfig, slides) {
    for(var s = 0, len = slides.length; s < len; s++) {
      slides[s].className += ' ' + radConfig.addClass;
    }
  }

  RadReveal.register('example', exampleInit);
}());
```

`index.html` modifications for initializing RadReveal and Reveal.js:

```html
<script src="node_modules/reveal.js/lib/js/head.min.js"></script>
<script src="node_modules/reveal.js/js/reveal.js"></script>
<script src="node_modules/rad-reveal/build/radReveal.min.js"></script>

```javascript
Reveal.initialize({
  ...normal Reveal configuration goes here
  dependencies: [
    { 
      //include it just like a normal dependency, 
      //  but with radName and radConfig properties
      src: 'somepath/example.js', 
      radName: 'example',
      radConfig: { addClass: 'example' } 
    }
    ...other dependencies go here
  ]
});

var RadReveal = require('rad-reveal');
RadReveal.initialize();
```

So what happens when you run this?

1. `Reveal.initialize` loads dependencies, including `rad-example.js`.
2. Example add-on registers self with `RadReveal.register(nameString, initFunction)`.
3. After Reveal is initialized, we call `RadReveal.initialize();`.
4. RadReveal's `initialize` calls example add-on's initialize function, passing `radConfig, allSlides`
5. Example add-on does whatever it wants.
6. In this example, the add-on appends a class to every slide.

##Beyond initialize: attribute event listeners
Imagine you want to run some code against specific slides or fragments at certain points in the slideshow.  How could you do that?

Reveal.js provides some data attributes you can attach to slides to cause certain behaviors (like `data-transition` and `data-background`).  RadReveal makes it so your add-on can take a similar approach.

You can provide RadReveal attribute event listeners to define attribute listener functions for your add-on.  
Listener functions are only called for slides or fragments that have specific attributes, and only when specific events occur.
You register them using `RadReveal.on(attribute, eventName, function)`.

For example:

```javascript
RadReveal.on('data-rad-example', 'load', someFunction);
```

For any slide or fragment with the `data-rad-example` attribute, `someFunction` will be called when the add-on is loaded (meaning, immediately).

The listener function is called with four arguments:

* `attrVal` - the value of the attribute for this slide or fragment.
* `slideObj` - an object representing the slide or fragment (see documentation below).
* `event` - the event object.
* `radEventName` - the name of the event.

You could use this to do something to the slide element itself.  For example, we could add a class based on the value of the attribute.

```javascript
(function() { 
  var RadReveal = require('rad-reveal');

  function addTheClass(attrVal, slideObj, event, radEventName) {
    slideObj.element.className += ' ' + attrVal;
  }

  RadReveal.on('data-rad-example', 'load', addTheClass);
}());
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

You can also register to run something on showing or hiding a slide or fragment that has the attribute.

```javascript
RadReveal.on('data-rad-example', 'shown', anotherFunction);
RadReveal.on('data-rad-example', 'hidden', andAnotherFunction);
```

This means that `anotherFunction` will run each time a slide or fragment is displayed with a `data-rad-example` attribute, and then when you leave that slide `andAnotherFunction` will run.

##All supported events

These events can be used for `attributeEventListeners`, fired for every slide or fragment with the specified attribute:

* `load` is fired when the add-on is loaded.
* `shown` is fired when the matching slide or fragment is displayed.
* `hidden` is fired when the matching slide or fragment is hidden.

##The slide or fragment object

Event listeners get a slide or fragment object supplied as an argument.  For slides, the object has several public properties:

* `index` the index number of the slide
* `element` the `section` element for this slide
* `nextSlideObj` the next slide object
* `prevSlideObj` the previous slide object
* `lastSlideObj` the slide object that was shown just before this one
* `data` an object to which add-ons can attach additional properties.

For fragments, these are the properties:

* `index` the index number of the fragment (within the slide)
* `element` the `.fragment` element for this fragment
* `slideObj` the slide object to which the fragment belongs
* `nextFragObj` the next fragment object
* `prevFragObj` the previous fragment object
* `data` an object to which add-ons can attach additional properties.

Please *do* *not* modify the slide or fragment object or any of it's properties directly *except* for the `data` property.

#The functionRunner example add-on.

The core RadReveal repo includes `functionRunner`, a simple add-on that triggers a function to run for any slide with a `data-rad-functionrunner-{eventName}` attribute. 
There is also [API documentation for functionRunner](https://github.com/joelarson4/radReveal/blob/master/functionRunner.md).

For example, here is a slide with a `data-rad-functionrunner-load` attr:

```html
<section data-rad-functionrunner-load='{ "root" : "bar", "func" : "baz" }'>
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

Together this results in `load: Hello world!` text being appended to the slide one time at load (before any slides are shown).

You can also pass arguments through a functionRunner attribute.  This slide has a `data-rad-functionrunner-shown` attr:

```html
<section data-rad-functionrunner-shown='{ "func" : "foo", "args": ["2"] }'>
```

and the page has a (global) function defined:

```javascript
function foo(arg0, slideObj, event, radEventName) {
  var span = document.createElement('span');
  span.className = 'functionRunnerAdded';
  span.innerHTML =  radEventName + ' with ' + arg0;
  slideObj.element.appendChild(span);
}
```
    
which results in `shown with 2` being appending to the slide every time it is shown.

Likewise you could use the attribute name `data-rad-functionrunner-hidden` to run a function when leaving the slide.

You also can use the same attributes on inner/vertical slides.

#In closing
Before you go, a few more things you should know.

##Browser support
I need to put more effort into formalizing my policy and approach on this, as well as testing IE.  Currently I am manually testing this in recent versions of Chrome (40.0) and Firefox (31.4), and running automated tests in PhantomJS (1.9.8).

I am making an assumption that devs using Reveal.js are able to keep fairly up to date with browsers.  I realize this limits slide-sharing capabilities but I think that's a tradeoff worth making.  I'm also very open to help figuring out a better approach.  Please feel free to file an issue and tell me why I'm wrong and what I can do better!

##More add-ons coming

* I have a several other add-ons in prototype that I will clean up and release (as separate repos) soon.
* I will list these on main RadReveal README.
* And hopefully remember to update this slide!

##Please write your own add-ons!

The dream would be a tiny ecosystem of well written add-ons that folks can use to make **rad** presentations.