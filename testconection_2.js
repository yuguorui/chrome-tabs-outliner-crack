// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
function handleClientLoad2() {
  console.timeEnd("gapiscript load time");
  console.log("gapiscript onload callback called")
}
function addGapiScript_onload_call_handleClientLoad() {
  console.log("Request GAPI interface loading");
  console.time("gapiscript load time");
  var previouslyinsertedscript = document.getElementById("googleapiscript");
  if(previouslyinsertedscript) {
    document.head.removeChild(previouslyinsertedscript)
  }
  window.setTimeout(function() {
    var gapiscript = document.createElement("script");
    gapiscript.id = "googleapiscript";
    gapiscript.type = "text/javascript";
    gapiscript.src = "https://apis.google.com/js/client.js?onload=handleClientLoad2";
    gapiscript.addEventListener("error", function(e) {
      console.error("Error loading GAPI. A network error occurred, and the request could not be completed.", e)
    });
    document.head.appendChild(gapiscript)
  }, 1)
}
addGapiScript_onload_call_handleClientLoad();

