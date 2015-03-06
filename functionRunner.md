# functionRunner

An example RadReveal add-on which runs functions based on attributes added to slides.  

Note that this is not a true CommonJS module, you cannot `require()` it.  It should be loaded as a Reveal.js dependency.

```javascript
Reveal.initialize({
   ...
   dependencies: [
       { src: 'build/functionRunner.min.js', radName: 'functionRunner' }
   ...
```

##Attribute values
All attributes support a value which is a JSON string.  This JSON string should describe an object which supports the following properties:

**func**: `string`, required property, the name of a function to run.

**root**: `string`, optional property, the name of a namespacing object to which the function is attached if it's not a global.

**args**: `array`, optional property, an array of function arguments.

##How the function is called
The function designated is passed any arguments supplied in the `args` property, plus several additional arguments appended to the end of the arguments list:

**radObj** the RadReveal slide object or fragment object (see RadReveal documentation)
**event** the Reveal.js event
**radEventName** the name of the RadReveal event (see RadReveal documentation)

Note that if the function is not found you will get a console error, but everything else should keep working.

##Attributes supported
Attributes for slides (`section` elements):

`data-rad-functionrunner-setup` runs the designated function at start up

`data-rad-functionrunner-shown` runs the designated function when a slide is shown

`data-rad-functionrunner-hidden` runs the designated function when a slide is hidden


Attributes for fragments (elements with `fragment` class):

`data-rad-functionrunner-fragment-setup` runs the designated function at start up

`data-rad-functionrunner-fragment-shown` runs the designated function when a fragment is shown

`data-rad-functionrunner-fragment-hidden` runs the designated function when a fragment is hidden


##Examples

`<section data-rad-functionrunner-setup='{ "func": "foo" }'>`

This will call a function named `foo` if found in global namespace at startup.


`<section data-rad-functionrunner-fragment-shown='{ "root": "bar", "func": "bazz", "args" : [ "1", "abc" ] }'>`

This will call `bar.bazz("1", "abc", radObj, event, radEventName)` when the fragment is shown.



* * *


* * *










