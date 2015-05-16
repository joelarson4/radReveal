# RadReveal

The core RadReveal functionality used by all add-ons.
Please see [project README](https://github.com/joelarson4/radReveal) for an overview.

Import using `require('rad-reveal');`.



* * *

### RadReveal.on(attrNames, event, handlers) 

Registers event handlers for slides with particular attributes.

**Parameters**

**attrNames**: `string | array`, the name or names of the attribute to associate the event with.
    Can be a comma seperated list or array of strings.

**event**: `string | array`, the name or names of the rad reveal events to be handled. 
    Can be a comma seperated list or array of strings.

**handlers**: `function | array`, the function or functions that will be called.
    Can be a single function or array of functions.



### RadReveal.initialize() 

Retrieves dependencies settings and hooks in base reveal event handlers.  Must be called after
`Reveal.initialize()`.



### RadReveal.getSlideObjects() 

Returns all the slide objects set up by RadReveal.  This should only be used in test code.




* * *










