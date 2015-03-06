# RadReveal

The core RadReveal functionality used by all add-ons.
Please see [project README](https://github.com/joelarson4/radReveal) for an overview.

Import using `require('rad-reveal');`.



* * *

### RadReveal.register(addon) 

Called by add-ons to register themselves.

**addon** properties

**addon.name**: `string`, the name of the add-on, which must match the `radName` value used when loaded as a dependency

**addon.initialize**: `function`, an optional function called when the add on is registered, which is passed two arguments: the 
    `radConfig` value used when loaded as a dependency (if any), and an array of all the slide objects.

**addon.attributeEventListeners**: `object`, an optional hash of attribute names, each mapped to an object with event names keyed 
    to functions.

**Parameters**

**addon**: `object`, an object representing this add-on, which must contain the following properties:



### RadReveal.initialize() 

Gets dependencies settings and registers event handlers.



### RadReveal.getSlideObjects() 

Returns all the slide objects set up by RadReveal.  This should only be used in test code.




* * *










