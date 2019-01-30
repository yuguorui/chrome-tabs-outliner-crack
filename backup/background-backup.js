// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var backupOperationInitiatorId_ = null;
var rapidClicksChecker_seriesStartTime;
function performGdriveBackup(backupOperationInitiatorId) {
  backupOperationInitiatorId_ = backupOperationInitiatorId;
  if(rapidClicksChecker_seriesStartTime + 5 * 1E3 > Date.now()) {
    return
  }
  rapidClicksChecker_seriesStartTime = Date.now();
  callBackupStarted_ForAllViews(false);
  console.log("performGdriveBackup(); !!window['gapi']:", !!window["gapi"]);
  window["gapi"] ? setAuthToken_backupTreeToGdrive() : addGapiScript_setAuthToken_backupTreeToGdrive();
  chrome.extension.getBackgroundPage().ga_event_backup_started(!!backupOperationInitiatorId)
}
function addGapiScript_setAuthToken_backupTreeToGdrive() {
  console.log("Request GAPI interface loading");
  var previouslyinsertedscript = document.getElementById("googleapiscript");
  if(previouslyinsertedscript) {
    document.head.removeChild(previouslyinsertedscript)
  }
  window.setTimeout(function() {
    var gapiscript = document.createElement("script");
    gapiscript.id = "googleapiscript";
    gapiscript.type = "text/javascript";
    gapiscript.src = "https://apis.google.com/js/client.js?onload=setAuthToken_backupTreeToGdrive";
    gapiscript.addEventListener("error", function(e) {
      console.error("Error loading GAPI, possible reason - no Internet connection", e);
      callNoConnectionError_ForAllViews(backupOperationInitiatorId_);
      chrome.extension.getBackgroundPage().ga_event_backup_error("GAPI Loading Error - No Connection")
    });
    document.head.appendChild(gapiscript)
  }, 1)
}
function setAuthToken_backupTreeToGdrive() {
  chrome.identity.getAuthToken({"interactive":false}, function(token) {
    if(token) {
      gapi.auth.setToken({"access_token":token});
      backupTreeToGdrive(!!backupOperationInitiatorId_)
    }else {
      console.error("Auth token undefined. chrome.runtime.lastError:", chrome.runtime.lastError);
      authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews();
      chrome.extension.getBackgroundPage().ga_event_backup_error("Auth Token Invalid Or Absent")
    }
  })
}
function getTreeDataForGdriveBackup() {
  return JSON.stringify(serializeActiveSessionToOperations())
}
function backupTreeToGdrive(isBackupUserInitiated) {
  console.log("Start GDrive backup");
  listFile(function(fileIdToOverwrite) {
    insertFileInApplicationDataFolderOnGdrive(fileIdToOverwrite, getTreeDataForGdriveBackup(), isBackupUserInitiated)
  })
}
function authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews() {
  chrome.identity.getAuthToken({"interactive":false}, function(token) {
    if(token) {
      chrome.identity.removeCachedAuthToken({"token":token})
    }else {
      chrome.runtime.lastError
    }
    callOnGdriveAccessRewoked_ForAllViews()
  })
}
function maxNumberOfBackupFilesToKeep() {
  var maxNumberOfBackupFilesToKeep = Number(localStorage["numberOfBackupsOnGdriveToKeep"]);
  if(!maxNumberOfBackupFilesToKeep || maxNumberOfBackupFilesToKeep < 0) {
    maxNumberOfBackupFilesToKeep = 30;
    delete localStorage["numberOfBackupsOnGdriveToKeep"]
  }
  return maxNumberOfBackupFilesToKeep
}
function isTabsOutlinerBackupFile(item) {
  return item["title"].indexOf(BACKUP_FILENAME) >= 0
}
function by_modifiedDate(a, b) {
  return(new Date(b["modifiedDate"])).getTime() - (new Date(a["modifiedDate"])).getTime()
}
function listFile(callback) {
  gapi.client.request({"path":"/drive/v2/files", "params":{"q":"'appdata' in parents", "maxResults":1E3}}).execute(function(response) {
    if(response.items) {
      var ourBackupFiles = response.items.filter(isTabsOutlinerBackupFile);
      if(ourBackupFiles.length >= maxNumberOfBackupFilesToKeep()) {
        ourBackupFiles.sort(by_modifiedDate);
        var oldestFileItemId = ourBackupFiles.pop()["id"]
      }
      callback(oldestFileItemId)
    }else {
      console.error("ERROR obtainig list of backup files from Gdrive", response);
      onGdriveOperationError(response);
      chrome.extension.getBackgroundPage().ga_event_backup_error("List Files Stage Error: " + (reason["error"] && reason["error"]["message"] ? reason["error"]["message"] : "Unknown Reason"))
    }
  })
}
function insertFileInApplicationDataFolderOnGdrive(fileIdToOverwrite, data, isBackupUserInitiated) {
  callBackupStarted_ForAllViews(true);
  var description = JSON.stringify({"machineLabel":localStorage["machineLabel"] || "", "manual":!!isBackupUserInitiated});
  var metadata = {"title":BACKUP_FILENAME, "mimeType":"application/json", "parents":[{"id":"appdata"}], "description":description};
  var multipartRequestBody = "\r\n---------314159265358979323846\r\nContent-Type: application/json\r\n\r\n" + JSON.stringify(metadata) + "\r\n---------314159265358979323846\r\nContent-Type: application/json\r\n\r\n" + data + "\r\n---------314159265358979323846--";
  gapi.client.request({"path":"/upload/drive/v2/files" + (fileIdToOverwrite != null ? "/" + fileIdToOverwrite : "") + "?uploadType=multipart", "method":fileIdToOverwrite != null ? "PUT" : "POST", "params":{"fileId":fileIdToOverwrite, "uploadType":"multipart"}, "headers":{"Content-Type":'multipart/mixed; boundary="-------314159265358979323846"'}, "body":multipartRequestBody}).then(function onSuccess(response) {
    localStorage["gdriveLastSuccessfulBackupTime"] = Date.now();
    callBackupSucceeded_ForAllViews();
    console.log("GDrive backup succeded");
    chrome.extension.getBackgroundPage().ga_event_backup_succeded(multipartRequestBody.length)
  }, function onError(reason) {
    console.error("Error File Upload", reason);
    onGdriveOperationError(reason);
    chrome.extension.getBackgroundPage().ga_event_backup_error("Upload Stage Error: " + (reason["error"] && reason["error"]["message"] ? reason["error"]["message"] : "Unknown Reason"))
  })
}
function onGdriveOperationError(reason) {
  if(reason["error"] && reason["error"]["code"] == -1) {
    callNoConnectionError_ForAllViews(backupOperationInitiatorId_)
  }else {
    if(reason["error"] && reason["error"]["code"] == 401) {
      authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews()
    }else {
      callBackupError_ForAllViews(backupOperationInitiatorId_, reason["error"] && reason["error"]["code"], reason["error"] && reason["error"]["message"])
    }
  }
}
var isGdriveBackupSchedulerActive = false;
function activateGdriveBackupScheduler() {
  if(isGdriveBackupSchedulerActive) {
    return
  }
  isGdriveBackupSchedulerActive = true;
  runGdriveBackupScheduler()
}
function runGdriveBackupScheduler() {
  if(!isGdriveBackupSchedulerActive) {
    return
  }
  window.setTimeout(runGdriveBackupScheduler, 1 * 60 * 60 * 1E3);
  if(isTimeForNextAutomaticGdriveBackup()) {
    performGdriveBackup(null)
  }
  updatePassedTimeFromLastSuccesfulBackupIndicators()
}
function isTimeForNextAutomaticGdriveBackup() {
  var backupFrequence = 24 * 60 * 60 * 1E3;
  var lastBackupToDriveTime = Number(localStorage["gdriveLastSuccessfulBackupTime"] || 0);
  return Date.now() >= lastBackupToDriveTime + backupFrequence
}
function updatePassedTimeFromLastSuccesfulBackupIndicators() {
  callUpdateBackupIndicator_ForAllViews(Number(localStorage["gdriveLastSuccessfulBackupTime"] || 0))
}
function callUpdateBackupIndicator_ForAllViews(gdriveLastSuccessfulBackupTime) {
  callOnAllViews("updateBackupIndicator_backgroundPageCall", gdriveLastSuccessfulBackupTime)
}
function callBackupSucceeded_ForAllViews() {
  callOnAllViews("onBackupSucceeded_backgroundPageCall")
}
function callOnGdriveAccessRewoked_ForAllViews() {
  callOnAllViews("onGdriveAccessRewoked_backgroundPageCall")
}
function callOnAuthorizationTokenGranted_ForAllViews() {
  callOnAllViews("onAuthorizationTokenGranted_backgroundPageCall")
}
function callBackupStarted_ForAllViews(isUploadStartedPhase) {
  callOnAllViews("backupStarted_backgroundPageCall", isUploadStartedPhase)
}
function callNoConnectionError_ForAllViews(userInitiatedOperation) {
  callOnAllViews("noConnectionError_backgroundPageCall", userInitiatedOperation)
}
function callBackupError_ForAllViews(userInitiatedOperation, errorCode, errorMessage) {
  callOnAllViews("backupError_backgroundPageCall", userInitiatedOperation, errorCode, errorMessage)
}
window["authTokenGranted_notifyAllOpenedViews"] = callOnAuthorizationTokenGranted_ForAllViews;
window["performGdriveBackup"] = performGdriveBackup;
window["authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews"] = authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews;
window["BACKUP_FILENAME"] = "tabsoutlinerbackup.json";
window["setLicenseState_invalid_NoLicenseKey"] = function(licenseStateValues) {
};
window["setLicenseState_invalid_KeyPresentIdentityIsAccesibleButNotMatchTheLicenseKey"] = function(licenseStateValues) {
};
window["setLicenseState_invalid_KeyPresentButChromeIsNotSignedIn"] = function(licenseStateValues) {
};
window["setLicenseState_invalid_KeyPresentChromeIsSignedInButNoEmailPermission"] = function(licenseStateValues) {
};
window["setLicenseState_valid"] = function(licenseStateValues) {
  activateGdriveBackupScheduler()
};
checkAndUpdateLicenseStatusInAllViews();

