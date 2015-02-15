
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
