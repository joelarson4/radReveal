# RadReveal





* * *

### RadReveal.register(addon, addon.name, addon.init, addon.attributeEventListeners) 

Called by add-ons to register themselves.

**Parameters**

**addon**: `object`, an object representing this add-on, which must contain the following properties:

**addon.name**: `string`, the name of the add-on, which must match the `radName` value used when loaded as a dependency

**addon.init**: `function`, an optional function called when the add on is registered, which is passed two arguments: the 
    `radConfig` value used when loaded as a dependency (if any), and an array of all the slide objects.

**addon.attributeEventListeners**: `object`, an optional hash of attribute names, each mapped to an object with event names keyed 
    to functions.



### RadReveal.initialize(inputConfig) 

Called to trigger Reveal initialization instead of calling Reveal.initialize directly.
Also captures config (some of which is RadReveal), and register RadReveal event handler middlemen.

**Parameters**

**inputConfig**: `object`, Reveal.js configuration plus modifications for RadReveal




* * *










