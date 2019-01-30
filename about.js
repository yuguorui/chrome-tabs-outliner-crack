// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
document.getElementById("extensionVersionString").innerText = chrome.app.getDetails().version;
chrome.extension.getBackgroundPage().ga_screenview("About");
!function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if(!d.getElementById(id)) {
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs)
  }
}(document, "script", "twitter-wjs");

