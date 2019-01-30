// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
function fadeIn(el, total, period) {
  var fps = 30, step = total / (period * fps), timeBetweenAnimSteps = 1E3 / fps;
  var opa = 0;
  (function doScrollAnimationStep() {
    opa += step;
    el.style.opacity = opa;
    if(opa < total) {
      setTimeout(doScrollAnimationStep, timeBetweenAnimSteps)
    }
  })()
}
var doScrollAnimationStepSetTimeoutId = null;
var scrollIntoViewAnimated = function(domObj) {
  var PADDING_TOP = 2;
  window.scrollTo(0, domObj.offsetTop - PADDING_TOP)
};
var _animatorDiv = function() {
  var r = document.createElement("div");
  r.style.overflow = "hidden";
  r.style.padding = "0";
  r.style.webkitTransitionProperty = "height";
  r.style.webkitTransitionDuration = "0.3s";
  return r
}();
function getAnimator(elem) {
  if(!elem.parentNode) {
    return null
  }
  return elem.parentNode.thisIsAnimator ? elem.parentNode : null
}
function addIfNotPresentAndAnimateExpand(mainnode, subnodes) {
  var animator = getAnimator(subnodes);
  if(!animator) {
    animator = suroundByAnimator(subnodes, 0)
  }
  if(animator.parentNode == null) {
    mainnode.appendChild(animator)
  }
  animator.style.height = subnodes.clientHeight + "px";
  animator.addEventListener("webkitTransitionEnd", onExpandCollapseTransitionEnd, false)
}
function animateCollapseThenRemove(elem) {
  var animator = getAnimator(elem);
  if(!animator) {
    animator = suroundByAnimator(elem, elem.clientHeight)
  }
  window.setTimeout(function() {
    animator.style.height = "0px"
  }, 1);
  animator.addEventListener("webkitTransitionEnd", onExpandCollapseTransitionEnd, false)
}
function onExpandCollapseTransitionEnd() {
  var isFullyCollapsed = parseInt(this.style.height) == 0;
  if(isFullyCollapsed) {
    removeElementAndAllChilds(this)
  }else {
    replaceElementByFirstChild(this)
  }
}
function removeElementAndAllChilds(elem) {
  elem.parentNode.removeChild(elem)
}
function replaceElementByFirstChild(elem) {
  var parent = elem.parentNode;
  var innernode = elem.firstChild;
  parent.replaceChild(innernode, elem)
}
function suroundByAnimator(elem, initHeight) {
  var r = _animatorDiv.cloneNode(true);
  r.thisIsAnimator = true;
  r.style.height = initHeight + "px";
  if(elem.parentNode) {
    elem.parentNode.replaceChild(r, elem)
  }
  r.appendChild(elem);
  return r
}
;
