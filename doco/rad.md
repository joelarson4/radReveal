# RadReveal





* * *

### RadReveal.register(addon, addon.name, addon.init, addon.attributeEventListeners) 

Called by add-ons to register themselves.

**Parameters**

**addon**: `object`, an object representing this add-on, which must contain the following properties:

**addon.name**: `string`, the name of the add-on, which must match the `radName` value used when loaded as a dependency

**addon.init**: `function`, a function called when the add on is registered, which is passed two arguments: the 
    `radConfig` value used when loaded as a dependency (if any), and an array of all the slide objects.

**addon.attributeEventListeners**: `object`, a hash of attribute names, each mapped to an object with event names keyed 
    to functions.



### RadReveal.handlerClosure() 

xxx



### RadReveal.slideSetup() 

xxx



### RadReveal.initialize() 

Called to trigger Reveal initialization, capture config, and...?




* * *










