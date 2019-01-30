// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
document.getElementById("doNotAutoscroll").checked = !!localStorage["doNotAutoscroll"];
document.getElementById("doNotAutoscroll").onchange = onchange_doNotAutoscroll;
document.getElementById("openOnStatup").checked = !!localStorage["openOnStatup"];
document.getElementById("openOnStatup").onchange = onchange_openOnStatup;
document.getElementById("treeStyleTabs").checked = !!localStorage["relateNewTabToOpener"];
document.getElementById("treeStyleTabs").onchange = onchange_treeStyleTabs;
document.getElementById("oneClickToOpen").checked = !!localStorage["oneClickToOpen"];
document.getElementById("oneClickToOpen").onchange = onchange_oneClickToOpen;
document.getElementById("showBackupNowBtn").checked = !!localStorage["showBackupNowBtn"];
document.getElementById("showBackupNowBtn").onchange = onchange_showBackupNowBtn;
document.getElementById("experimentalLightBackground").checked = !!localStorage["experimentalLightBackground"];
document.getElementById("experimentalLightBackground").onchange = onchange_experimentalLightBackground;
document.getElementById("openSavedWindowsInOriginalPos").checked = !!localStorage["openSavedWindowsInOriginalPos"];
document.getElementById("openSavedWindowsInOriginalPos").onchange = onchange_openSavedWindowsInOriginalPos;
document.getElementById("openTabsOutlinerInLastClosedPos").checked = !!localStorage["openTabsOutlinerInLastClosedPos"];
document.getElementById("openTabsOutlinerInLastClosedPos").onchange = onchange_openTabsOutlinerInLastClosedPos;
function onchange_openTabsOutlinerInLastClosedPos() {
  if(this.checked) {
    localStorage["openTabsOutlinerInLastClosedPos"] = "true"
  }else {
    delete localStorage["openTabsOutlinerInLastClosedPos"]
  }
}
function onchange_openSavedWindowsInOriginalPos() {
  if(this.checked) {
    localStorage["openSavedWindowsInOriginalPos"] = "true"
  }else {
    delete localStorage["openSavedWindowsInOriginalPos"]
  }
}
function onchange_doNotAutoscroll() {
  if(this.checked) {
    localStorage["doNotAutoscroll"] = "true"
  }else {
    delete localStorage["doNotAutoscroll"]
  }
}
function onchange_openOnStatup() {
  if(this.checked) {
    localStorage["openOnStatup"] = "true"
  }else {
    delete localStorage["openOnStatup"]
  }
}
function onchange_treeStyleTabs() {
  if(this.checked) {
    localStorage["relateNewTabToOpener"] = "true"
  }else {
    delete localStorage["relateNewTabToOpener"]
  }
}
function onchange_experimentalLightBackground() {
  if(this.checked) {
    localStorage["experimentalLightBackground"] = "true"
  }else {
    delete localStorage["experimentalLightBackground"]
  }
  optionsChanged_notifyAllViews("colors")
}
function onchange_oneClickToOpen() {
  if(this.checked) {
    localStorage["oneClickToOpen"] = "true"
  }else {
    delete localStorage["oneClickToOpen"]
  }
  optionsChanged_notifyAllViews("oneClickToOpen")
}
function onchange_showBackupNowBtn() {
  if(this.checked) {
    localStorage["showBackupNowBtn"] = "true"
  }else {
    delete localStorage["showBackupNowBtn"]
  }
  optionsChanged_notifyAllViews("showBackupNowBtn")
}
function optionsChanged_notifyAllViews(changedOption) {
  chrome.extension.getBackgroundPage()["optionsChanged_notifyAllViews"](changedOption)
}
[].slice.call(document.getElementsByClassName("showMoreContent")).forEach(function(item) {
  item.onclick = onShowMoreClick
});
function onShowMoreClick(event) {
  var moreContentEl = document.getElementById(event.target.getAttribute("name"));
  if(!moreContentEl) {
    return
  }
  moreContentEl.style.display = "block";
  event.target.style.display = "none"
}
var URL = window.URL || (window.webkitURL || window);
document.getElementById("exportToFile").addEventListener("click", exportToFile);
function exportToFile() {
  document.getElementById("exporteBlobUrl").innerHTML = "";
  window.chrome.extension.getBackgroundPage().saveCurrentSessionAsFileNow(function(fileEntry, blob) {
    var filename = "tree-exported-" + (new Date).toDateString().replace(/ /g, "-") + ".tree";
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    function click(node) {
      var eventMouseClick = document.createEvent("MouseEvents");
      eventMouseClick.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      node.dispatchEvent(eventMouseClick)
    }
    document.getElementById("exporteBlobUrl").innerHTML = '<a download="' + filename + '" href="' + fileEntry.toURL() + '">Exported Data  - right click and save it to filesystem by context menu item "Save link as..."</a>';
    save_link.href = URL.createObjectURL(blob);
    save_link.download = filename;
    click(save_link)
  })
}
document.getElementById("viewExportedFile").addEventListener("change", handleFileSelect_viewExportedFile, false);
function handleFileSelect_viewExportedFile(evt) {
  var files = evt.target.files;
  var output = [];
  for(var i = 0, file;file = files[i];i++) {
    viewExportedFile(file)
  }
}
function viewExportedFile(file) {
  chrome.extension.getBackgroundPage().storeUserSelectedFile(file);
  viewTree("selectedFile", file.lastModifiedDate, file.size, true, true)
}
function registerColorOverrideControlsListener(overrideOptionId, colorSelectorId) {
  document.getElementById(overrideOptionId).checked = !!localStorage[overrideOptionId];
  if(localStorage[colorSelectorId]) {
    document.getElementById(colorSelectorId).value = localStorage[colorSelectorId]
  }
  function onchange_listener() {
    if(document.getElementById(overrideOptionId).checked) {
      localStorage[overrideOptionId] = "true"
    }else {
      delete localStorage[overrideOptionId]
    }
    localStorage[colorSelectorId] = document.getElementById(colorSelectorId).value;
    optionsChanged_notifyAllViews("colors")
  }
  document.getElementById(overrideOptionId).onchange = onchange_listener;
  document.getElementById(colorSelectorId).onchange = onchange_listener
}
registerColorOverrideControlsListener("overrideSavedTabColor", "savedTabTextColor");
registerColorOverrideControlsListener("overrideOpenTabColor", "openTabTextColor");
registerColorOverrideControlsListener("overrideCurrentTabColor", "currentTabTextColor");
registerColorOverrideControlsListener("overrideNoteTextColor", "noteTextColor");
document.getElementById("dropInvalidLicenseKey").addEventListener("click", dropInvalidLicenseKey);
document.getElementById("enableTrialBackupBtn").addEventListener("click", initiateEnableBackupUiTrialSequence);
document.getElementById("testNoIdentityEmailPermissionGrantedWarning").addEventListener("click", showNoIdentityEmailPermissionGrantedWarning);
document.getElementById("testNotSignedInToChromeWarning").addEventListener("click", showNotSignedInToChromeWarning);
function addHtmlMessage(areaElementId, clearAreaBeforeAdd, htmlMessage) {
  var messagesArea = document.getElementById(areaElementId);
  if(clearAreaBeforeAdd) {
    messagesArea.innerHTML = ""
  }
  var div = document.createElement("div");
  div.innerHTML = htmlMessage;
  while(div.children.length > 0) {
    var lastInsertedElement = messagesArea.insertBefore(div.children[0], null)
  }
  messagesArea.scrollIntoView();
  return lastInsertedElement
}
function addHeaderWarning(messageHtml) {
  addHtmlMessage("headerWarningMessageArea", false, messageHtml);
  window.scrollTo(0, 0)
}
function showIdentityAccessErrorWarning(messageHtml) {
  addHtmlMessage("identityAccessWarningsMessageArea-Pro", true, messageHtml);
  addHtmlMessage("identityAccessWarningsMessageArea-Backup", false, messageHtml)
}
function clearIdentityAccessErrorWarnings() {
  document.getElementById("identityAccessWarningsMessageArea-Pro").innerHTML = "";
  document.getElementById("identityAccessWarningsMessageArea-Backup").innerHTML = ""
}
function showNoIdentityEmailPermissionGrantedWarning() {
  showIdentityAccessErrorWarning('<div class="mainViewMessage" type="warning">' + '<span class="mainViewMessageIcon"></span>' + '<div class="mainViewMessageBody">Warning: Permission to access Chrome Profile email address is not granted. To validate your license key and further configure online backup to your Google Drive account, Tabs Outliner needs access to your Chrome Profile identity and email. Please grant access.</div>' + "</div>")
}
function showNotSignedInToChromeWarning() {
  showIdentityAccessErrorWarning('<div class="mainViewMessage" type="warning">' + '<span class="mainViewMessageIcon"></span>' + '<div class="mainViewMessageBody">Warning: Chrome is not Signed In. <p>Chrome Sign In required to validate your license key and to configure online backup on your Google Drive account. Please <button name=signInToChromeBtn>Sign In to Chrome</button> and try again. <p>Alternatively you can open <b>Sign In to Chrome</b> dialog from Chrome settings, or by clicking the Profile name on the top right of any normal Chrome window (above the tabs strip).</div>' +
  "</div>");
  [].slice.call(document.getElementsByName("signInToChromeBtn")).forEach(function(item) {
    item.onclick = signInToChrome
  })
}
function show401Error() {
  if(document.getElementById("noGdriveAccessGrantedErrorWarning")) {
    return
  }
  addHeaderWarning('<div id=noGdriveAccessGrantedErrorWarning class="mainViewMessage" type="warning">' + '<span class="mainViewMessageIcon"></span>' + '<div class="mainViewMessageBody">Backup To Google Drive Currently Disabled! <button id=authorizeBtnInMessage>Authorize Google Drive Access</button> To Enable It.</div>' + "</div>");
  document.getElementById("authorizeBtnInMessage").onclick = manualAuth_listGdriveFiles
}
function hide401Error() {
  var message = document.getElementById("noGdriveAccessGrantedErrorWarning");
  if(message) {
    message.parentElement.removeChild(message)
  }
}
if(document.getElementById("enterLicenseKeyBtn")) {
  document.getElementById("enterLicenseKeyBtn").addEventListener("click", function(event) {
    clearIdentityAccessErrorWarnings();
    requestIdentityPermisionsContinueIfGrantedShowErrorsIfNot(showEnterLicenseKeyDialog)
  })
}
document.getElementById("allowEmailAccessBtn-pro").addEventListener("click", function(event) {
  chrome.extension.getBackgroundPage().ga_event("Grant Email Access Button Clicked - Pro Tab");
  showEmailAccessExplanation_continueToRequestIdentityPermissions_continueToRevalidateLicenseKey()
});
document.getElementById("buyLicenseKeyBtn-pro").addEventListener("click", function(event) {
  chrome.extension.getBackgroundPage().ga_event("Buy Button Clicked - Pro Tab");
  initiateBuyLicenseKeySequence()
});
document.getElementById("buyLicenseKeyBtn-backup").addEventListener("click", function(event) {
  chrome.extension.getBackgroundPage().ga_event("Buy Button Clicked - Backup Tab");
  switchToProTab();
  initiateBuyLicenseKeySequence()
});
function switchToProTab() {
  var tab_pro = document.getElementById("tab-pro");
  tab_pro && (tab_pro.checked = true)
}
function initiateBuyLicenseKeySequence() {
  clearIdentityAccessErrorWarnings();
  if_NotSignedInOrSignedInAndEmailGranted_Else_ChromeSignedInbutEmailNotGranted(requestIdentityPermissions_continueToPaymentFlow, showEmailAccessExplanation_requestIdentityPermissions_continueToPaymentFlow)
}
function initiateEnableBackupUiTrialSequence() {
  chrome.extension.getBackgroundPage().ga_event("Request Backup Controls Trial");
  clearIdentityAccessErrorWarnings();
  if_NotSignedInOrSignedInAndEmailGranted_Else_ChromeSignedInbutEmailNotGranted(requestIdentityPermissions_continueToEnableBackupTrialControls, showEmailAccessExplanation_requestIdentityPermissions_continueToEnableBackupTrialControls)
}
function showEmailAccessExplanation_requestIdentityPermissions_continueToPaymentFlow() {
  showBeforeEmailAccessExplanation(requestIdentityPermissions_continueToPaymentFlow, "Payment Process")
}
function showEmailAccessExplanation_requestIdentityPermissions_continueToEnableBackupTrialControls() {
  showBeforeEmailAccessExplanation(requestIdentityPermissions_continueToEnableBackupTrialControls, "Backup Trial")
}
function showEmailAccessExplanation_continueToRequestIdentityPermissions_continueToRevalidateLicenseKey() {
  showBeforeEmailAccessExplanation(requestIdentityPermissions_continueToRevalidateLicenseKey, "")
}
function showBeforeEmailAccessExplanation(onBuyLicenseKeyDialogContinue, identityAccessExplanationNextStepTitle) {
  chrome.extension.getBackgroundPage().ga_event("Email Access Explanation Shown - " + identityAccessExplanationNextStepTitle);
  activateBeforeIdentityAccessExplanationDialog(null, identityAccessExplanationNextStepTitle, onBuyLicenseKeyDialogContinue)
}
function requestIdentityPermissions_continueToPaymentFlow() {
  requestIdentityPermisionsContinueIfGrantedShowErrorsIfNot(showBuyLicenseKeyDialog_afterIdentityAccess)
}
function showBuyLicenseKeyDialog_afterIdentityAccess(userInfo) {
  chrome.extension.getBackgroundPage().calculateSerialNumber_promise(userInfo.email).then(function(serialNumber) {
    openFastSpringBuyPage(serialNumber)
  })
}
function openFastSpringBuyPage(serialNumberHex) {
  chrome.windows.create({url:"http://sites.fastspring.com/tabsoutliner/product/tabsoutliner?referrer=" + serialNumberHex, focused:true}, function() {
    chrome.extension.getBackgroundPage().ga_event("Shopping Cart Opened")
  })
}
function requestIdentityPermisionsContinueIfGrantedShowErrorsIfNot(continueCallback) {
  chrome.extension.getBackgroundPage().ga_event_access_states("Email Access - Request", "R", "R", null);
  requestIdentityEmailPermission(function(granted) {
    if(granted) {
      chrome.identity.getProfileUserInfo(function(userInfo) {
        if(!userInfo.email) {
          showNotSignedInToChromeWarning();
          chrome.extension.getBackgroundPage().ga_event_access_states("Email Access - NotSignedIn", "N", "Y", null)
        }else {
          continueCallback(userInfo);
          chrome.extension.getBackgroundPage().ga_event_access_states("Email Access - Allowed", "Y", "Y", null)
        }
      })
    }else {
      showNoIdentityEmailPermissionGrantedWarning();
      chrome.extension.getBackgroundPage().ga_event_access_states("Email Access - Declined", null, "N", null)
    }
  })
}
function requestIdentityEmailPermission(callback) {
  chrome.permissions.request({permissions:["identity.email"], origins:[]}, callback)
}
function if_NotSignedInOrSignedInAndEmailGranted_Else_ChromeSignedInbutEmailNotGranted(alreadyGranted_Or_NotSignedIn_Callback, notYetgranted_And_SignedIn_Callback) {
  chrome.permissions.contains({permissions:["identity.email"], origins:[]}, function(result) {
    if(result) {
      alreadyGranted_Or_NotSignedIn_Callback()
    }else {
      notYetgranted_And_SignedIn_Callback()
    }
  })
}
document.getElementById("test_setLicenseState_valid").addEventListener("click", function(event) {
  requestIdentityEmailPermission(function(granted) {
    if(granted) {
      chrome.identity.getProfileUserInfo(function(userInfo) {
        chrome.extension.getBackgroundPage().setLicenseKey(userInfo.email);
        chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews()
      })
    }else {
      alert("Permission To Access Identity.Email Not Granted")
    }
  })
});
document.getElementById("test_setLicenseState_invalidLicenseState_IncorectIdentity").addEventListener("click", function(event) {
  requestIdentityEmailPermission(function(granted) {
    if(granted) {
      chrome.extension.getBackgroundPage().setLicenseKey("IncorectLicenseKey");
      chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews()
    }else {
      alert("Permission To Access Identity.Email Not Granted")
    }
  })
});
document.getElementById("test_setLicenseState_invalidLicenseState_KeyPresentButNoAccessToUserIdentity").addEventListener("click", function(event) {
  requestIdentityEmailPermission(function(granted) {
    if(granted) {
      alert("Permission To Access Identity.Email Granted, will rewoke it now");
      chrome.permissions.remove({permissions:["identity.email"], origins:[]}, function(removed) {
        if(removed) {
          alert("The permissions have been removed")
        }else {
          alert("The permissions have not been removed")
        }
      })
    }else {
      alert("OK - Permission To Access Identity.Email Not Granted")
    }
  });
  chrome.extension.getBackgroundPage().setLicenseKey("SomeLicenseKey");
  chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews()
});
document.getElementById("test_setLicenseState_invalidLicenseState_KeyPresentButNoAccessToUserIdentity2").addEventListener("click", function(event) {
  alert("LogOut From Chrome");
  chrome.extension.getBackgroundPage().setLicenseKey("SomeLicenseKey");
  chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews()
});
document.getElementById("test_setLicenseState_invalidLicenseState_NoLicenseKey").addEventListener("click", function(event) {
  chrome.extension.getBackgroundPage().setLicenseKey("");
  chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews()
});
function setProTabToLicenseSetState(blockIdToShow, licenseStateValues) {
  document.getElementById("licenseKeyValidProTabBlock").style.display = "none";
  document.getElementById("licenseKeyAbsentProTabBlock").style.display = "none";
  document.getElementById("licenseKeyNotMatchUserIdentityProTabBlock").style.display = "none";
  document.getElementById("licenseKeyPresentButChromeIsNotSignedInProTabBlock").style.display = "none";
  document.getElementById("licenseKeyPresentButEmailPermissionIsNotGrantedProTabBlock").style.display = "none";
  document.getElementById(blockIdToShow).style.display = "";
  if(licenseStateValues && licenseStateValues.licenseKey) {
    Array.prototype.forEach.call(document.getElementsByName("licensee"), function(item, index) {
      item.innerText = licenseStateValues.licenseKey.licenseeEmail
    })
  }
}
function setBackupTabToLicenseSetState(blockIdToShow) {
  document.getElementById("licenseKeyAbsentBackupTabBlock").style.display = "none";
  document.getElementById("licenseKeyPresentBackupTabBlock").style.display = "none";
  document.getElementById(blockIdToShow).style.display = ""
}
function console_log_licenseKey(header) {
  console.log(header);
  console.log("License Keys:");
  chrome.extension.getBackgroundPage().console_log_licenseKeysLinks(console);
  console.log("To Drop License Keys type: localStorage.licenseKeys_ = localStorage.licenseKeys; delete localStorage.licenseKeys; or dropkey()")
}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value
  });
  return vars
}
function processUrlSetKeyCommand() {
  var urlVars = getUrlVars();
  if(urlVars["setkey"]) {
    if(!chrome.extension.getBackgroundPage().setLicenseKey(urlVars["setkey"])) {
      setTimeout(function() {
        alert("Submitted Pro License Key is not valid.\n\nIf you feel that you see this message by mistake please contact support@tabsoutliner.com")
      }, 100)
    }
    showBackupNowBtnOnMainToolbar()
  }
}
function showBackupNowBtnOnMainToolbar() {
  document.getElementById("showBackupNowBtn").checked = true;
  document.getElementById("showBackupNowBtn").onchange(null)
}
function enableTestButtons() {
  document.getElementById("testButtonsBlock").style.display = ""
}
function revalidateLicenseKey() {
  chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews()
}
function requestIdentityPermissions_continueToRevalidateLicenseKey() {
  requestIdentityPermisionsContinueIfGrantedShowErrorsIfNot(revalidateLicenseKey)
}
function requestIdentityPermissions_continueToEnableBackupTrialControls() {
  requestIdentityPermisionsContinueIfGrantedShowErrorsIfNot(enableBackupTrialControls)
}
function enableBackupTrialControls() {
  setBackupTabToLicenseSetState("licenseKeyPresentBackupTabBlock");
  addGapiScript_setAuthToken_listGdriveFiles();
  chrome.extension.getBackgroundPage().ga_screenview("Backup Trial UI")
}
var isChromeSignInRequestedFromWarning = false;
function signInToChrome(skipReport) {
  isChromeSignInRequestedFromWarning = true;
  if(!skipReport) {
    chrome.extension.getBackgroundPage().ga_event_access_states("Chrome Not SignedIn Warning - SignIn Btn Clicked", "R", null, null)
  }
  chrome.identity.getAuthToken({"interactive":true, "scopes":[""]}, function(token) {
    console.log("##############################")
  })
}
var signInToChromeBtn_keyPresentBlock = document.getElementById("signInToChromeBtn_keyPresentBlock");
if(signInToChromeBtn_keyPresentBlock) {
  signInToChromeBtn_keyPresentBlock.onclick = function(event) {
    chrome.extension.getBackgroundPage().ga_event_access_states("Chrome Is Not SignedIn - Key Present Block - SignIn Btn Clicked", "R", null, null);
    signInToChrome(true)
  }
}
function setBackupControlsStateToTrialMode(isTrial) {
  if(isTrial) {
    setBackupTabToLicenseSetState("licenseKeyAbsentBackupTabBlock");
    document.getElementById("trialModeBackupWarning").style.display = ""
  }else {
    setBackupTabToLicenseSetState("licenseKeyPresentBackupTabBlock");
    document.getElementById("trialModeBackupWarning").style.display = "none"
  }
}
var PRO_LICENSE_KEY_VALID = false;
function setLicenseState_valid(licenseStateValues) {
  PRO_LICENSE_KEY_VALID = true;
  setProTabToLicenseSetState("licenseKeyValidProTabBlock", licenseStateValues);
  setBackupControlsStateToTrialMode(false);
  addGapiScript_setAuthToken_listGdriveFiles();
  console_log_licenseKey("License Key Valid");
  reportScreeViewIfChanged("Options - Paid")
}
function setLicenseState_invalid_KeyPresentIdentityIsAccesibleButNotMatchTheLicenseKey(licenseStateValues) {
  setProTabToLicenseSetState("licenseKeyNotMatchUserIdentityProTabBlock", licenseStateValues);
  setBackupControlsStateToTrialMode(false);
  addGapiScript_setAuthToken_listGdriveFiles();
  console_log_licenseKey("License Key does not match User Identity");
  reportScreeViewIfChanged("Options - Key Present - Invalid")
}
function setLicenseState_invalid_KeyPresentButChromeIsNotSignedIn(licenseStateValues) {
  setProTabToLicenseSetState("licenseKeyPresentButChromeIsNotSignedInProTabBlock", licenseStateValues);
  setBackupControlsStateToTrialMode(false);
  addGapiScript_setAuthToken_listGdriveFiles();
  console_log_licenseKey("Key Present - Chrome Is Not Signed In");
  reportScreeViewIfChanged("Options - Key Present - Chrome Is Not Signed In")
}
function setLicenseState_invalid_KeyPresentChromeIsSignedInButNoEmailPermission(licenseStateValues) {
  setProTabToLicenseSetState("licenseKeyPresentButEmailPermissionIsNotGrantedProTabBlock", licenseStateValues);
  setBackupControlsStateToTrialMode(false);
  addGapiScript_setAuthToken_listGdriveFiles();
  console_log_licenseKey("Key Present - Chrome Signed In - No Email Permission");
  reportScreeViewIfChanged("Options - Key Present - Chrome Signed In - No Email Permission")
}
function setLicenseState_invalid_NoLicenseKey(licenseStateValues) {
  setProTabToLicenseSetState("licenseKeyAbsentProTabBlock");
  setBackupControlsStateToTrialMode(true);
  if(isChromeSignInRequestedFromWarning && licenseStateValues.onSignInChanged_isSignedIn) {
    isChromeSignInRequestedFromWarning = false;
    chrome.extension.getBackgroundPage().ga_event_access_states("Chrome Not SignedIn Warning - SignIn Success", "Y", null, null);
    clearIdentityAccessErrorWarnings();
    chrome.tabs.getCurrent(function(tab) {
      setTimeout(function() {
        chrome.windows.update(tab.windowId, {focused:true}, null);
        chrome.tabs.update(tab.id, {active:true}, null)
      }, 3E3)
    });
    alert("Chrome has been successfully Signed In.\n\nYou can now continue Tabs Outliner purchase process.")
  }
  console.log("No License Key present; try localStorage.licenseKeys = localStorage.licenseKeys_; or returnkey()");
  reportScreeViewIfChanged("Options - Free")
}
function dropInvalidLicenseKey() {
  chrome.extension.getBackgroundPage().ga_event("Drop Invalid License Key Btn Clicked");
  dropkey()
}
function dropkey() {
  localStorage.licenseKeys_ = localStorage.licenseKeys;
  delete localStorage.licenseKeys;
  chrome.storage.sync.remove("licenseKeys");
  chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews()
}
function isEmailPemissionPresent(callback) {
  chrome.permissions.contains({permissions:["identity.email"], origins:[]}, function(result) {
    if(result) {
      console.log("identity.email permission present");
      callback && callback(true)
    }else {
      console.log("identity.email permission absent");
      callback && callback(false)
    }
  })
}
function dropEmailPemission() {
  isEmailPemissionPresent(function(isPresent) {
    chrome.permissions.remove({permissions:["identity.email"], origins:[]}, function(removed) {
      console.log("removed status:", removed);
      isEmailPemissionPresent();
      if(removed) {
      }else {
      }
    })
  })
}
function returnkey() {
  localStorage.licenseKeys = localStorage.licenseKeys_
}
var lastSeenScreen;
function reportScreeViewIfChanged(screenName) {
  if(screenName != lastSeenScreen) {
    chrome.extension.getBackgroundPage().ga_screenview(screenName);
    lastSeenScreen = screenName
  }
}
console.log("Type enableTestButtons() for messages tests");
console.log("Use Account Permissions to test rewoked access to GDrive");
console.log("dropEmailPermission() to test rewoked access to email");
processUrlSetKeyCommand();
chrome.extension.getBackgroundPage().checkAndUpdateLicenseStatusInAllViews();

