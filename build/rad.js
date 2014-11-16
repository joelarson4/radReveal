(function() { 'use strict';
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

    /** Called by addons to register themselves
     *
     */
    function register(addon) {
        //first find the addons config from the dependencies array
        var addonConfig;
        for(var di = 0, dlen = config.dependencies.length; di < dlen; di++) {
            if(config.dependencies[di].radName == addon.name) {
                addonConfig = config.dependencies[di].radConfig;
            }
        };
        addon.init(addonConfig, allSlideElements);

        addon.attributeEventListeners = addon.attributeEventListeners || [];

        //now add all attribute handlers
        Object.keys(addon.attributeEventListeners).forEach(function(attrName) {
            registerAttributeEventHandlers('slide', addon, attrName);
            registerAttributeEventHandlers('fragment', addon, attrName);
        });

        //finally, add the addons to the addon list
        addons.push(addon);
    }

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
     *
     */
    function handlerClosure(handler, attrVal, slideObj, radEventName) {
        return function(event) {
            handler(attrVal, slideObj, event, radEventName);
        };
    }

    /**
     *
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

    
    /** Called to trigger Reveal initialization, capture config, and...?
     *
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

    window.RadReveal = {
        register: register,
        initialize: initialize
    }

})();