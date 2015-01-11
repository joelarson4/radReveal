# RadReveal
Please see project README ( https:&#x2F;&#x2F;github.com&#x2F;joelarson4&#x2F;radReveal ) for an overview.





* * *

### RadReveal
Please see project README ( https:&#x2F;&#x2F;github.com&#x2F;joelarson4&#x2F;radReveal ) for an overview..register(addon, addon.name, addon.initialize, addon.attributeEventListeners) 

Called by add-ons to register themselves.

**Parameters**

**addon**: `object`, an object representing this add-on, which must contain the following properties:

**addon.name**: `string`, the name of the add-on, which must match the `radName` value used when loaded as a dependency

**addon.initialize**: `function`, an optional function called when the add on is registered, which is passed two arguments: the 
    `radConfig` value used when loaded as a dependency (if any), and an array of all the slide objects.

**addon.attributeEventListeners**: `object`, an optional hash of attribute names, each mapped to an object with event names keyed 
    to functions.



### RadReveal
Please see project README ( https:&#x2F;&#x2F;github.com&#x2F;joelarson4&#x2F;radReveal ) for an overview..initialize(inputConfig, inputConfig.dependencies[n].radName, inputConfig.dependencies[n].radConfig) 

Called to trigger Reveal initialization instead of calling Reveal.initialize directly.
Also captures config (some of which is RadReveal), and register RadReveal event handler middlemen.

**Parameters**

**inputConfig**: `object`, Reveal.js configuration plus modifications for RadReveal.

**inputConfig.dependencies[n].radName**: `string`, The name of the Rad addon, which must match what's passed by that addon to `RadReveal.register`.

**inputConfig.dependencies[n].radConfig**: `object`, A configuration object passed to the Rad addon initialize function.




* * *










