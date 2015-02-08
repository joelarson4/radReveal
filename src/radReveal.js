/** 
 * Please see project README ( https://github.com/joelarson4/radReveal ) for an overview.
 * @module RadReveal
 */
'use strict';

var config; //reveal + rad config
var addons = []; //all the addons
var allSlideElements; //all 'section' elements
var allSlideObjs = []; //the rad objects created for slides
var currentSlideObj;
var currentFragObj;

var handlers = {
    setup: {},
    shown: {},
    hidden: {},
    fragmentShown: {},
    fragmentHidden: {}
};

/** 
 * Called by add-ons to register themselves.
 * @param {object} addon - an object representing this add-on, which must contain the following properties:
 * @param {string} addon.name - the name of the add-on, which must match the `radName` value used when loaded as a dependency
 * @param {function=} addon.initialize - an optional function called when the add on is registered, which is passed two arguments: the 
 *     `radConfig` value used when loaded as a dependency (if any), and an array of all the slide objects.
 * @param {object=} addon.attributeEventListeners - an optional hash of attribute names, each mapped to an object with event names keyed 
 *     to functions.
 */
function register(addon) {
    //first find the addons config from the dependencies array
    var addonConfig;
    for(var di = 0, dlen = config.dependencies.length; di < dlen; di++) {
        if(config.dependencies[di].radName == addon.name) {
            addonConfig = config.dependencies[di].radConfig;
        }
    };
    addon.initialize(addonConfig, allSlideObjs);

    addon.attributeEventListeners = addon.attributeEventListeners || [];

    //now add all attribute handlers
    Object.keys(addon.attributeEventListeners).forEach(function(attrName) {
        registerAttributeEventHandlers('slide', addon, attrName);
        registerAttributeEventHandlers('fragment', addon, attrName);
    });

    //finally, add the addons to the addon list
    addons.push(addon);
}

/** 
 * Registers specific event handlers for attributes.  Called when addon is registered as a dependency.
 * Behavior varies slightly whether the level is 'section' or 'fragment'.
 * @param {string} level - either 'section' or 'fragment'
 * @param {object} addon - addon module being registered
 * @param {string} attrName - the name of the attribute to associate the event with.
 * @private
 */
function registerAttributeEventHandlers(level, addon, attrName) {
    var selector = (level == 'slide' ? 'section' : '.fragment');
    var indexAttr = 'data-rad-main-' + (level == 'slide' ? '' : 'fragment-') + 'index';

    var elesWithAttr = Array.prototype.slice.apply(document.querySelectorAll(selector + '[' + attrName + ']'));
    elesWithAttr.forEach(function(eleElement) {
        var eleIndex = parseInt(eleElement.getAttribute(indexAttr));
        var eleObj;
        if(selector === 'section') {
            eleObj = allSlideObjs[eleIndex];
        } else if(selector === '.fragment') {
            var slideIndex = parseInt(eleElement.getAttribute('data-rad-main-fragment-slide'));
            eleObj = allSlideObjs[slideIndex].fragObjs[eleIndex];
        } 
        var attrVal = eleElement.getAttribute(attrName);

        var setupEvent = (level == 'slide' ? 'setup' : 'fragmentSetup');
        var shownEvent = (level == 'slide' ? 'shown' : 'fragmentShown');
        var hiddenEvent = (level == 'slide' ? 'hidden' : 'fragmentHidden');

        //run setup immediately
        if(typeof addon.attributeEventListeners[attrName][setupEvent] === 'function') {
            var fauxEvent = { 
                currentSlide: eleElement,
                type: 'rad'
            };
            addon.attributeEventListeners[attrName][setupEvent](attrVal, eleObj, fauxEvent, setupEvent);
        }

        //add onShown to list
        if(typeof addon.attributeEventListeners[attrName][shownEvent] === 'function') {
            eleObj.onShown.push(handlerClosure(addon.attributeEventListeners[attrName][shownEvent], attrVal, eleObj, shownEvent));
        }

        //add onHidden to list
        if(typeof addon.attributeEventListeners[attrName][hiddenEvent] === 'function') {
            eleObj.onHidden.push(handlerClosure(addon.attributeEventListeners[attrName][hiddenEvent], attrVal, eleObj, hiddenEvent));
        }
    });
}

/** 
 * Simple closure to run handler within.
 * @private
 */
function handlerClosure(handler, attrVal, slideObj, radEventName) {
    return function(event) {
        handler(attrVal, slideObj, event, radEventName);
    };
}

/** 
 * Sets up a slide for use within the framework.
 * @private
 */
