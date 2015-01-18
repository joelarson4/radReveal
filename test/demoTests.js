
//utilities
function navigateTo(ele, lastcall) {
    var frag = null;
    var slide = null;
    if(ele.tagName === 'SECTION') {
        slide = ele;
    } else {
        frag = ele;
        slide = getSlideForFragment(frag);
    }
    beforeEach(function(done) {
        Reveal.slide(0, 0, 0);
        function navTo() {
            if(slide.className.indexOf('present') < 0) {
                Reveal.next();
                setTimeout(function() { navTo(); }, 50);
            } else if(frag !== null && frag.className.indexOf('current-fragment') < 0) {
                Reveal.nextFragment();
                setTimeout(function() { navTo(); }, 50);
            } else if(typeof lastcall === 'function') {
                lastcall();
                setTimeout(function() { done(); }, 50);
            } else {
                done();
            }
        };
        setTimeout(function() { navTo(); }, 50);
    });
}

function elementContains(ele, text) {
    return ele.innerHTML.indexOf(text) > -1;
}

function getSlideForFragment(frag) {
    var slide = frag.parentNode;
    while(slide && slide.tagName !== 'SECTION') {
        slide = slide.parentNode;
    }
    return slide;
}

//tests
describe('Rad startup', function() {

    it('RadReveal exists with initialize function', function() { 
        assert.isObject(RadReveal); 
        assert.isFunction(RadReveal.initialize);
    });

    it('section data-rad-main-index attributes added', function() {
        //just check a few
        assert.isObject(document.querySelector('section[data-rad-main-index="0"]'));
        assert.isObject(document.querySelector('section[data-rad-main-index="1"]'));
        assert.isObject(document.querySelector('section[data-rad-main-index="2"]'));

        assert.equal(document.querySelectorAll('section').length, document.querySelectorAll('[data-rad-main-index]').length);
    });

    it('fragment data-rad-main-fragment-index attributes added', function() {
        //just check a few
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-index="0"]'));
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-index="1"]'));
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-index="2"]'));

        assert.equal(document.querySelectorAll('.fragment').length, document.querySelectorAll('[data-rad-main-fragment-index]').length);
    });

    it('fragment data-rad-main-fragment-slide attributes added', function() {
        assert.isObject(document.querySelector('.fragment[data-rad-main-fragment-slide]'));
        assert.equal(document.querySelectorAll('.fragment').length, document.querySelectorAll('[data-rad-main-fragment-slide]').length);

        //check that the slide value equals the index of the slide it is inside of
        var frag = document.querySelector('.fragment');
        var slide = getSlideForFragment(frag);
        assert.equal(frag.getAttribute('data-rad-main-fragment-slide'), slide.getAttribute('data-rad-main-index'));
    });

});


describe('FunctionRunner fillSlides fills all slides with setup setting', function() {
    it('working', function() { 
        //fillSlides should mean all sections have this attribute
        assert.equal(document.querySelectorAll('section').length, document.querySelectorAll('[data-rad-functionrunner-setup]').length);

        var filledSlide = document.querySelector('[data-testing-functionrunner-fillslides="true"]');
        assert.isObject(filledSlide);
    });
});

describe('FunctionRunner-setup modifies HTML properly', function() {
    it('working', function() { 
        var sectionElements = Array.prototype.slice.call(document.querySelectorAll('section'));
        sectionElements.forEach(function(ele, index) {
            var attrVal = JSON.parse(ele.getAttribute('data-rad-functionrunner-setup'));
            if(attrVal === null) return;

            var html = ele.innerHTML;
            if(attrVal.fun == 'foo') {
                assert.isTrue(elementContains(slide, 'setup'));
                assert.isTrue(elementContains(slide, attrVal.args[0]));
                assert.isTrue(elementContains(slide, attrVal.args[1]));
            } else if(attrVal.fun == 'bar') {
                assert.isTrue(elementContains(slide, bar.value));
            }
        });
    });

});

describe('FunctionRunner-shown modifies HTML properly', function() {
    this.timeout(3000);
    var slide = document.querySelector('[data-rad-functionrunner-shown]');
    var attrVal = JSON.parse(slide.getAttribute('data-rad-functionrunner-shown'));
    var slideOriginalHtml = slide.innerHTML;

    navigateTo(slide);

    it('working', function() { 
        assert.notEqual(slide.innerHTML, slideOriginalHtml);
        assert.isTrue(elementContains(slide, 'shown'));
        assert.isTrue(elementContains(slide, attrVal.args[0]));
        assert.isTrue(elementContains(slide, attrVal.args[1]));
    });
});

describe('FunctionRunner-hidden modifies HTML properly', function() {
    this.timeout(3000);
    var slide = document.querySelector('[data-rad-functionrunner-hidden]');
    var attrVal = JSON.parse(slide.getAttribute('data-rad-functionrunner-hidden'));
    var slideIndex = Number(slide.getAttribute('data-rad-main-index'));
    var nextSlide = document.querySelector('[data-rad-main-index="' + (slideIndex + 1) + '"]');
    
    navigateTo(nextSlide);

    it('working', function() { 
        assert.isTrue(elementContains(slide, 'hidden'));
        assert.isTrue(elementContains(slide, attrVal.args[0]));
        assert.isTrue(elementContains(slide, attrVal.args[1]));
    });
});

describe('FunctionRunner-fragment-setup modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-fragment-setup]');
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-fragment-setup'));
    
    it('working', function() { 
        assert.isTrue(elementContains(frag, 'setup'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
        assert.isTrue(elementContains(frag, attrVal.args[1]));
    });
});

describe('FunctionRunner-fragment-shown modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-fragment-shown]');
    
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-fragment-shown'));
    
    navigateTo(frag);

    it('working', function() { 
        assert.isTrue(elementContains(frag, 'shown'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
        assert.isTrue(elementContains(frag, attrVal.args[1]));
    });
});

describe('FunctionRunner-fragment-hidden modifies HTML properly', function() {
    this.timeout(3000);
    var frag = document.querySelector('.fragment[data-rad-functionrunner-fragment-hidden]');
   
    var attrVal = JSON.parse(frag.getAttribute('data-rad-functionrunner-fragment-hidden'));
    
    navigateTo(frag, function() {
        Reveal.prevFragment(); //back up one
    });

    it('working', function() {
        assert.isTrue(elementContains(frag, 'hidden'));
        assert.isTrue(elementContains(frag, attrVal.args[0]));
        assert.isTrue(elementContains(frag, attrVal.args[1]));
    });
});