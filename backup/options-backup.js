// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var BACKUP_FILENAME = chrome.extension.getBackgroundPage()["BACKUP_FILENAME"];
function insertAfter(referenceElement, newElement) {
  referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling)
}
function getHtmlElementById(elementId) {
  return document.getElementById(elementId)
}
function deleteChildNodes(elementId) {
  var elem = document.getElementById(elementId);
  if(elem) {
    elem.innerHTML = ""
  }
}
function deleteElementFromPage(elementId) {
  var elem = document.getElementById(elementId);
  if(elem) {
    elem.parentNode.removeChild(elem)
  }
}
function createElement(type, atributes) {
  var elem = document.createElement(type);
  for(a in atributes || {}) {
    elem[a] = atributes[a]
  }
  return elem
}
function hideHtmlElement(elementId) {
  var elem = getHtmlElementById(elementId);
  if(elem) {
    elem.style.display = "none"
  }
}
function showHtmlElement(elementId) {
  var elem = getHtmlElementById(elementId);
  if(elem) {
    elem.style.display = null
  }
}
function addGapiScript_setAuthToken_listGdriveFiles() {
  window.setTimeout(function() {
    var gapiscript = document.createElement("script");
    gapiscript.type = "text/javascript";
    gapiscript.src = "https://apis.google.com/js/client.js?onload=setAuthToken_listGdriveFiles";
    gapiscript.addEventListener("error", function(e) {
      console.error("Error loading GAPI, possible reason - no Internet connection", e);
      alert("Error loading Google Drive comunication interface, possible reason - no Internet connection. Resolve the problem and refresh this page. \n\nErrorMessage:" + e);
      chrome.extension.getBackgroundPage().ga_event_error("Options - List Gdrive Files Error", "GAPI Loading Error - No Connection")
    });
    document.head.appendChild(gapiscript)
  }, 1)
}
function manualAuth_listGdriveFiles(event) {
  event.target.innerText = "Please Wait For Authorize Popup and click Allow...";
  setAuthToken_listGdriveFiles(true)
}
function setAuthToken_listGdriveFiles(interactive) {
  if(interactive) {
    chrome.extension.getBackgroundPage().ga_event_access_states("Gdrive Access Request", null, null, "R")
  }
  chrome.identity.getAuthToken({"interactive":!!interactive}, function(token) {
    if(token) {
      chrome.extension.getBackgroundPage().authTokenGranted_notifyAllOpenedViews();
      hideAuthorizeGdriveAccessControls();
      gapi.auth.setToken({"access_token":token});
      listGdriveBackups();
      if(interactive) {
        chrome.extension.getBackgroundPage().ga_event_access_states("Gdrive Access Granted", null, null, "Y")
      }
    }else {
      console.error("Auth token undefined. chrome.runtime.lastError:", chrome.runtime.lastError);
      if(interactive) {
        alert("Error: " + chrome.runtime.lastError.message)
      }
      chrome.extension.getBackgroundPage().authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews();
      if(interactive) {
        chrome.extension.getBackgroundPage().ga_event_access_states("Gdrive Access Declined - " + chrome.runtime.lastError.message, null, null, "N")
      }
    }
  })
}
function show401Error_showAuthorizeGdriveAccessControls() {
  show401Error();
  showAuthorizeGdriveAccessControls();
  deleteChildNodes("gdriveBackupsListTable")
}
function showAuthorizeGdriveAccessControls() {
  document.getElementById("authorizeButton").innerText = originalAuthorizeButtonText;
  showHtmlElement("authorizeDiv")
}
function hideAuthorizeGdriveAccessControls() {
  hideHtmlElement("authorizeDiv")
}
function listGdriveBackups() {
  gapi.client.request({"path":"/drive/v2/files", "params":{"q":"'appdata' in parents", "maxResults":1E3}}).execute(function(response) {
    renderGdriveBackupsList(response.items);
    if(!response.items) {
      console.error("ERROR obtainig list of backup files from Gdrive", response)
    }
    if(response["error"]) {
      if(response["error"]["code"] == 401) {
        chrome.extension.getBackgroundPage().authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews()
      }
      chrome.extension.getBackgroundPage().ga_event_error("Options - Error Requesting Backups List From Gdrive", response["error"] || response["error"]["message"])
    }
  })
}
function isTabsOutlinerBackupFile(item) {
  return item["title"].indexOf(BACKUP_FILENAME) >= 0
}
function byTimesaved(o1, o2) {
  return o2["timesaved"] - o1["timesaved"]
}
function renderGdriveBackupsList(items) {
  deleteChildNodes("gdriveBackupsListTable");
  deleteElementFromPage("backupNowBtn");
  var itemsListElement = getHtmlElementById("gdriveBackupsListTable");
  if(items) {
    items.forEach(function(dirEntry) {
      dirEntry["timesaved"] = (new Date(dirEntry["modifiedDate"])).getTime()
    });
    items = items.filter(isTabsOutlinerBackupFile).sort(byTimesaved);
    renderItems(items, itemsListElement)
  }else {
    itemsListElement.innerHTML = '<div class="backupsListEntry">Cannot Access Files List</div>'
  }
  insertAfter(getHtmlElementById("gdriveBackupsList"), createBackupNowBtn())
}
function renderItems(items, itemsListElement) {
  for(var i = 0;i < items.length;i++) {
    var item = items[i];
    function getMachineLabel(item) {
      var machineLabel;
      try {
        machineLabel = JSON.parse(item["description"])["machineLabel"]
      }catch(e) {
      }
      return machineLabel ? "[" + machineLabel + "] " : ""
    }
    function getGdriveFileSizeLabel(item) {
      return item["fileSize"] ? " (" + Math.ceil(Number(item["fileSize"]) / 1024) + " KB)" : ""
    }
    function getAutoManualLabel(item) {
      var isManual;
      try {
        return JSON.parse(item["description"])["manual"] ? " manually" : " automatically"
      }catch(e) {
      }
      return""
    }
    function makeBackupTitle(item) {
      var timesaved = new Date(item["timesaved"]);
      var r = getMachineLabel(item) + "Backup" + getGdriveFileSizeLabel(item) + getAutoManualLabel(item) + " saved at " + timesaved.toLocaleTimeString() + ", " + timesaved.toLocaleDateString();
      return r
    }
    var title = createElement("td", {innerText:makeBackupTitle(item)});
    var delBtn = createElement("button", {type:"button", innerText:"Delete", itemId:item["id"], backupItemEntryId:item["id"], path:item["downloadUrl"], isLocal:!!item["isLocalFile"], onclick:deleteBackup});
    var viewBtn = createElement("button", {type:"button", innerText:"View", itemId:item["id"], path:item["downloadUrl"], timesaved:item["timesaved"], isLocal:!!item["isLocalFile"], fileSize:item["fileSize"], onclick:viewBackup});
    var backupsListEntry = createElement("tr", {"className":"backupsListEntry", "id":item["id"]});
    backupsListEntry.appendChild(title);
    backupsListEntry.appendChild(createElement("td")).appendChild(delBtn);
    backupsListEntry.appendChild(createElement("td")).appendChild(viewBtn);
    itemsListElement.appendChild(backupsListEntry)
  }
  if(items.length == 0) {
    itemsListElement.innerHTML = '<div class="backupsListEntry">Backup Files Do Not Created Yet</div>'
  }
}
function listLocalBackups() {
  chrome.extension.getBackgroundPage().listAllFiles(function(entries) {
    var pattern = new RegExp("(.)-backup-([\\d]*)-[\\d]*\\.json");
    var nowTime = Date.now();
    var sortedBackupFilesWithTime = entries.filter(function(dirEntry) {
      return dirEntry.isFile && pattern.test(dirEntry.name)
    }).map(function(dirEntry) {
      return{"dirEntry":dirEntry, "timesaved":Number(dirEntry.name.match(pattern)[2]), "id":"id" + dirEntry.name.match(pattern)[2], "downloadUrl":dirEntry.fullPath, "isLocalFile":true, "description":""}
    }).sort(function(o1, o2) {
      return Math.abs(o1["timesaved"] - nowTime) - Math.abs(o2["timesaved"] - nowTime)
    });
    deleteChildNodes("localBackupsListTable");
    renderItems(sortedBackupFilesWithTime, getHtmlElementById("localBackupsListTable"))
  })
}
function createBackupNowBtn() {
  var r = document.createElement("div");
  r.id = "backupNowBtn";
  r.class = "button";
  r.innerText = "Backup Now";
  r.onclick = backupNow;
  return r
}
function viewBackup(event) {
  var item = this;
  var path = item.path;
  var isLocal = item.isLocal;
  var timestamp = new Date(Number(item.timesaved));
  var itemId = item.itemId;
  var fileSize = Number(item.fileSize);
  if(isLocal && !PRO_LICENSE_KEY_VALID) {
    alert("You need to buy Paid Mode License Key to enable this feature.");
    return
  }
  viewTree(path, timestamp, fileSize, isLocal, false)
}
function viewTree(path, timestamp, fileSize, isLocal, isUserSelectedFile) {
  chrome.windows.create({url:"backup/backupview/view_tree.html?path=" + encodeURIComponent(path) + "&timestamp=" + timestamp.getTime() + "&fileSize=" + fileSize + "&isLocal=" + isLocal + "&isUserSelectedFile=" + isUserSelectedFile, width:500}, null)
}
function deleteBackup(event) {
  var element = this;
  var t = Date.now();
  var isConfirmed = confirm("Are You Sure?");
  if(Date.now() - t < 30) {
    isConfirmed = true
  }
  if(isConfirmed) {
    deleteElementFromPage(element.backupItemEntryId);
    if(element.isLocal) {
      deleteLocalBackup(element.path, listLocalBackups)
    }else {
      setAuthToken_deleteGdriveBackup(element.itemId, listGdriveBackups)
    }
  }
}
function setAuthToken_deleteGdriveBackup(fileId, continueCallback) {
  chrome.identity.getAuthToken({"interactive":false}, function(token) {
    if(token) {
      gapi.auth.setToken({"access_token":token});
      deleteGdriveBackup(fileId, continueCallback)
    }else {
      console.error("Auth token undefined. chrome.runtime.lastError:", chrome.runtime.lastError);
      chrome.extension.getBackgroundPage().authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews()
    }
  })
}
function deleteGdriveBackup(fileId, continueCallback) {
  gapi.client.request({"method":"DELETE", "path":"/drive/v2/files/" + fileId}).execute(continueCallback)
}
function deleteLocalBackup(fullPath, continueCallback) {
  chrome.extension.getBackgroundPage().deleteFileByFullPath(fullPath, continueCallback)
}
function backupNow() {
  chrome.extension.getBackgroundPage().performGdriveBackup(backupOperationId_ = Math.random());
  chrome.extension.getBackgroundPage().ga_event("Backup Now Button Clicked - Options - " + (PRO_LICENSE_KEY_VALID ? "Paid" : "NoValidKey"))
}
window["backupStarted_backgroundPageCall"] = function backupStarted_backgroundPageCall(isUploadStartedPhase) {
  if(isUploadStartedPhase) {
    switchBackupNowBtnToUploadingInProgressState()
  }else {
    switchBackupNowBtnToConnectingState()
  }
};
window["onAuthorizationTokenGranted_backgroundPageCall"] = function() {
  hide401Error()
};
window["onBackupSucceeded_backgroundPageCall"] = function() {
  setAuthToken_listGdriveFiles(false)
};
window["onGdriveAccessRewoked_backgroundPageCall"] = function() {
  show401Error_showAuthorizeGdriveAccessControls();
  switchBackupNowBtnToNormalState()
};
window["noConnectionError_backgroundPageCall"] = function(operationInitiatorId) {
  alertErrorMessageIfOurWindowIsOperationInitiator(operationInitiatorId, "Network Error");
  switchBackupNowBtnToNormalState()
};
window["backupError_backgroundPageCall"] = function(operationInitiatorId, errorCode, errorMessage) {
  alertErrorMessageIfOurWindowIsOperationInitiator(operationInitiatorId, "Error during Backup operation, try again later. Error message returned by server:" + errorMessage + "; Error code:" + errorCode);
  switchBackupNowBtnToNormalState()
};
var backupOperationId_;
function alertErrorMessageIfOurWindowIsOperationInitiator(operationInitiatorId, errorMessage) {
  if(operationInitiatorId == backupOperationId_) {
    setTimeout(function() {
      alert(errorMessage)
    }, 1)
  }
}
function switchBackupNowBtnToConnectingState() {
  var btn = document.getElementById("backupNowBtn");
  if(btn) {
    btn.innerHTML = "<img src='/img/loading_chrome.gif'/> Connecting...";
    btn.classList.add("uploadInProgress")
  }
}
function switchBackupNowBtnToUploadingInProgressState() {
  var btn = document.getElementById("backupNowBtn");
  if(btn) {
    btn.innerHTML = "<img src='/img/loading_chrome.gif'/> Uploading Backup...";
    btn.classList.add("uploadInProgress")
  }
}
function switchBackupNowBtnToNormalState() {
  var btn = getHtmlElementById("backupNowBtn");
  if(btn) {
    btn.innerText = "Backup Now";
    btn.classList.remove("uploadInProgress");
    btn.class = "button"
  }
}
function syncronizeInputFieldWithLocalStorage(fieldId, defaultValue, localStorageLabel) {
  var inputElem = getHtmlElementById(fieldId);
  inputElem.value = localStorage[localStorageLabel] || defaultValue;
  inputElem.oninput = function(event) {
    var newValue = event.srcElement.value.trim();
    if(newValue) {
      localStorage[localStorageLabel] = newValue
    }else {
      delete localStorage[localStorageLabel]
    }
  }
}
syncronizeInputFieldWithLocalStorage("machineLabel", "", "machineLabel");
syncronizeInputFieldWithLocalStorage("numberOfBackupsOnGdriveToKeep", "30", "numberOfBackupsOnGdriveToKeep");
var authorizeButton = document.getElementById("authorizeButton");
var originalAuthorizeButtonText = authorizeButton.innerText;
authorizeButton.onclick = manualAuth_listGdriveFiles;
listLocalBackups();