function slideSetup(slideElement, si) {
    var prevSlideObj = ( si ? allSlideObjs[si - 1] : null);
    var slideObj = {
        index: si,
        element: slideElement,
        nextSlideObj: null,
        prevSlideObj: prevSlideObj,
        lastSlideObj: null, //the slide we left to get to current slide
        onShown: [],
        onHidden: [],
        data: {}
    };
    slideElement.setAttribute('data-rad-main-index', si + '');
    if(prevSlideObj) prevSlideObj.nextSlideObj = slideObj;
    allSlideObjs.push(slideObj);

    slideObj.fragElements = Array.prototype.slice.apply(slideElement.querySelectorAll('.fragment'));
    slideObj.fragObjs = [];
    slideObj.fragElements.forEach(function(fragElement, fi) {
        fragSetup(slideObj, fragElement, fi);
    });
}

/** 
 * Sets up a fragment for use within the framework.
 * @private
 */
function fragSetup(slideObj, fragElement, fi) {
    var prevFragObj = ( fi ? slideObj.fragObjs[fi - 1] : null);
    var fragObj = {
        index: fi,
        element: fragElement,
        nextFragObj: null,
        prevFragObj: prevFragObj,
        onShown: [],
        onHidden: [],
        data: {}
    };
    fragElement.setAttribute('data-rad-main-fragment-index', fi + '');
    fragElement.setAttribute('data-rad-main-fragment-slide', slideObj.index + '');
    if(prevFragObj) prevFragObj.nextFragObj = fragObj;
    slideObj.fragObjs.push(fragObj);
}

/** 
 * Event handler called when slide is changed, which then passes off to underlying addon handlers.
 * @private
 */
function slideHandler(event) {
    var slideElement = event.currentSlide;
    var slideIndex = parseInt(slideElement.getAttribute('data-rad-main-index'));

    //prevents double firing under some circumstances
    if(allSlideObjs[slideIndex] == currentSlideObj) return;

    event.direction = null;
    if(currentSlideObj) {
        if(currentSlideObj.indexh < event.indexh) {
            event.direction = 'left';
        } else if(currentSlideObj.indexh > event.indexh) {
            event.direction = 'right';
        } else if(currentSlideObj.indexv < event.indexv) {
            event.direction = 'down';
        } else if(currentSlideObj.indexv > event.indexv) {
            event.direction = 'up';
        } else {
            event.direction = 'unknown';
        }
    }

    allSlideObjs[slideIndex].lastSlideObj = currentSlideObj;

    if(currentSlideObj) {
        for(var oi = 0, olen = currentSlideObj.onHidden.length; oi < olen; oi++) {
            currentSlideObj.onHidden[oi](event);
        }
    }

    currentSlideObj = allSlideObjs[slideIndex];
    currentSlideObj.indexh = event.indexh;
    currentSlideObj.indexv = event.indexv;

    for(var oi = 0, olen = currentSlideObj.onShown.length; oi < olen; oi++) {
        currentSlideObj.onShown[oi](event);
    }

    currentFragObj = null;
}

/** 
 * Event handler called when fragment is changed, which then passes off to underlying addon handlers.
 * @private
 */
function fragHandler(eventName, event) {
    var fragElement = event.fragment;
    var fragIndex = parseInt(fragElement.getAttribute('data-rad-main-fragment-index'));

    var fragObj = currentSlideObj.fragObjs[fragIndex];

    for(var oi = 0, olen = fragObj[eventName].length; oi < olen; oi++) {
        fragObj[eventName][oi](event);
    }
}

function fragShownHandler(event) {
    fragHandler('onShown', event);
}

function fragHiddenHandler(event) {
    fragHandler('onHidden', event);
}


/** 
 * Called to trigger Reveal initialization instead of calling Reveal.initialize directly.
 * Also captures config (some of which is RadReveal), and register RadReveal event handler middlemen.
 * @param {object} inputConfig - Reveal.js configuration plus modifications for RadReveal.
 * @param {string} inputConfig.dependencies[n].radName - The name of the Rad addon, which must match what's passed by that addon to `RadReveal.register`.
 * @param {object} inputConfig.dependencies[n].radConfig - A configuration object passed to the Rad addon initialize function.
 */
function initialize(inputConfig) {
    config = inputConfig;
    allSlideElements = Array.prototype.slice.apply(document.querySelectorAll('.reveal section'));
    allSlideElements.forEach(slideSetup);

    Reveal.initialize(inputConfig);

    Reveal.addEventListener('ready', slideHandler);
    Reveal.addEventListener('slidechanged', slideHandler);

    Reveal.addEventListener('fragmentshown', fragShownHandler);
    Reveal.addEventListener('fragmenthidden', fragHiddenHandler);
}

//Attach to window as a global for simplicity.
module.exports = window.RadReveal = {
    register: register,
    initialize: initialize
}
