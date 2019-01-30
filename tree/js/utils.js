// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
function changecss(myclass, element, value) {
  var CSSRules;
  if(document.all) {
    CSSRules = "rules"
  }else {
    if(document.getElementById) {
      CSSRules = "cssRules"
    }
  }
  var isRuleFound = false;
  for(var i = 0;i < document.styleSheets[0][CSSRules].length;i++) {
    if(document.styleSheets[0][CSSRules][i].selectorText == myclass) {
      isRuleFound = true;
      document.styleSheets[0][CSSRules][i].style[element] = value
    }
  }
  if(!isRuleFound) {
    alert("Error, changecss() cannot find css class:" + myclass + " to set" + element + ":" + value)
  }
  alert("zzz")
}
;
