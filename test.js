// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
document.getElementById("resetLastSendDidToOne").onclick = function() {
  localStorage["be_nextUnsentDid"] = 1
};
document.getElementById("diconect").onclick = function() {
  window.chrome.extension.getBackgroundPage().activeSession.disconectFromBackEnd()
};
document.getElementById("sendDiff").onclick = function() {
  window.chrome.extension.getBackgroundPage().activeSession.sendDiffDataToBackEnd_ifConnected()
};
document.getElementById("restoreOnReloadFromFile").onclick = function() {
  localStorage["serviceOptions_restoreSource"] = "file"
};

