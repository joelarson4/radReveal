# RadReveal

Please see project README ( https://github.com/joelarson4/radReveal ) for an overview.

Import using `var RadReveal = require('rad-reveal');`.



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



### RadReveal.initialize(inputConfig) 

Called to trigger Reveal initialization instead of calling Reveal.initialize directly.
Also captures config (some of which is RadReveal), and register RadReveal event handler middlemen.

**inputConfig** properties

**inputConfig.dependencies[n].radName**: `string`, The name of the Rad addon, which must match what's passed by that addon to `RadReveal.register`.

**inputConfig.dependencies[n].radConfig**: `object`, A configuration object passed to the Rad addon initialize function.

**Parameters**

**inputConfig**: `object`, Reveal.js configuration plus modifications for RadReveal.




* * *










