// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var to_messages = to_messages || {};
to_messages.MessageType = {INFO:"info", WARNING:"warning", ERROR:"error", GOPRO:"gopro"};
to_messages.messageTypesPriorities = ["gopro", "info", "warning", "error"];
to_messages.mainViewMessageTemplates = {"info":'<div class="mainViewMessage" type="info">' + '<span class="mainViewMessageIcon"></span>' + '<a class="mainViewMessageRemoveBtn" href="#" title="Remove">Remove</a>' + '<div class="mainViewMessageBody">Message Text</div>' + "</div>", "warning":'<div class="mainViewMessage" type="warning">' + '<span class="mainViewMessageIcon"></span>' + '<a class="mainViewMessageRemoveBtn" href="#" title="Remove">Remove</a>' + '<div class="mainViewMessageBody">Message Text</div>' + 
"</div>", "error":'<div class="mainViewMessage" type="error">' + '<span class="mainViewMessageIcon"></span>' + '<a class="mainViewMessageRemoveBtn" href="#" title="Remove">Remove</a>' + '<div class="mainViewMessageBody">Message Text</div>' + "</div>", "gopro":'<div class="mainViewMessage" type="gopro">' + '<a class="mainViewMessageRemoveBtn" href="#" title="Remove">Remove</a>' + '<div class="goproMessageTextBlock">' + "<h1>Upgrade to Paid Mode</h1>" + "Enable extra features and support project futher progress. " + 
'<a role="button">Learn more.</a>' + "</div>" + '<div class="goproMessageIllustration">' + '<img src="img/messages/upgrade.png" alt="Upgrade!">' + "</div>" + "</div>"};
to_messages.MessageManager = function() {
  this.activeSessionMessages = []
};
to_messages.appendHtml = function(parent, reference, str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  while(div.children.length > 0) {
    var lastInsertedElement = parent.insertBefore(div.children[0], reference)
  }
  return lastInsertedElement
};
to_messages.addMessageDomToMainViewStack = function(messageParams) {
  var mainViewStack = document.getElementById("mainViewMessagesStack");
  var folowingElement = null;
  var insertedMessage = this.appendHtml(mainViewStack, folowingElement, to_messages.mainViewMessageTemplates[messageParams.messageType]);
  if(messageParams.messageTextHtml) {
    insertedMessage.querySelector(".mainViewMessageBody").innerHTML = messageParams.messageTextHtml
  }
  insertedMessage.querySelector(".mainViewMessageRemoveBtn").onclick = messageParams.closeCallback.bind(undefined, messageParams) || function(event) {
    event.srcElement.parentElement.parentElement.removeChild(event.srcElement.parentElement);
    chrome.extension.getBackgroundPage().ga_event("Message Closed By User - " + messageParams.messageType)
  };
  if(messageParams.messageClickCallback) {
    insertedMessage.onclick = messageParams.messageClickCallback;
    insertedMessage.style.cursor = "pointer"
  }
};
to_messages.messages_stack = [];
to_messages.messages = {};
to_messages.regMessage = function(messageParameters) {
  this.messages_stack.push(messageParameters);
  this.messages[messageParameters.localStorageFlagsPrefix] = messageParameters
};
to_messages.regMessage({localStorageFlagsPrefix:"gopro", messageType:to_messages.MessageType.GOPRO, messageTextHtml:null, closeCallback:onMessageClose_hide_and_timestamp, timePeriodToNotDisturbAfterClose:7 * (24 * 60 * 60 * 1E3), messageClickCallback:goProBannerCliked});
to_messages.regMessage({localStorageFlagsPrefix:"warning_identity_is_not_match_the_license_key", messageType:to_messages.MessageType.WARNING, messageTextHtml:"Current Chrome Profile identity does not match current Paid License Key. " + "Possible reason - you logged in to Chrome using the email that was not used to generate the Paid License Key.<br>" + "<br>Paid features will now be disabled.<br>" + "<br>Please set correct License Key or switch Chrome Profile identity to match current License Key to enable them again.<br>" + 
"In case, you feel that this message come out because of some bug please contact support@tabsoutliner.com", closeCallback:onMessageClose_hide_and_timestamp, timePeriodToNotDisturbAfterClose:1 * (24 * 60 * 60 * 1E3)});
to_messages.regMessage({localStorageFlagsPrefix:"warning_chrome_is_not_signed_in", messageType:to_messages.MessageType.WARNING, messageTextHtml:"Current Chrome Profile is not accessible. Possible reason - you are not Signed in to Chrome.<br>" + "<br>Automatic backup and license key validation is not possible. Paid features will now be disabled.<br>" + "<br>Please, Sign in  to Chrome to enable them again.<br><br>" + "In case, you feel that this message come out because of some bug, please contact support@tabsoutliner.com", 
closeCallback:onMessageClose_hide_and_timestamp, timePeriodToNotDisturbAfterClose:1 * (24 * 60 * 60 * 1E3)});
to_messages.regMessage({localStorageFlagsPrefix:"warning_chrome_signed_in_no_email_permission", messageType:to_messages.MessageType.WARNING, messageTextHtml:"Current Chrome Profile Email is not accessible. No Permission Granted.<br>" + "<br>Automatic Backup and License Key validation is not possible. Paid features will now be disabled.<br>" + '<br>Please allow access in <a target="_blank" href="' + chrome.extension.getURL("options.html") + '" role="button">Tabs Outliner Options</a> to enable them.<br><br>' + 
"In case, you feel that this message come out because of some bug, please contact support@tabsoutliner.com", closeCallback:onMessageClose_hide_and_timestamp, timePeriodToNotDisturbAfterClose:1 * (24 * 60 * 60 * 1E3)});
to_messages.regMessage({localStorageFlagsPrefix:"warning_gdrive_access_is_not_authorized", messageType:to_messages.MessageType.WARNING, messageTextHtml:'Backup To Google Drive Currently Disabled! Authorize Google Drive Access In <a target="_blank" href="' + chrome.extension.getURL("options.html") + '" role="button">Tabs Outliner Options</a> To Enable It.', closeCallback:onMessageClose_hide});
to_messages.regMessage({localStorageFlagsPrefix:"test_info", messageType:to_messages.MessageType.INFO, messageTextHtml:"Test Info", closeCallback:null});
to_messages.regMessage({localStorageFlagsPrefix:"test_warning", messageType:to_messages.MessageType.WARNING, messageTextHtml:"Test Warning", closeCallback:null});
to_messages.regMessage({localStorageFlagsPrefix:"test_error", messageType:to_messages.MessageType.ERROR, messageTextHtml:"Test Error", closeCallback:null});
to_messages.rerenderMessages = function() {
  var mainViewMessagesStack = document.getElementById("mainViewMessagesStack");
  mainViewMessagesStack.innerHTML = "";
  var isNoMessagesVisible = true;
  for(var i = 0;i < this.messages_stack.length;i++) {
    var message = this.messages_stack[i];
    if(localStorage["message_" + message.localStorageFlagsPrefix]) {
      this.addMessageDomToMainViewStack(message);
      isNoMessagesVisible = false
    }
  }
  mainViewMessagesStack.style.padding = isNoMessagesVisible ? "0px" : ""
};
to_messages.showMessage = function(key) {
  localStorage["message_" + key] = "on";
  this.rerenderMessages()
};
to_messages.hideMessage = function(key) {
  delete localStorage["message_" + key];
  this.rerenderMessages()
};
function onMessageClose_hide_and_timestamp(messageParams, event) {
  localStorage["message_" + messageParams.localStorageFlagsPrefix + "_closeTimeStamp"] = Date.now();
  to_messages.hideMessage(messageParams.localStorageFlagsPrefix);
  event.stopPropagation()
}
function onMessageClose_hide(messageParams, event) {
  to_messages.hideMessage(messageParams.localStorageFlagsPrefix)
}
function isNotRecentlyInstalled() {
  var installDate = new Date(Number(localStorage["install"]) || 0);
  var daysAfterInstall = Math.abs(installDate.getTime() - Date.now()) / (24 * 60 * 60 * 1E3);
  return daysAfterInstall > 2
}
function showMessage_IfEnoughTimePassedFromLastClose(messageParams) {
  var timePeriodToNotDisturbAfterClose = messageParams.timePeriodToNotDisturbAfterClose;
  var lastCloseTime = parseInt(localStorage["message_" + messageParams.localStorageFlagsPrefix + "_closeTimeStamp"]);
  if(lastCloseTime && lastCloseTime > Date.now()) {
    lastCloseTime = NaN
  }
  if(!lastCloseTime || lastCloseTime + timePeriodToNotDisturbAfterClose < Date.now()) {
    to_messages.showMessage(messageParams.localStorageFlagsPrefix);
    return true
  }
  return false
}
function goProBannerCliked(event) {
  onOptionsClick()
}
function showMainViewGoProBaner_IfEnoughTimePassedFromLastClose() {
  return showMessage_IfEnoughTimePassedFromLastClose(to_messages.messages["gopro"])
}
function showIdentityIsNotLicensedWarning_IfEnoughTimePassedFromLastClose() {
  return showMessage_IfEnoughTimePassedFromLastClose(to_messages.messages["warning_identity_is_not_match_the_license_key"])
}
function showChromeIsNotSignedInWarning_IfEnoughTimePassedFromLastClose() {
  return showMessage_IfEnoughTimePassedFromLastClose(to_messages.messages["warning_chrome_is_not_signed_in"])
}
function showNoEmailPermissionWarning_IfEnoughTimePassedFromLastClose() {
  return showMessage_IfEnoughTimePassedFromLastClose(to_messages.messages["warning_chrome_signed_in_no_email_permission"])
}
function hideAllLicenseRelatedWarnings() {
  to_messages.hideMessage("warning_identity_is_not_match_the_license_key");
  to_messages.hideMessage("warning_chrome_is_not_signed_in");
  to_messages.hideMessage("warning_chrome_signed_in_no_email_permission")
}
function setLicenseState_valid(licenseStateValues) {
  hideAllLicenseRelatedWarnings();
  to_messages.hideMessage("gopro");
  setProMode();
  ga_reportScreeViewIfChanged("Main View - Paid")
}
function setLicenseState_invalid_KeyPresentIdentityIsAccesibleButNotMatchTheLicenseKey(licenseStateValues) {
  hideAllLicenseRelatedWarnings();
  to_messages.hideMessage("gopro");
  var isVisible = showIdentityIsNotLicensedWarning_IfEnoughTimePassedFromLastClose();
  setTrialMode();
  ga_reportScreeViewIfChanged("Main View - Key Present - Invalid")
}
function setLicenseState_invalid_KeyPresentButChromeIsNotSignedIn(licenseStateValues) {
  hideAllLicenseRelatedWarnings();
  to_messages.hideMessage("gopro");
  var isVisible = showChromeIsNotSignedInWarning_IfEnoughTimePassedFromLastClose();
  setTrialMode();
  ga_reportScreeViewIfChanged("Main View - Key Present - Chrome Is Not Signed In")
}
function setLicenseState_invalid_KeyPresentChromeIsSignedInButNoEmailPermission(licenseStateValues) {
  hideAllLicenseRelatedWarnings();
  to_messages.hideMessage("gopro");
  var isVisible = showNoEmailPermissionWarning_IfEnoughTimePassedFromLastClose();
  setTrialMode();
  ga_reportScreeViewIfChanged("Main View - Key Present - Chrome Signed In - No Email Permission")
}
function setLicenseState_invalid_NoLicenseKey(licenseStateValues) {
  hideAllLicenseRelatedWarnings();
  var isVisible = isNotRecentlyInstalled() && showMainViewGoProBaner_IfEnoughTimePassedFromLastClose();
  setTrialMode();
  ga_reportScreeViewIfChanged("Main View - Free - Upgrade Baner " + (isVisible ? "Visible" : "Hidden"))
}
var lastSeenScreen;
function ga_reportScreeViewIfChanged(screenName) {
  if(screenName != lastSeenScreen) {
    chrome.extension.getBackgroundPage().ga_screenview(screenName);
    lastSeenScreen = screenName
  }
}
function backupNowBtn_showBackupInProgressState() {
  var backupNowBtn = document.getElementById("backupNowButton");
  backupNowBtn.innerHTML = '<div id="backupInProgressIndicator">' + '<div id="squaresWaveG_1"></div>' + '<div id="squaresWaveG_2"></div>' + '<div id="squaresWaveG_3"></div>' + '<div id="squaresWaveG_4"></div>' + '<div id="squaresWaveG_5"></div>' + '<div id="squaresWaveG_6"></div>' + '<div id="squaresWaveG_7"></div>' + '<div id="squaresWaveG_8"></div>' + '<div id="squaresWaveG_9"></div>' + '<div id="squaresWaveG_10"></div>' + "</div>"
}
function backupNowBtn_showBackupState(stateStyle) {
  var backupNowBtn = document.getElementById("backupNowButton");
  backupNowBtn.innerHTML = "<div id=" + stateStyle + "></div>"
}
function isbackupNowBtnInRecentlySuccededState() {
  return!!document.getElementById("backupRecentlySucceededIndicator")
}
window["updateBackupIndicator_backgroundPageCall"] = function(gdriveLastSuccessfulBackupTime) {
  if(isbackupNowBtnInRecentlySuccededState() && gdriveLastSuccessfulBackupTime + 1 * 60 * 60 * 1E3 < Date.now()) {
    backupNowBtn_showBackupState("backupSomeTimeAgoSucceededIndicator")
  }
};
window["backupStarted_backgroundPageCall"] = function backupStarted_backgroundPageCall(isUploadStartedPhase) {
  backupNowBtn_showBackupInProgressState()
};
window["onAuthorizationTokenGranted_backgroundPageCall"] = function() {
  to_messages.hideMessage("warning_gdrive_access_is_not_authorized")
};
window["onBackupSucceeded_backgroundPageCall"] = function() {
  backupNowBtn_showBackupState("backupRecentlySucceededIndicator")
};
window["onGdriveAccessRewoked_backgroundPageCall"] = function() {
  to_messages.showMessage("warning_gdrive_access_is_not_authorized");
  backupNowBtn_showBackupState("backupFailedIndicator")
};
window["noConnectionError_backgroundPageCall"] = function(operationInitiatorId) {
  alertErrorMessageIfOurWindowIsOperationInitiator(operationInitiatorId, "A network error occurred, and the request could not be completed. Check your Internet connection.");
  backupNowBtn_showBackupState("backupFailedIndicator")
};
window["backupError_backgroundPageCall"] = function(operationInitiatorId, errorCode, errorMessage) {
  alertErrorMessageIfOurWindowIsOperationInitiator(operationInitiatorId, "Error during Backup operation, try again later. Error message returned by the server:" + errorMessage + "; Error code:" + errorCode);
  backupNowBtn_showBackupState("backupFailedIndicator")
};
function alertErrorMessageIfOurWindowIsOperationInitiator(operationInitiatorId, errorMessage) {
  if(operationInitiatorId == backupOperationId_) {
    setTimeout(function() {
      alert(errorMessage)
    }, 1)
  }
}
function createProFeatureUsageInLiteModeDialogDom(document) {
  var r = document.createElement("div");
  r.id = "proFeatureUsedInLiteModeAlert";
  r.className = "modal";
  r.innerHTML = '<div class="goProAlertBlock">' + "<div>Keyboard shortcuts, context menu, clipboard operations, backup to Google Drive - all of this is disabled in the Free Mode." + "To enable them you need to Upgrade into the Paid Mode.</div>" + '<button id=modalEditPrompt-cancellBtn class="form_btn btn_cancell" tabindex=-1>Close</button> <button id=modalEditPrompt-okBtn class="form_btn btn_ok" tabindex=-1>Upgrade</button>' + '<br style="clear:both"/>' + "</div>";
  return r
}
function initProFeatureUsageInLiteModeDialog(window_) {
  return initModalDialog_(window_, null, createProFeatureUsageInLiteModeDialogDom)
}
var activateProFeatureUsageInLiteModeDialog = initProFeatureUsageInLiteModeDialog(window);
chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews();

