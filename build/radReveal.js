require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"rad-reveal":[function(require,module,exports){
/*!
 * radReveal
 * http://joelarson4.github.io/radReveal
 * MIT licensed
 *
 * Copyright (C) 2015 Joe Larson
 */

/* jshint -W097 */
/* global document, Reveal, module, console */

/** 
 * The core RadReveal functionality used by all add-ons.
 * Please see [project README](https://github.com/joelarson4/radReveal) for an overview.
 *
 * Import using `require('rad-reveal');`.
 * @module RadReveal
 */
'use strict';

var config; //reveal + rad config
var allSlideElements; //all 'section' elements
var allSlideObjs = []; //the rad objects created for slides
var currentSlideObj;
var currentFragObj;
var allFragElements;

function register(name, initialize) {
    for(var di = 0, dlen = config.dependencies.length; di < dlen; di++) {
        if(config.dependencies[di].radName == name) {
            initialize(config.dependencies[di].radConfig, allSlideObjs);
        }
    }
}

/** 
 * Registers event handlers for slides with particular attributes. 
 *
 * @param {string|array} attrNames - the name or names of the attribute to associate the event with.
 *     Can be a comma seperated list or array of strings.
 * @param {string|array} event - the name or names of the rad reveal events to be handled. 
 *     Can be a comma seperated list or array of strings.
 * @param {function|array} handlers - the function or functions that will be called.
 *     Can be a single function or array of functions.
 */
function on(attrNames, events, handlers) {
    if(typeof attrNames == 'string') {
        attrNames = attrNames.split(','); //now s/be an array
    }

    if(typeof events == 'string') {
        events = events.split(',');
    }

    if(!Array.isArray(handlers)) {
        handlers = [handlers];
    }

    var attrNameArray = [];
    attrNames.forEach(function(attrNameItem) {
        attrNameItem = attrNameItem.trim();
        var asteriskIndex = attrNameItem.indexOf('*');
        if(asteriskIndex > -1) {
            var attrNameResolved = resolveAttributes(attrNameItem.substring(0,asteriskIndex));
            Array.prototype.push.apply(attrNameArray, attrNameResolved);
        } else {
            attrNameArray.push(attrNameItem);
        }
    });

    attrNameArray.forEach(function(attrNameItem) {
        handlers.forEach(function(handlerItem) {
            registerAttributeEventHandler(attrNameItem, events, handlerItem);
        });
    });
}

function resolveAttributes(attrNamePrefix) {
    var attrNamesFound = {};
    var checkElements = Array.prototype.concat.apply(allSlideElements, allFragElements);
    checkElements.forEach(function(ele) { 
        var attrArray = Array.prototype.slice.apply(ele.attributes);
        attrArray.forEach(function(attr) {
            if(!attr.specified) { return; }
            if(attr.name.indexOf(attrNamePrefix) < 0) {
                return;
            }
            attrNamesFound[attr.name] = true;
        });
    });
    return Object.keys(attrNamesFound);
}

/**
 * Actually performs registration.
 *
 * @param {string} attrName
 * @param {array} event
 * @param {function} handler
 * @private
 */
function registerAttributeEventHandler(attrName, events, handler) {    
    var slidesWithAttr = Array.prototype.slice.apply(document.querySelectorAll('section[' + attrName + ']'));
    var fragsWithAttr = Array.prototype.slice.apply(document.querySelectorAll('.fragment[' + attrName + ']'));
    var eleWithAttr = slidesWithAttr.concat(fragsWithAttr);
    eleWithAttr.forEach(function(eleElement) {
        var indexAttr;
        var level;
        if(eleElement.tagName == 'SECTION') {
            indexAttr = 'data-rad-main-slide-index';
            level = 'slide';
        } else if(eleElement.className.indexOf('fragment') > -1) {
            indexAttr = 'data-rad-main-fragment-index';
            level = 'fragment';
        } else {
            console.log(attrName + ' attached to non-section, non-fragment element; ignored');
            return; //not a fragment or slide, ignore
        }

        var eleIndex = parseInt(eleElement.getAttribute(indexAttr));
        var eleObj;
        if(level == 'slide') {
            eleObj = allSlideObjs[eleIndex];
        } else {
            var slideIndex = parseInt(eleElement.getAttribute('data-rad-main-fragment-slide'));
            eleObj = allSlideObjs[slideIndex].fragObjs[eleIndex];
        } 
        var attrVal = eleElement.getAttribute(attrName);

        events.forEach(function(eventName) {
            eventName = eventName.trim();

            //run 'load' immediately
            if(eventName == 'load') {
                handler(attrVal, eleObj, { type: 'rad' }, eventName);
            }

            //add shown to element's onShown list
            if(eventName == 'show') {
                eleObj.onShown.push(handlerClosure(handler, attrVal, eleObj, eventName));
            }

            //add hidden to element's onShown list
            if(eventName == 'hide') {
                eleObj.onHidden.push(handlerClosure(handler, attrVal, eleObj, eventName));
            }
        });
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
    slideElement.setAttribute('data-rad-main-slide-index', si + '');
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
        slideObj: slideObj,
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
    var slideIndex = parseInt(slideElement.getAttribute('data-rad-main-slide-index'));

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

    var oi, olen;

    if(currentSlideObj) {
        for(oi = 0, olen = currentSlideObj.onHidden.length; oi < olen; oi++) {
            currentSlideObj.onHidden[oi](event);
        }
    }

    currentSlideObj = allSlideObjs[slideIndex];
    currentSlideObj.indexh = event.indexh;
    currentSlideObj.indexv = event.indexv;

    for(oi = 0, olen = currentSlideObj.onShown.length; oi < olen; oi++) {
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
 * Retrieves dependencies settings and hooks in base reveal event handlers.  Must be called after
 * `Reveal.initialize()`.
 */
function initialize() {
    config = Reveal.getConfig();

    Reveal.addEventListener('ready', slideHandler);
    Reveal.addEventListener('slidechanged', slideHandler);

    Reveal.addEventListener('fragmentshown', fragShownHandler);
    Reveal.addEventListener('fragmenthidden', fragHiddenHandler);
}

/**
 * Returns all the slide objects set up by RadReveal.  This should only be used in test code.
 */
function getSlideObjects() {
    return allSlideObjs.concat([]);
}

//Must capture the DOM before Reveal.js gets involved.
allSlideElements = Array.prototype.slice.apply(document.querySelectorAll('.reveal section'));
allSlideElements.forEach(slideSetup);
allFragElements = Array.prototype.slice.apply(document.querySelectorAll('.reveal .fragment'));

module.exports = {
    register: register,
    on: on,
    initialize: initialize,
    getSlideObjects: getSlideObjects
};
},{}]},{},["rad-reveal"]);
