// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var debugLogChromeOperations = false;
if(localStorage["enableDetailedLogs"]) {
  debugLogChromeOperations = true
}
function disableDetailedLogs() {
  delete localStorage["enableDetailedLogs"];
  debugLogChromeOperations = false
}
function enableDetailedLogs() {
  localStorage["enableDetailedLogs"] = "true";
  debugLogChromeOperations = true
}
try {
  var CHROME_MAJOR_VERSION = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10)
}catch(e) {
  console.error(e)
}
function getJsonFromQueryString(url) {
  var questionMarkStart = url.indexOf("?");
  var anchorStart = url.lastIndexOf("#");
  var query = url.substring(questionMarkStart + 1, anchorStart < 0 ? url.length : anchorStart);
  var data = query.split("&");
  var result = {};
  for(var i = 0;i < data.length;i++) {
    var item = data[i].split("=");
    result[item[0]] = item[1]
  }
  return result
}
function console_log_differenceTransaction(diff) {
  console.group("Diff Data");
  if(diff["k"]) {
    for(var key in diff["k"]) {
      console.log("%s:%c %s", key, "color:#522900", diff["k"][key])
    }
  }else {
    console.log("NO KNOTS")
  }
  if(diff["c"]) {
    for(key in diff["c"]) {
      console.log("%s:%c %s", key, "color:#00297A", diff["c"][key])
    }
  }else {
    console.log("NO ENTRIES")
  }
  for(key in diff) {
    if(key != "k" && key != "c") {
      console.log("%s:%c", key, "color:orange", diff[key])
    }
  }
  console.groupEnd()
}
function getLocalStorageConfigInfoAsJsonString() {
  var r = {};
  for(var key in localStorage) {
    if(localStorage.hasOwnProperty(key) && localStorage[key].length < 500) {
      r[key] = localStorage[key]
    }
  }
  return JSON.stringify(r)
}
var backEndInterface = new BackEndInterface;
function BackEndInterface() {
  this.authorizedServerSides = ["http://localhost:8080", "https://tamnubatest.appspot.com", "https://gcdc2013-tabsoutliner.appspot.com", "https://tabs-outliner.appspot.com", "https://pro.tabsoutliner.com"];
  this.profilePath = "/profile";
  this.usedTokens = {}
}
BackEndInterface.prototype.ifThisIsOurServerSideProfilePathReturnParams = function(url) {
  for(var i = 0;i < this.authorizedServerSides.length;i++) {
    var testStr = this.authorizedServerSides[i] + this.profilePath;
    if(url.indexOf(testStr) === 0) {
      var r = getJsonFromQueryString(url.substr(testStr.length));
      r.serverSideUri = this.authorizedServerSides[i];
      return r
    }
  }
  return null
};
BackEndInterface.prototype.titleContainConfirmIndicator = function(title) {
  var confirmMark = "[#]";
  return title.length - title.lastIndexOf(confirmMark) === confirmMark.length
};
BackEndInterface.prototype.callOnBackEndInterface = function(params_serverSideUri, actionToCall) {
  var backEndInterfaceGlobalObjectCreatedByGatewayScript = "__backEndInterface";
  if(!window[backEndInterfaceGlobalObjectCreatedByGatewayScript]) {
    if(debugLogChromeOperations) {
      console.log("BE-IS-NOT-READY-WILL-LOAD")
    }
    var backEndInterfaceScript = document.createElement("script");
    backEndInterfaceScript.type = "text/javascript";
    backEndInterfaceScript.async = true;
    backEndInterfaceScript.src = params_serverSideUri + "/static/to_backend_gateway_4.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(backEndInterfaceScript, s);
    backEndInterfaceScript.onload = function() {
      actionToCall(window[backEndInterfaceGlobalObjectCreatedByGatewayScript])
    };
    backEndInterfaceScript.onerror = function() {
      console.error("BEINT LOAD ERROR")
    }
  }else {
    if(debugLogChromeOperations) {
      console.log("BE-ALREADY-LOADED-AND-READY")
    }
    actionToCall(window[backEndInterfaceGlobalObjectCreatedByGatewayScript])
  }
};
var lastSeenTabs = [];
function getNewChromeSessionAndUpdateChangedTabs() {
  window.chrome.tabs.query({}, function(chromeActiveTabObjectsList) {
    for(i = 0;i < chromeActiveTabObjectsList.length;i++) {
      var isChanged = false;
      var currentChromeTabObj = chromeActiveTabObjectsList[i];
      var lastSeenChromeTabObj = lastSeenTabs[currentChromeTabObj.id];
      if(lastSeenChromeTabObj && lastSeenChromeTabObj.title !== currentChromeTabObj.title) {
        if(debugLogChromeOperations) {
          console.log("TABSCHECKER New Tab Title:", lastSeenChromeTabObj.title, "--\x3e", currentChromeTabObj.title)
        }
        isChanged = true
      }
      if(lastSeenChromeTabObj && lastSeenChromeTabObj.url !== currentChromeTabObj.url) {
        if(debugLogChromeOperations) {
          console.log("TABSCHECKER New Tab Url:", lastSeenChromeTabObj.url, "--\x3e", currentChromeTabObj.url)
        }
        isChanged = true
      }
      if(lastSeenChromeTabObj && (currentChromeTabObj.favIconUrl && lastSeenChromeTabObj.favIconUrl !== currentChromeTabObj.favIconUrl)) {
        if(debugLogChromeOperations) {
          console.log("TABSCHECKER New Tab favIconUrl:", lastSeenChromeTabObj.favIconUrl, "--\x3e", currentChromeTabObj.favIconUrl)
        }
        isChanged = true
      }
      if(lastSeenChromeTabObj && lastSeenChromeTabObj.status !== currentChromeTabObj.status) {
        if(debugLogChromeOperations) {
          console.log("TABSCHECKER New Tab status:", lastSeenChromeTabObj.status, "--\x3e", currentChromeTabObj.status)
        }
        isChanged = true
      }
      if(isChanged) {
        if(debugLogChromeOperations) {
          console.log("TABSCHECKER DETECT TAB UPDATE", currentChromeTabObj)
        }
        if(activeSession && activeSession.treeModel) {
          var tabModel = activeSession.treeModel.findActiveTab(currentChromeTabObj.id);
          if(tabModel) {
            tabModel.updateChromeTabObj(currentChromeTabObj)
          }
        }
      }
    }
    lastSeenTabs = [];
    for(var i = 0;i < chromeActiveTabObjectsList.length;i++) {
      lastSeenTabs[chromeActiveTabObjectsList[i].id] = chromeActiveTabObjectsList[i]
    }
  })
}
function checkTabsChanges() {
  var CHECK_INTERVAL = 2E3;
  if(debugLogChromeOperations) {
    console.log("@@@@@ TABS CHECK STARTED, interval:", CHECK_INTERVAL)
  }
  function tabsCheck() {
    getNewChromeSessionAndUpdateChangedTabs();
    setTimeout(tabsCheck, CHECK_INTERVAL)
  }
  tabsCheck()
}
checkTabsChanges();
function threadCheck() {
  var CHECK_INTERVAL = 30;
  console.log("@@@@@ THREAD CHECK STARTED, interval:", CHECK_INTERVAL);
  var startTime = Date.now();
  var lastCheckTime = startTime;
  var checks = [];
  function threadCheckCheck() {
    var time = Date.now();
    checks.push(time - lastCheckTime <= CHECK_INTERVAL + 7 ? "." : time - lastCheckTime);
    if(time - startTime < 1E4) {
      setTimeout(threadCheckCheck, CHECK_INTERVAL)
    }else {
      var msg = "";
      for(var i = 0;i < checks.length;i++) {
        msg += checks[i] + " "
      }
      console.log("@@@@@ THREAD CHECKS:\n", msg)
    }
    lastCheckTime = time
  }
  threadCheckCheck()
}
function serializeActiveSessionToJSO() {
  return activeSession.treeModel.serializeHierarchyAsJSO()
}
function serializeActiveSessionToOperations() {
  return activeSession.treeModel.serializeAsOperationsLog()
}
function saveCurrentSessionAsJSONtoLocalStorage() {
  console.log("saveCurrentSessionAsJSON to LocalStorage ====================================");
  var startTime = Date.now();
  var dataToSave_Objects_startTime = Date.now();
  var dataToSave_Objects = serializeActiveSessionToJSO();
  var dataToSave_Objects_stopTime = Date.now();
  var dataToSave_Strings_startTime = Date.now();
  var dataToSave_Strings = JSON.stringify(dataToSave_Objects);
  var dataToSave_Strings_stopTime = Date.now();
  var startToStorageTime = Date.now();
  localStorage.setItem(currentSessionSnapshotDbKey, dataToSave_Strings);
  localStorage.setItem("timestamp", Date.now());
  var stopToStorageTime = Date.now();
  console.log("SerializeToObjectsTime", dataToSave_Objects_stopTime - dataToSave_Objects_startTime);
  console.log("ObjectsToStringTime", dataToSave_Strings_stopTime - dataToSave_Strings_startTime);
  console.log("SaveTime", stopToStorageTime - startToStorageTime);
  console.log("FullSaveTime", stopToStorageTime - startTime);
  console.log("")
}
function saveCurrentSessionAsOperationsToIndexedDbNow() {
  var startTime = Date.now();
  var dataToSave_Objects = serializeActiveSessionToOperations();
  var startToStorageTime = Date.now();
  saveToDefaultIndexedDB(currentSessionSnapshotDbKey, dataToSave_Objects);
  var stopToStorageTime = Date.now()
}
if(!window.indexedDB) {
  var indexedDB = window.indexedDB || (window.webkitIndexedDB || (window.mozIndexedDB || window.msIndexedDB))
}
if(!window.IDBTransaction) {
  var IDBTransaction = window.IDBTransaction || (window.webkitIDBTransaction || (window.mozIDBTransaction || window.msIDBTransaction))
}
var INDEXED_DB_TRANSACTION_readonly = CHROME_MAJOR_VERSION < 22 ? IDBTransaction.READ_ONLY : "readonly";
var INDEXED_DB_TRANSACTION_readwrite = CHROME_MAJOR_VERSION < 22 ? IDBTransaction.READ_WRITE : "readwrite";
var dataBaseSchemeV33 = {dbName:"TabsOutlinerDB2", dbVersion:2, dbObjectStoreName:"current_session_snapshot"};
var dataBaseSchemeV34_Default = {dbName:"TabsOutlinerDB34", dbVersion:2, dbObjectStoreName:"current_session_snapshot"};
var currentSessionSnapshotDbKey = "currentSessionSnapshot";
function openIndexedDbToUse_neverCreateAnything(dataBaseScheme, useDbCallback) {
  throw new Error;var openRequest = indexedDB.open(dataBaseScheme.dbName, dataBaseScheme.dbVersion);
  openRequest.onblocked = function(event) {
    if(console) {
      console.error("ERROR IndexedDB openRequest.onblocked", event)
    }
    useDbCallback(null)
  };
  openRequest.onerror = function(event) {
    if(console) {
      console.error("ERROR IndexedDB openRequest.onerror", event.target.webkitErrorMessage, event.target.errorCode, event)
    }
    useDbCallback(null)
  };
  openRequest.onsuccess = function(event) {
    var db = this.result;
    useDbCallback(db)
  }
}
function openIndexedDbToUse_createStoreIfAbsent(dataBaseScheme, useDbCallback) {
  var startTime_openIndexedDbToUse = Date.now();
  var openRequest = indexedDB.open(dataBaseScheme.dbName, dataBaseScheme.dbVersion);
  openRequest.onblocked = function(event) {
    if(console) {
      console.error("ERROR IndexedDB openRequest.onblocked:", event)
    }
    useDbCallback(null)
  };
  openRequest.onerror = function(event) {
    if(console) {
      console.error("ERROR IndexedDB openRequest.onerror:", event["target"]["webkitErrorMessage"], event["target"]["errorCode"], event, "\nSERIOUS ERROR IndexedDB folder is corrupted most likely - need manualy delete the extension IndexedDB folder to recover from this!\n" + "the folder is contained in Chrome profile (use chrome:version to learn the correct path) and has the name: \nIndexedDB/chrome-extension_eggkanocgddhmamlbiijnphhppkpkmkl_0.indexeddb.leveldb\n" + "This was very common error in Chrome v24 and Chrome v25 because of some LevelDB engine bug which was introduced in Chrome v24; \nChrome v26 delete such corrupted database folders on open automaticaly")
    }
    useDbCallback(null)
  };
  openRequest.onupgradeneeded = function(event) {
    if(console) {
      console.log("IndexedDB openRequest.onupgradeneeded", event)
    }
    var db = event.target.result;
    createObjectStoreAndIndexIfNoObjectStores(db, dataBaseScheme, event.oldVersion)
  };
  openRequest.onsuccess = function(event) {
    var db = this.result;
    var oldVersion = Number(db.version);
    if(oldVersion !== dataBaseScheme.dbVersion) {
      if(console) {
        console.log("IndexedDB openRequest.onsuccess - oldVersion !== dbVersion - will do db.setVersion", event)
      }
      if(!db.setVersion) {
        throw new Error;
      }
      var versionRequest = db.setVersion(dataBaseScheme.dbVersion);
      versionRequest.onsuccess = function(event) {
        if(console) {
          console.log("IndexedDB versionRequest.onsuccess", event)
        }
        createObjectStoreAndIndexIfNoObjectStores(db, dataBaseScheme, oldVersion);
        var transaction = event.target.result;
        transaction.oncomplete = function() {
          useDbCallback(db)
        }
      }
    }else {
      useDbCallback(db)
    }
  }
}
function createObjectStoreAndIndexIfNoObjectStores(db, dataBaseScheme, oldVersion) {
  if(console) {
    console.log("IndexedDB = Create ObjectStore in DB ===================")
  }
  if(db["objectStoreNames"].length === 0) {
    var objectStore = db.createObjectStore(dataBaseScheme.dbObjectStoreName, {"keyPath":"key"});
    objectStore.createIndex("key", "key", {"unique":true})
  }
}
function saveDataToDB(db, objectStoreName, key, JSO, onDone) {
  var transaction = db.transaction([objectStoreName], INDEXED_DB_TRANSACTION_readwrite);
  var objectStore = transaction.objectStore(objectStoreName);
  var startRIB_add = Date.now();
  var data = {"key":key, "data":JSO};
  var putRequest = objectStore.put(data);
  var stopRIB_add = Date.now();
  putRequest.onsuccess = function(event) {
  };
  putRequest.onerror = function(event) {
    if(console) {
      console.log("IndexedDB ERROR putRequest.onerror", event)
    }
  };
  transaction.oncomplete = function(event) {
    if(onDone) {
      onDone(db)
    }
  };
  transaction.onerror = function(event) {
    if(console) {
      console.log("IndexedDB ERROR write transaction.onerror", event)
    }
  }
}
function readDataFromDB(db, objectStoreName, key, callback) {
  var transaction = db.transaction([objectStoreName], INDEXED_DB_TRANSACTION_readonly);
  var getRequest = transaction.objectStore(objectStoreName).get(key);
  getRequest.onsuccess = function(event) {
    if(event.target.result === undefined) {
      callback(undefined)
    }else {
      callback(event.target.result.data)
    }
  };
  getRequest.onerror = function(event) {
    if(console) {
      console.log("IndexedDB ERROR getRequest.onerror", event)
    }
    callback(undefined)
  };
  transaction.oncomplete = function(event) {
  };
  transaction.onerror = function(event) {
    if(console) {
      console.log("IndexedDB ERROR read transaction.onerror", event)
    }
    callback(undefined)
  }
}
function saveToDefaultIndexedDB(key, data) {
  if(debugLogChromeOperations) {
    if(console) {
      console.log("saveToDefaultIndexedDB START", (new Date).toTimeString())
    }
  }
  openIndexedDbToUse_createStoreIfAbsent(dataBaseSchemeV34_Default, function(db) {
    if(db) {
      saveDataToDB(db, dataBaseSchemeV34_Default.dbObjectStoreName, key, data, function() {
      })
    }else {
      window["treeWriteFail"] = true
    }
  })
}
function readOperationsFromIndexedDB(dataBaseScheme, callback) {
  var multipleCallbackinvocationOnErrorsChecker_db = 0;
  if(++multipleCallbackinvocationOnErrorsChecker_db !== 1) {
    return
  }
  openIndexedDbToUse_createStoreIfAbsent(dataBaseScheme, function(db) {
    try {
      if(!db) {
        throw new Error("IDB open error");
      }
      readDataFromDB(db, dataBaseScheme.dbObjectStoreName, currentSessionSnapshotDbKey, function(data) {
        if(console) {
          console.log("IDB READ-DONE", dataBaseScheme.dbName)
        }
        try {
          callback(data)
        }catch(e) {
          console.error("ERROR !!! IDB READ CALLBACK EXECUTION EXCEPTION - ERROR DURING TREE INSTANTIATION FROM SERIALIZED DATA", e);
          console.log(e["message"]);
          console.log(e["stack"])
        }
      })
    }catch(e) {
      console.error("ERROR !!! IDB READ ERROR", dataBaseScheme.dbName, e);
      console.log(e["message"]);
      console.log(e["stack"]);
      callback(null)
    }
  })
}
var OnRemovedTracker = Class.extend({init:function() {
  this.PERIOD_OF_INACTIVITY_BEFORE_CLEARING_DATA = 25 * 1E3;
  this.lastSessionOnRemoved = this._getDataFromLocalStorage();
  this.clearStorage()
}, clearStorage:function() {
  this.recentlyRemoved = this.getEmptyOnRemovedCollection();
  this._dumpDataToLocalStorage();
  this.clearTimerID = null
}, getEmptyOnRemovedCollection:function() {
  return{"removedTabs":{}, "removedWindows":{}}
}, _dumpDataToLocalStorage:function() {
  try {
    var s = JSON.stringify(this.recentlyRemoved);
    if(s.length < 1E5) {
      localStorage["recentlyRemoved"] = s
    }
  }catch(e) {
    console.error("ERROR DDTLS", e)
  }
}, _getDataFromLocalStorage:function() {
  try {
    var removedItems = JSON.parse(localStorage["recentlyRemoved"])
  }catch(e) {
  }
  if(!removedItems || (!removedItems["removedWindows"] || !removedItems["removedTabs"])) {
    removedItems = this.getEmptyOnRemovedCollection()
  }
  return removedItems
}, recentlyRemovedItemsListUpdated_dubpData_scheduleClear:function() {
  this._dumpDataToLocalStorage();
  window.clearTimeout(this.clearTimerID);
  this.clearTimerID = window.setTimeout(this.clearStorage.bind(this), this.PERIOD_OF_INACTIVITY_BEFORE_CLEARING_DATA)
}, register_onTabRemoved:function(tabId, isWindowClosingInfo) {
  this.recentlyRemoved["removedTabs"][tabId] = isWindowClosingInfo;
  if(isWindowClosingInfo && isWindowClosingInfo.isWindowClosing) {
    this.recentlyRemoved["removedWindows"][isWindowClosingInfo.windowId] = Date.now()
  }
  this.recentlyRemovedItemsListUpdated_dubpData_scheduleClear()
}, register_onWindowRemoved:function(windowId) {
  this.recentlyRemoved["removedWindows"][windowId] = Date.now();
  this.recentlyRemovedItemsListUpdated_dubpData_scheduleClear()
}, getTabsOnRemovedEventsFromLastSession:function() {
  return this.lastSessionOnRemoved["removedTabs"]
}, getWindowsOnRemovedEventsFromLastSession:function() {
  return this.lastSessionOnRemoved["removedWindows"]
}, EOC:null});
function SaveScheduler(saveFunction, UPDATES_ACCUMULATING_PERIOD, MAXIMUM_POSTPONE_BECAUSE_OF_UPDATES_PERIOD_BEFORE_FORCED_SAVE) {
  this.performSaveFunction = saveFunction;
  this.timeOfFirstUnsavedUpdate = null;
  this.timeoutCallId = 0;
  this.MAXIMUM_POSTPONE_BECAUSE_OF_UPDATES_PERIOD_BEFORE_FORCED_SAVE = MAXIMUM_POSTPONE_BECAUSE_OF_UPDATES_PERIOD_BEFORE_FORCED_SAVE;
  this.UPDATES_ACCUMULATING_PERIOD = UPDATES_ACCUMULATING_PERIOD
}
SaveScheduler.prototype = {_cancellAnyAlreadyScheduledSaveCall:function() {
  window.clearTimeout(this.timeoutCallId)
}, _callSave:function() {
  if(debugLogChromeOperations) {
    console.log("SaveScheduler(%d)::_callSave():", this.UPDATES_ACCUMULATING_PERIOD)
  }
  this.timeOfFirstUnsavedUpdate = null;
  this.performSaveFunction()
}, _scheduleSaveCall:function(period) {
  this.timeoutCallId = window.setTimeout(this._callSave.bind(this), period)
}, _isWeAllreadyPostponeSaveExecutionForTooMuch:function() {
  return Date.now() - this.timeOfFirstUnsavedUpdate > this.MAXIMUM_POSTPONE_BECAUSE_OF_UPDATES_PERIOD_BEFORE_FORCED_SAVE
}, processUpdateRequest:function() {
  if(!this.timeOfFirstUnsavedUpdate) {
    this.timeOfFirstUnsavedUpdate = Date.now()
  }
  var scheduleToCallInNmilisecond = this._isWeAllreadyPostponeSaveExecutionForTooMuch() ? 1 : this.UPDATES_ACCUMULATING_PERIOD;
  if(debugLogChromeOperations) {
    console.log("SaveScheduler(%d)::processUpdateRequest scheduleToCallInNmilisecond:", this.UPDATES_ACCUMULATING_PERIOD, scheduleToCallInNmilisecond)
  }
  this._cancellAnyAlreadyScheduledSaveCall();
  this._scheduleSaveCall(scheduleToCallInNmilisecond)
}};
var TreeModelPersistenceManagerAbstractBase = Class.extend({init:function() {
  this.tree = null;
  this.localStorageQuataReached = false;
  this.fullSaveScheduler = new SaveScheduler(this._diff_and_full_performScheduledSave.bind(this), 3E3, 8 * 1E3)
}, registerTree:function(tree) {
  this.tree = tree
}, restoreTree:function(callback) {
}, saveTree:function(isPerformSureSynchronousSave_onViewClose) {
}, diff_saveTree:function() {
}, saveNow:function() {
  if(this.fullSaveScheduler.timeOfFirstUnsavedUpdate == null) {
    return
  }
  this.fullSaveScheduler._cancellAnyAlreadyScheduledSaveCall();
  this._diff_and_full_performScheduledSave(true);
  this.fullSaveScheduler.timeOfFirstUnsavedUpdate = null
}, _diff_and_full_performScheduledSave:function(doLocalStorageSave) {
  try {
    this.diff_saveTree()
  }catch(e) {
    console.error("!!! diff_saveTree exception:", e)
  }
  try {
    this.saveTree(!!doLocalStorageSave)
  }catch(e) {
    console.error("!!! saveTree exception:", e)
  }
}, _diff_performScheduledSave:function() {
  try {
    this.diff_saveTree()
  }catch(e) {
    console.error("!!! diff_saveTree3 exception:", e)
  }
}, treeUpdated:function() {
  this.fullSaveScheduler.processUpdateRequest()
}, EOC:null});
var TreeModelPersistenceManagerIndexedDB = TreeModelPersistenceManagerAbstractBase.extend({restoreTree:function(callback) {
  readOperationsFromIndexedDB(dataBaseSchemeV34_Default, function(savedOperations) {
    callback(savedOperations ? restoreTreeFromOperations(savedOperations) : null)
  })
}, saveTree:function() {
  saveCurrentSessionAsOperationsToIndexedDbNow()
}, EOC:null});
var TreeModelPersistenceManagerLocalStorage = TreeModelPersistenceManagerAbstractBase.extend({restoreTree:function(callback) {
  var savedData = JSON.parse(localStorage.getItem(currentSessionSnapshotDbKey));
  callback(savedData && savedData["node"] ? restoreHierarchyFromJSO(savedData) : null)
}, saveTree:function() {
  saveCurrentSessionAsJSONtoLocalStorage()
}, EOC:null});
var TreeModelPersistenceManagerIndexedDBAndFilesystem = TreeModelPersistenceManagerAbstractBase.extend({restoreTree:function(callback___________) {
  setTimeout(consoleLoglistOfAllFiles, 1);
  var serviceOptions_restoreSource = localStorage["serviceOptions_restoreSource"];
  delete localStorage["serviceOptions_restoreSource"];
  switch(serviceOptions_restoreSource) {
    case "indexedDB":
      readOperationsFromIndexedDB(dataBaseSchemeV34_Default, function(indexedDbSavedOperations_v34) {
        if(isValidV34Data_endNodeIsEof(indexedDbSavedOperations_v34)) {
          callback___________(restoreTreeFromOperations(indexedDbSavedOperations_v34))
        }
      });
      return;
    case "file":
      readSessionDataFromFile(currentSessionSnapshotFilename, function(fileSavedOperations) {
        if(isValidV34Data_endNodeIsEof(fileSavedOperations)) {
          callback___________(restoreTreeFromOperations(fileSavedOperations))
        }
      });
      return;
    case "webSQL":
      readSessionDataBackupFromWebSQL(function(webSqlSavedOperations) {
        if(isValidV34Data_endNodeIsEof(webSqlSavedOperations)) {
          callback___________(restoreTreeFromOperations(webSqlSavedOperations))
        }
      });
      return;
    case "localstorage":
      var treeInLocalStorage = JSON.parse(localStorage["onViewClose_lastSessionSnapshot"]);
      if(isValidV34Data_endNodeIsEof(treeInLocalStorage)) {
        callback___________(restoreTreeFromOperations(treeInLocalStorage))
      }
      return;
    default:
      readSessionDataFromFile(serviceOptions_restoreSource, function(fileSavedOperations) {
        if(isValidV34Data_endNodeIsEof(fileSavedOperations)) {
          callback___________(restoreTreeFromOperations(fileSavedOperations))
        }
      });
      return;
    case undefined:
  }
  readOperationsFromIndexedDB(dataBaseSchemeV34_Default, function(indexedDbSavedOperations_v34) {
    if(getV34DataSaveTime(indexedDbSavedOperations_v34) == localStorage["lastSessionSnapshotSaveTime"]) {
      if(console) {
        console.log("DB read ok; Data in DB have known lastSessionSnapshotSaveTime")
      }
      callback___________(restoreTreeFromOperations(indexedDbSavedOperations_v34))
    }else {
      if(console) {
        console.log("No valid v34 data in database, or with unknown lastSaveTime (V34DataSaveTime, localStorage.lastSessionSnapshotSaveTime):", getV34DataSaveTime(indexedDbSavedOperations_v34), localStorage["lastSessionSnapshotSaveTime"])
      }
      var multipleCallbackinvocationOnErrorsChecker_file = 0;
      readSessionDataFromFile(currentSessionSnapshotFilename, function(fileSavedOperations) {
        if(++multipleCallbackinvocationOnErrorsChecker_file !== 1) {
          return
        }
        try {
          var localStorageSavedOperations = JSON.parse(localStorage["onViewClose_lastSessionSnapshot"])
        }catch(e) {
        }
        var idb_tstmp = getV34DataSaveTime(indexedDbSavedOperations_v34);
        var file_tstmp = getV34DataSaveTime(fileSavedOperations);
        var lstr_tstmp = getV34DataSaveTime(localStorageSavedOperations);
        console.log("IDB, file, localstorage snapshots timestamps & lastSessionSnapshotSaveTime:", idb_tstmp, file_tstmp, lstr_tstmp, localStorage["lastSessionSnapshotSaveTime"]);
        if(file_tstmp == localStorage["lastSessionSnapshotSaveTime"]) {
          if(console) {
            console.log("Data in file have known lastSaveTime, will restore tree from file")
          }
          callback___________(restoreTreeFromOperations(fileSavedOperations))
        }else {
          if(lstr_tstmp == localStorage["lastSessionSnapshotSaveTime"]) {
            if(console) {
              console.log("Data in localStorage have known lastSaveTime, will restore tree from localStorage")
            }
            callback___________(restoreTreeFromOperations(localStorageSavedOperations))
          }else {
            if(console) {
              console.log("Nor file, nor idb, nor localstorage have data with lastSessionSnapshotSaveTime", localStorage["lastSessionSnapshotSaveTime"])
            }
            if(idb_tstmp || file_tstmp) {
              var freshestData = [[idb_tstmp || 0, indexedDbSavedOperations_v34], [file_tstmp || 0, fileSavedOperations], [lstr_tstmp || 0, localStorageSavedOperations]];
              freshestData.sort(function(a, b) {
                return b[0] - a[0]
              });
              if(console) {
                console.log("No data with known save time, will restore the freshest store")
              }
              callback___________(restoreTreeFromOperations(freshestData[0][1]))
            }else {
              if(console) {
                console.log("No valid DB34 nor File nor localStorage with knownSaveTime data")
              }
              if(localStorage["lastSessionSnapshotSaveTime"]) {
                if(console) {
                  console.log("localStorage.lastSessionSnapshotSaveTime is present, so it's not fresh install, will try to read WebSQL backup", localStorage["lastSessionSnapshotSaveTime"])
                }
                readSessionDataBackupFromWebSQL(function(webSqlSavedOperations) {
                  if(isValidV34Data_endNodeIsEof(webSqlSavedOperations)) {
                    if(console) {
                      console.log("WebSQL READ OK")
                    }
                    callback___________(restoreTreeFromOperations(webSqlSavedOperations))
                  }else {
                    if(console) {
                      console.log("WebSQL return non valid data. Will stop now to not overwrite the data by empty tree. Contact the author please: vladyslav.volovyk@gmail.com")
                    }
                  }
                })
              }else {
                readOperationsFromIndexedDB(dataBaseSchemeV33, function(indexedDbSavedOperations_v33_old) {
                  if(indexedDbSavedOperations_v33_old) {
                    if(console) {
                      console.log("TABSOUTLINER UPGRADE")
                    }
                    localStorage["v34upgrade"] = Date.now();
                    callback___________(restoreTreeFromOperations(indexedDbSavedOperations_v33_old))
                  }else {
                    if(console) {
                      console.log("TABSOUTLINER FRESH INSTALL")
                    }
                    localStorage["install"] = Date.now();
                    localStorage["relateNewTabToOpener"] = "true";
                    callback___________(restoreTreeFromOperations([]));
                    ga_setInstanceInstallTimeDimensions()
                  }
                })
              }
            }
          }
        }
      })
    }
  })
}, registerTree:function(tree) {
  this._super(tree)
}, diff_saveTree:function() {
}, saveTree:function(isSynchronousUnscheduledSaveRequested) {
  var sessionDataAsOperations = this.tree.serializeAsOperationsLog();
  localStorage["lastSessionSnapshotSaveTime"] = sessionDataAsOperations[sessionDataAsOperations.length - 1]["time"];
  localStorage["lastSavedSessionSnapshotLength"] = sessionDataAsOperations.length;
  var webSqlBackupPeriod = 20 * 60 * 1E3;
  var isTimeForWebSqlBackup = !window["lastWebSqlBackupTime"] || window["lastWebSqlBackupTime"] + webSqlBackupPeriod < Date.now();
  try {
    if(!this.localStorageQuataReached && (isSynchronousUnscheduledSaveRequested || isTimeForWebSqlBackup)) {
      var exportDataString = JSON.stringify(sessionDataAsOperations);
      if(exportDataString.length < 2333444) {
        try {
          localStorage["onViewClose_lastSessionSnapshot"] = exportDataString
        }catch(e) {
          window.chrome.extension.getBackgroundPage().console.error("ERROR SSC QUATA", e)
        }
      }else {
        window.chrome.extension.getBackgroundPage().console.warn("WARNING SSC QUATA");
        this.localStorageQuataReached = true
      }
    }
  }catch(e) {
  }
  setTimeout(function() {
    saveToDefaultIndexedDB(currentSessionSnapshotDbKey, sessionDataAsOperations)
  }, 1);
  setTimeout(function() {
    saveSessionDataAsFile(currentSessionSnapshotFilename, sessionDataAsOperations)
  }, 1);
  if(window["treeWriteFail"] || isTimeForWebSqlBackup) {
    setTimeout(function() {
      backupSessionDataInWebSQL(JSON.stringify(sessionDataAsOperations), sessionDataAsOperations.length)
    }, 1);
    window["lastWebSqlBackupTime"] = Date.now()
  }
  performBackups(sessionDataAsOperations, "lastDaylyBackupTime", 24 * 60 * 60 * 1E3, "d-backup-", 9);
  performBackups(sessionDataAsOperations, "lastHourlyBackupTime", 60 * 60 * 1E3, "h-backup-", 6)
}, EOC:null});
function backupSessionDataInWebSQL(dataString, op_array_len) {
  var db = openDatabase("backupdb", "1.0", "Tree Backup", 20 * 1024 * 1024);
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS current_session_snapshot (id unique, timestamp, op_array_len, data)");
    tx.executeSql("INSERT OR REPLACE INTO current_session_snapshot (id, timestamp, op_array_len, data) VALUES (?, ?, ?, ?)", [1, Date.now(), op_array_len, dataString])
  })
}
function readSessionDataBackupFromWebSQL(callback) {
  var db = openDatabase("backupdb", "1.0", "Tree Backup", 20 * 1024 * 1024);
  db.readTransaction(function(tx) {
    tx.executeSql("SELECT * FROM current_session_snapshot WHERE id == 1", [], function(tx, results) {
      var result = results.rows.item(0);
      if(!result) {
        if(console) {
          console.log("WEBSQL backup read error - result is empty")
        }
        callback(null)
      }else {
        try {
          var operations = JSON.parse(result.data)
        }catch(parseError) {
          callback(parseError)
        }
        callback(operations)
      }
    }, function(error) {
      if(console) {
        console.log("WEBSQL executeSql error:", error)
      }
      callback(null)
    })
  })
}
function getV34DataSaveTime(operations) {
  if(isValidV34Data_endNodeIsEof(operations)) {
    return operations[operations.length - 1]["time"]
  }
  return NaN
}
function isValidV34Data_endNodeIsEof(operations) {
  return operations && (operations.length && (operations.length >= 2 && (operations[0]["type"] == DbOperations.OperationsEnum.NODE_NEWROOT && operations[operations.length - 1]["type"] == DbOperations.OperationsEnum.EOF)))
}
function performBackups(sessionDataAsOperations, localStorageFieldForLastBackupTimestamp, timeBetweenBackups, backupFilePrefix, howManyBackupsHandle) {
  var lastBackupTime = Number(localStorage[localStorageFieldForLastBackupTimestamp] || 0);
  if(Math.abs(Date.now() - lastBackupTime) > timeBetweenBackups) {
    localStorage[localStorageFieldForLastBackupTimestamp] = Date.now();
    setTimeout(function() {
      saveSessionDataAsFile(backupFilePrefix + Date.now() + "-" + sessionDataAsOperations.length + ".json", sessionDataAsOperations, function onwriteend() {
        deleteOlderBackups(backupFilePrefix, howManyBackupsHandle)
      })
    }, 5E3 + Math.round(Math.random() * 2E3))
  }
}
function deleteOlderBackups(backupFilePrefix, howManyBackupsHandle) {
  listAllFiles(function(entries) {
    var pattern = new RegExp(backupFilePrefix + "([\\d]*)-[\\d]*\\.json");
    var nowTime = Date.now();
    var sortedBackupFilesWithTime = entries.filter(function(dirEntry) {
      return dirEntry.isFile && pattern.test(dirEntry.name)
    }).map(function(dirEntry) {
      return{"dirEntry":dirEntry, "time":Number(dirEntry.name.match(pattern)[1])}
    }).sort(function(o1, o2) {
      return Math.abs(o1["time"] - nowTime) - Math.abs(o2["time"] - nowTime)
    });
    for(var i = howManyBackupsHandle;i < sortedBackupFilesWithTime.length;i++) {
      deleteFileByFullPath(sortedBackupFilesWithTime[i]["dirEntry"].fullPath)
    }
  })
}
function deleteFileByFullPath(fullPath, continuneCallback) {
  continuneCallback = continuneCallback || function() {
  };
  window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function(fs) {
    fs.root.getFile(fullPath, {create:false}, function(fileEntry) {
      fileEntry.remove(continuneCallback)
    })
  })
}
function consoleLoglistOfAllFiles() {
  listAllFiles(function(entries) {
    console.log("- Files -------------------------------");
    for(var i = 0;i < entries.length;i++) {
      console.log(entries[i].name)
    }
  })
}
function listAllFiles(callback_listResults) {
  window.requestFileSystem(window.PERSISTENT, 1024 * 1024, onInitFs_listAllFiles, fsErrorHandler);
  function onInitFs_listAllFiles(fs) {
    var dirReader = fs.root.createReader();
    var entries = [];
    var readEntries = function() {
      dirReader.readEntries(function(results) {
        if(!results.length) {
          callback_listResults(entries)
        }else {
          entries = entries.concat(Array.prototype.slice.call(results || [], 0));
          readEntries()
        }
      }, fsErrorHandler)
    };
    readEntries()
  }
}
function ActiveSession(continueCallback) {
  this.treeModel = null;
  this.onRemovedTracker = new OnRemovedTracker;
  this.treeModelPersistenceManager = new TreeModelPersistenceManagerIndexedDBAndFilesystem;
  var _this = this;
  this.treeModelPersistenceManager.restoreTree(function(restoredHierarchy) {
    var rootNode = restoredHierarchy;
    if(!rootNode) {
      rootNode = new NodeSession
    }
    rootNode.advanceNextDidToValue(localStorage["be_onRestartAdvaceNextDidToLastSentDidForNextDiff"]);
    _this.treeModel = extentToTreeModel([rootNode], _this.treeModelPersistenceManager);
    _this.applyOnRemovedRecordedBeforeLastSessionExit();
    _this.asyncSynchronizeTreeWithOpenWindowsList(function continueInit() {
      _this.registerChromeEventsListeners();
      continueCallback()
    })
  })
}
ActiveSession.prototype = {applyOnRemovedRecordedBeforeLastSessionExit:function() {
  try {
    var tabOnRemovedEvents = this.onRemovedTracker.getTabsOnRemovedEventsFromLastSession();
    var tabOnRemovedIds = Object.keys(tabOnRemovedEvents);
    for(var i = 0;i < tabOnRemovedIds.length;i++) {
      var closedTabId = tabOnRemovedIds[i];
      var closedTabClosingInfo = tabOnRemovedEvents[closedTabId];
      if(console) {
        console.log("APPLY CT", closedTabId, JSON.stringify(closedTabClosingInfo))
      }
      this.treeModel.onActiveTabRemoved(closedTabId, closedTabClosingInfo, true)
    }
    var winOnRemovedEvents = this.onRemovedTracker.getWindowsOnRemovedEventsFromLastSession();
    var winOnRemovedIds = Object.keys(winOnRemovedEvents);
    for(i = 0;i < winOnRemovedIds.length;i++) {
      if(console) {
        console.log("APPLY CW", winOnRemovedIds[i])
      }
      this.treeModel.onActiveWindowRemoved(winOnRemovedIds[i], true)
    }
  }catch(e) {
    console.error("ERROR ! AORRBRS", e);
    console.log(e["message"]);
    console.log(e["stack"])
  }
}, asyncSynchronizeTreeWithOpenWindowsList:function(doneCallback) {
  var _this = this;
  window.chrome.windows.getAll({"populate":true}, function(chromeActiveWindowObjectsList) {
    var listOfTabNodesThatMustBeConvertedToSaved = [];
    forEachNodeInTree_noChangesInTree(_this.treeModel, function(node) {
      if(node.updateChromeTabObjOrRequestConvertToSavedIfNotInActiveList) {
        node.updateChromeTabObjOrRequestConvertToSavedIfNotInActiveList(chromeActiveWindowObjectsList, listOfTabNodesThatMustBeConvertedToSaved)
      }
    });
    listOfTabNodesThatMustBeConvertedToSaved.forEach(function(tabNode) {
      tabNode.replaceSelfInTreeBy_mergeSubnodesAndMarks(new NodeTabSavedAfterCrash(tabNode.chromeTabObj))
    });
    var listOfWindowNodesThatMustBeConvertedToSaved = [];
    var crashedSavedPopupWindowNodes = [];
    forEachNodeInTree_noChangesInTree(_this.treeModel, function(node) {
      if(node.updateChromeWindowObjOrConvertToSavedIfNoActiveTabNodesCreated) {
        node.updateChromeWindowObjOrConvertToSavedIfNoActiveTabNodesCreated(chromeActiveWindowObjectsList, listOfWindowNodesThatMustBeConvertedToSaved)
      }
    });
    listOfWindowNodesThatMustBeConvertedToSaved.forEach(function(windowNode) {
      var newNode = windowNode.replaceSelfInTreeBy_mergeSubnodesAndMarks(new NodeWindowSavedAfterCrash(windowNode.chromeWindowObj));
      if(newNode.chromeWindowObj && (newNode.chromeWindowObj.type && newNode.chromeWindowObj.type == "popup")) {
        var crashedSavedPopupWinNode = newNode;
        if(crashedSavedPopupWinNode.subnodes.length === 1) {
          var crashedPopupTab = crashedSavedPopupWinNode.subnodes[0];
          if(crashedPopupTab.subnodes.length === 0 && (!crashedPopupTab.isCustomMarksPresent() && !crashedSavedPopupWinNode.isCustomMarksPresent())) {
            crashedSavedPopupWinNode.removeOwnTreeFromParent()
          }
        }
      }
    });
    chromeActiveWindowObjectsList.forEach(function(chromeWindowObj) {
      if(!chromeWindowObj.isUsedByNode) {
        _this.fromChrome_onWindowCreated(chromeWindowObj)
      }else {
        delete chromeWindowObj.isUsedByNode
      }
      chromeWindowObj.tabs.forEach(function(chromeTabObj) {
        if(!chromeTabObj.isUsedByNode) {
          _this.fromChrome_onTabCreated(chromeTabObj)
        }else {
          delete chromeTabObj.isUsedByNode
        }
      });
      if(chromeWindowObj.haveActiveTabNodesInTree) {
        delete chromeWindowObj.haveActiveTabNodesInTree
      }
    });
    forEachNodeInTree_noChangesInTree(_this.treeModel, function(node) {
      if(node.onAfterCrashRestorationDone) {
        node.onAfterCrashRestorationDone()
      }
    });
    doneCallback()
  })
}, registerChromeEventsListeners:function() {
  if(!window.chrome.tabs.onReplaced) {
    window.chrome.tabs.onReplaced = {addListener:function(f) {
    }}
  }
  if(debugLogChromeOperations) {
    window.chrome.tabs.onCreated.addListener(function(tab) {
      console.log("Tab onCreated tabid:" + tab.id + "; url:" + tab.url, tab)
    });
    window.chrome.tabs.onRemoved.addListener(function(tabId, isWindowClosing) {
      console.log("Tab onRemoved tabid:" + tabId + "; isWindowClosingInformation:", isWindowClosing)
    });
    window.chrome.tabs.onAttached.addListener(function(tabId, attachInfo) {
      console.log("Tab onAttached tabid:" + tabId + "; attached to windowid:" + attachInfo.newWindowId, attachInfo)
    });
    window.chrome.tabs.onDetached.addListener(function(tabId, detachInfo) {
      console.log("Tab onDetached tabid:" + tabId + "; detached from windowid:" + detachInfo.oldWindowId, detachInfo)
    });
    window.chrome.tabs.onMoved.addListener(function(tabId, info) {
      console.log("Tab onMoved tabid:" + tabId, info)
    });
    window.chrome.tabs.onUpdated.addListener(function(tabId, changeInfornamtion, tab) {
      console.log("Tab onUpdated tabid:" + tabId + "; url: " + changeInfornamtion.url + "; status: " + changeInfornamtion.status + "; favicon url : " + tab.favIconUrl + "; changeInfornamtion:", changeInfornamtion, "; tab:", tab)
    });
    window.chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
      console.log("Tab onReplaced addedTabId:", addedTabId, "removedTabId:", removedTabId)
    });
    window.chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInformation) {
      console.log("Tab onSelectionChanged(deprecated) tabid:" + tabId + "; selected in window:" + selectInformation.windowId, selectInformation)
    });
    window.chrome.tabs.onActivated.addListener(function(activeInfo) {
      console.log("Tab onActivated activeInfo:", activeInfo)
    });
    window.chrome.windows.onCreated.addListener(function(windowObj) {
      console.log("Window onCreated winid:" + windowObj.id, windowObj)
    });
    window.chrome.windows.onRemoved.addListener(function(windowId) {
      console.log("Window onRemoved winid:" + windowId)
    });
    window.chrome.windows.onFocusChanged.addListener(function(windowId) {
      console.log("Window onFocusChanged winid:" + windowId + " got focus")
    })
  }
  window.chrome.tabs.onCreated.addListener(this.fromChrome_onTabCreated.bind(this));
  window.chrome.tabs.onRemoved.addListener(this.fromChrome_onTabRemoved.bind(this));
  window.chrome.tabs.onAttached.addListener(this.fromChrome_onTabAttached.bind(this));
  window.chrome.tabs.onDetached.addListener(this.fromChrome_onTabDetached.bind(this));
  window.chrome.tabs.onMoved.addListener(this.fromChrome_onTabMoved.bind(this));
  window.chrome.tabs.onUpdated.addListener(this.fromChrome_onTabUpdated.bind(this));
  window.chrome.tabs.onReplaced.addListener(this.fromChrome_onTabReplaced.bind(this));
  window.chrome.tabs.onActivated.addListener(this.fromChrome_onTabActivated.bind(this));
  window.chrome.windows.onCreated.addListener(this.fromChrome_onWindowCreated.bind(this));
  window.chrome.windows.onRemoved.addListener(this.fromChrome_onWindowRemoved.bind(this));
  window.chrome.windows.onFocusChanged.addListener(this.fromChrome_onWindowFocusChanged.bind(this));
  window.chrome.tabs.onCreated.addListener(updateBrowserActionTitle);
  window.chrome.tabs.onRemoved.addListener(updateBrowserActionTitle);
  window.chrome.windows.onCreated.addListener(updateBrowserActionTitle);
  window.chrome.windows.onRemoved.addListener(updateBrowserActionTitle);
  window.chrome.runtime.onMessageExternal.addListener(this.fromChrome_onExternalMessage.bind(this))
}, fromChrome_onExternalMessage:function(request, sender, sendResponse) {
  console.log("ExternalRequest:", request, sender);
  sendResponse({"isTrialExpired":true})
}, fromChrome_onTabReplaced:function(addedTabId, removedTabId) {
  var newTabNode = this.treeModel.onTabIdReplaced(removedTabId, addedTabId);
  if(!newTabNode) {
    return
  }
  window.chrome.tabs.get(newTabNode.chromeTabObj.id, function(chromeTabObj) {
    if(chromeTabObj) {
      newTabNode.updateChromeTabObj(chromeTabObj)
    }
  })
}, fromChrome_onTabCreated:function(chromeTabObj) {
  var nodeModelForAffectedWindow = this.treeModel.findActiveWindow(chromeTabObj.windowId);
  if(!nodeModelForAffectedWindow) {
    console.error("ERROR############# onTabCreated # Cannot find window in tree with windowId: " + chromeTabObj.windowId, chromeTabObj)
  }
  return nodeModelForAffectedWindow.fromChrome_onTabCreated(chromeTabObj, !!localStorage["relateNewTabToOpener"])
}, fromChrome_onWindowCreated:function(chromeWindowObj) {
  this.treeModel[0].insertAsLastSubnode(new NodeWindowActive(chromeWindowObj))
}, fromChrome_onTabAttached:function(tabId, attachInfo) {
  var windowNode = this.treeModel.findActiveWindow(attachInfo.newWindowId);
  if(!windowNode) {
    console.error("ERROR fromChrome_onTabAttached attachInfo.newWindowId has no coresponding windowNode in tree");
    return
  }
  var corespondingTabNodeInTargetWindow = windowNode.findAlifeTabInOwnTabsById(tabId);
  if(corespondingTabNodeInTargetWindow) {
    if(debugLogChromeOperations) {
      console.log("This Is Tabs Move Initiated By Our Extention Or Chrome Initiated In One Window ReAttach")
    }
    var corespondingTabNodeInTargetWindow_chromeTabObj = corespondingTabNodeInTargetWindow.chromeTabObj;
    if(corespondingTabNodeInTargetWindow_chromeTabObj.windowId === attachInfo.newWindowId) {
      if(debugLogChromeOperations) {
        console.log("This Is Tabs Move Inside One Window because of Initiated By Chrome Reattach")
      }
      if(attachInfo.newPosition !== corespondingTabNodeInTargetWindow_chromeTabObj.index) {
        this.chromeInitiated_moveTabNode(tabId, {"fromIndex":corespondingTabNodeInTargetWindow_chromeTabObj.index, "toIndex":attachInfo.newPosition, "windowId":attachInfo.newWindowId})
      }
    }else {
      if(debugLogChromeOperations) {
        console.log("This Is Tabs Move Initiated By Our Extention, between different tabsOrganizers")
      }
      corespondingTabNodeInTargetWindow_chromeTabObj.active = false;
      corespondingTabNodeInTargetWindow_chromeTabObj.windowId = attachInfo.newWindowId;
      corespondingTabNodeInTargetWindow_chromeTabObj.index = attachInfo.newPosition;
      corespondingTabNodeInTargetWindow.replaceSelfInTreeBy_mergeSubnodesAndMarks(new NodeTabActive(corespondingTabNodeInTargetWindow_chromeTabObj))
    }
    windowNode.fromChrome_onAlifeTabAppearInHierarchy()
  }else {
    if(debugLogChromeOperations) {
      console.log("This Crome Initiated Dettach-Attach between different windows")
    }
    this.chromeInitiated_moveTabNode(tabId, {"toIndex":attachInfo.newPosition, "windowId":attachInfo.newWindowId})
  }
}, fromChrome_onTabRemoved:function(tabId, isWindowClosingInfo) {
  if(isWindowClosingInfo && !isWindowClosingInfo["windowId"]) {
    isWindowClosingInfo["windowId"] = this.treeModel.findActiveWindowIdForTabId(tabId)
  }
  this.onRemovedTracker.register_onTabRemoved(tabId, isWindowClosingInfo);
  this.treeModel.onActiveTabRemoved(tabId, isWindowClosingInfo)
}, fromChrome_onWindowRemoved:function(windowId) {
  this.onRemovedTracker.register_onWindowRemoved(windowId);
  this.treeModel.onActiveWindowRemoved(windowId)
}, fromChrome_onTabDetached:function(tabId, detachInfo) {
}, fromChrome_onTabMoved:function(tabId, moveInfo) {
  this.chromeInitiated_moveTabNode(tabId, moveInfo)
}, fromChrome_onTabActivated:function(activeInfo) {
  this.treeModel.setActiveTabInWindow(activeInfo["tabId"], activeInfo["windowId"])
}, fromChrome_onTabUpdated:function(tabId, changeInfornamtion, chromeTabObj) {
  lastSeenTabs[chromeTabObj.id] = chromeTabObj;
  var tabModel = this.treeModel.findActiveTab(tabId);
  if(tabModel) {
    this.requestTabNodeUpdate_getFaviconHack(tabModel, changeInfornamtion.status)
  }else {
    if(window.chrome.extension.getBackgroundPage().isRemovedTabIdUnexpected(tabId)) {
      console.error("ERROR NOT ! OTUPD #qwve#  ", tabId, chromeTabObj)
    }else {
      window.chrome.extension.getBackgroundPage().supressUnexpectedRemovedTabIdErrorFor(tabId)
    }
  }
}, fromChrome_onWindowFocusChanged:function(windowId) {
  if(windowId !== -1) {
    setTimeout(this.postponed_updateFocusedWindowState, 100, this, windowId)
  }
}, postponed_updateFocusedWindowState:function(_this, windowId) {
  if(!isThisWindowContainOurExtentionViews(windowId)) {
    var scrollToView = !!localStorage["doNotAutoscroll"] || winIdForWhichNeedSkipScrollToView == windowId ? false : true;
    _this.treeModel.setFocusedWindow(windowId, scrollToView)
  }
  winIdForWhichNeedSkipScrollToView = -1
}, requestTabNodeUpdate_getFaviconHack:function(tabModel, changeInfornamtion_status) {
  if(!tabModel.parent) {
    return
  }
  var _this = this;
  var DO_ONE_MORE_TRY_IF_NOFAVICON_AGAIN = "do one more try";
  var DO_ONE_MORE_TRY_IF_NOFAVICON_AGAIN_FINAL = "do one more try, final one";
  var STOP_TRYING_TO_OBTAIN_FAVICON = "stop trying";
  window.chrome.tabs.get(tabModel.chromeTabObj.id, function(chromeTabObj) {
    if(chromeTabObj) {
      tabModel.updateChromeTabObj(chromeTabObj);
      if(chromeTabObj.favIconUrl === undefined && chromeTabObj.url !== "chrome://newtab/") {
        if(changeInfornamtion_status === "complete") {
          setTimeout(function() {
            _this.requestTabNodeUpdate_getFaviconHack(tabModel, DO_ONE_MORE_TRY_IF_NOFAVICON_AGAIN)
          }, 600)
        }
        if(changeInfornamtion_status === DO_ONE_MORE_TRY_IF_NOFAVICON_AGAIN) {
          setTimeout(function() {
            _this.requestTabNodeUpdate_getFaviconHack(tabModel, STOP_TRYING_TO_OBTAIN_FAVICON)
          }, 1100)
        }
      }
    }else {
      console.log("CERROR ! NOCT RTNUGFH")
    }
  })
}, chromeInitiated_moveTabNode:function(tabId, moveInfo) {
  var nodeModelForMovedTab = this.treeModel.findActiveTab(tabId);
  var nodeModelForAffectedWindow = this.treeModel.findActiveWindow(moveInfo.windowId);
  if(!nodeModelForMovedTab) {
    console.error("ERROR############# onMove # Cannot find tab in tree with tabid: " + tabId);
    return
  }
  if(!nodeModelForAffectedWindow) {
    console.error("ERROR############# onMove # Cannot find window in tree with windowId: " + moveInfo.windowId);
    return
  }
  if(nodeModelForMovedTab === nodeModelForAffectedWindow.findAlifeTabInOwnTabsByIndex(moveInfo.toIndex)) {
    if(debugLogChromeOperations) {
      console.log("chromeInitiated_moveTabNodeInSameWindow called with toIndex which is same as node already have in tree - IGNORE")
    }
    return
  }
  var deletedActiveTabNode_chromeTabObj = nodeModelForMovedTab.chromeTabObj;
  this.treeModel.onActiveTabRemoved(deletedActiveTabNode_chromeTabObj.id, false, false);
  deletedActiveTabNode_chromeTabObj.windowId = moveInfo.windowId;
  deletedActiveTabNode_chromeTabObj.index = moveInfo.toIndex;
  var newActiveTabNode = nodeModelForAffectedWindow.fromChrome_onTabCreated(deletedActiveTabNode_chromeTabObj, !!localStorage["relateNewTabToOpener"]);
  this.requestTabNodeUpdate_getFaviconHack(newActiveTabNode, "complete")
}, END:null};
var TABS_OUTLINER_DEFAULT_WIDTH = 400;
function createNewActiveSessionViewWin(focusNodeId, altFocusNodeId, scrollToViewWinId, newWindowCreatedCallback, donecallback) {
  var createData = {"url":window.chrome.extension.getURL("activesessionview.html") + "?type=main&focusNodeId=" + focusNodeId + "&altFocusNodeId=" + altFocusNodeId + "&scrollToViewWinId=" + scrollToViewWinId, "type":"popup", "left":1, "top":1, "width":TABS_OUTLINER_DEFAULT_WIDTH, "height":window.screen.availHeight - 1 - 1, "focused":true};
  if(localStorage["openTabsOutlinerInLastClosedPos"]) {
    if(localStorage["MainViewLastClosedPos"]) {
      try {
        var oldpos = JSON.parse(localStorage["MainViewLastClosedPos"]);
        createData.left = oldpos["x"];
        createData.top = oldpos["y"];
        createData.width = oldpos["w"];
        createData.height = oldpos["h"]
      }catch(e) {
      }
    }
  }
  window.chrome.windows.create(createData, function(chromeWindowObj) {
    if(createData["height"] !== chromeWindowObj.height) {
      var updateData = {"width":createData["width"], "height":createData["height"]};
      window.chrome.windows.update(chromeWindowObj.id, updateData, null)
    }
    newWindowCreatedCallback(chromeWindowObj);
    donecallback(chromeWindowObj.id)
  })
}
var winIdForWhichNeedSkipScrollToView = -1;
function preventScrollToViewInNextOnFocusChangeForWinId(winId) {
  winIdForWhichNeedSkipScrollToView = winId
}
function focusWindow(winId, dontScrollToView) {
  if(!winId) {
    return
  }
  if(dontScrollToView) {
    preventScrollToViewInNextOnFocusChangeForWinId(winId)
  }
  window.chrome.windows.update(winId, {"focused":true})
}
function focusTab(winId, tabId, donecallback, dontScrollToView) {
  if(dontScrollToView) {
    preventScrollToViewInNextOnFocusChangeForWinId(winId)
  }
  window.chrome.tabs.update(tabId, {"selected":true}, function(chromeTabObj) {
    focusWindow(chromeTabObj.windowId, dontScrollToView);
    if(donecallback) {
      donecallback(chromeTabObj.windowId)
    }
  })
}
function focusTabIfAliveCreateIfAbsent(winId, tabId, focusNodeId, altFocusNodeId, scrollToViewWinId, createMethod, focusMethod, newWindowCreatedCallback, donecallback) {
  window.chrome.windows.getAll({"populate":true}, function(windowsList) {
    var ourWindow = windowsList.filter(function(chromeWindowObj) {
      return chromeWindowObj.id === winId
    });
    if(ourWindow.length >= 1) {
      var ourChromeWindowObj = ourWindow[0];
      if(ourChromeWindowObj.tabs.some(function(chromeTabObj) {
        return chromeTabObj.id === tabId
      })) {
        focusMethod(winId, tabId, donecallback)
      }else {
        createMethod(focusNodeId, altFocusNodeId, scrollToViewWinId, newWindowCreatedCallback, donecallback)
      }
    }else {
      createMethod(focusNodeId, altFocusNodeId, scrollToViewWinId, newWindowCreatedCallback, donecallback)
    }
  })
}
function updateBrowserActionTitle() {
  calculateNumberOfTabsAndWindow(setStatsInBrowserActionTitle)
}
function setStatsInBrowserActionTitle(tabsCount, windowsCount) {
  window.chrome.browserAction.setBadgeText({"text":"" + tabsCount});
  window.chrome.browserAction.setTitle({"title":"" + windowsCount + " windows / " + tabsCount + " tabs"})
}
function calculateNumberOfTabsAndWindow(callback) {
  window.chrome.windows.getAll({"populate":true}, function(windowsList) {
    var windowsCount = windowsList.length;
    var tabsCount = 0;
    windowsList.forEach(function(w) {
      tabsCount += w.tabs.length
    });
    callback(tabsCount, windowsCount)
  })
}
function isThisWindowContainOurExtentionViews(windowId) {
  var views = window.chrome.extension.getViews({"windowId":windowId});
  return views && views.length > 0
}
var mainActiveSessionViewWinId = null;
var mainActiveSessionViewTabId = null;
var activeSession;
var notUnexpectedRemovedTabsIds = [];
var notUnexpectedRemovedWindowsIds = [];
function supressUnexpectedRemovedTabIdErrorFor(id) {
  notUnexpectedRemovedTabsIds.push(id)
}
function supressUnexpectedRemovedWindowIdErrorFor(id) {
  notUnexpectedRemovedWindowsIds.push(id)
}
function isIdUnexpected(notUnexpectedIds, id) {
  var i = notUnexpectedIds.indexOf(id);
  if(i >= 0) {
    return false
  }else {
    return true
  }
}
function isRemovedTabIdUnexpected(id) {
  return isIdUnexpected(notUnexpectedRemovedTabsIds, id)
}
function isRemovedWindowIdUnexpected(id) {
  return isIdUnexpected(notUnexpectedRemovedWindowsIds, id)
}
window.onload = function() {
  setTimeout(function() {
    console.log("=== TabsOutliner Background script code started ===");
    activeSession = new ActiveSession(function continueExecution() {
      if(window.chrome.extension.getURL("/") == "chrome-extension://eggkanocgddhmamlbiijnphhppkpkmkl/") {
        window.chrome.browserAction.setBadgeBackgroundColor({color:[50, 104, 207, 255]})
      }else {
        window.chrome.browserAction.setBadgeBackgroundColor({color:[255, 150, 0, 255]})
      }
      updateBrowserActionTitle();
      window.chrome.browserAction.onClicked.addListener(browserAction_onClicked);
      if(localStorage["openOnStatup"]) {
        openTabsOutlinerMainView()
      }
    })
  }, 300)
};
function openTabsOutlinerMainView() {
  getLastFocusedTabIdAndWindowId(createOrFocusTabsOutlinerTab)
}
function getLastFocusedTabIdAndWindowId(callback) {
  chrome.windows.getLastFocused({"populate":true}, function(chromeWindowObj) {
    var selectedTabId = getSelectedTabIdInWindowObj(chromeWindowObj);
    var selectedWindowId = chromeWindowObj && chromeWindowObj.id;
    callback(selectedTabId, selectedWindowId)
  })
}
function getSelectedTabIdInWindowObj(chromeWindowObj) {
  if(!chromeWindowObj) {
    return undefined
  }
  if(!chromeWindowObj["tabs"]) {
    return undefined
  }
  var selectedTabId = chromeWindowObj["tabs"][0] && chromeWindowObj["tabs"][0].id;
  for(var i = 0;i < chromeWindowObj["tabs"].length;i++) {
    if(chromeWindowObj["tabs"][i]["selected"]) {
      selectedTabId = chromeWindowObj["tabs"][i].id
    }
  }
  return selectedTabId
}
function browserAction_onClicked(clickedChromeTabObj) {
  createOrFocusTabsOutlinerTab(clickedChromeTabObj.id, clickedChromeTabObj.windowId)
}
function createOrFocusTabsOutlinerTab(clickedChromeTabObj_id, clickedChromeTabObj_windowId, continueCallback) {
  var focusOpenTabNodeId = clickedChromeTabObj_id;
  var altFocusNodeId = clickedChromeTabObj_windowId;
  var scrollToViewWinId = clickedChromeTabObj_windowId;
  focusTabIfAliveCreateIfAbsent(mainActiveSessionViewWinId, mainActiveSessionViewTabId, focusOpenTabNodeId, altFocusNodeId, scrollToViewWinId, createNewActiveSessionViewWin, focusTab, function newWindowCreatedCallback(chromeWindowObj) {
    mainActiveSessionViewWinId = chromeWindowObj.id;
    window.chrome.tabs.getAllInWindow(chromeWindowObj.id, function(tabsList) {
      mainActiveSessionViewTabId = tabsList[0].id
    });
    activeSession.treeModel.setFocusedWindow(clickedChromeTabObj_windowId, true)
  }, function doneCallback(tabsOutlinerViewWindowId) {
    var tabsOutlinerDomWindows = window.chrome.extension.getViews({"windowId":mainActiveSessionViewWinId});
    tabsOutlinerDomWindows.forEach(function(ourWindow) {
      if(ourWindow && ourWindow[VIEW_selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick]) {
        ourWindow[VIEW_selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick](focusOpenTabNodeId, altFocusNodeId, scrollToViewWinId)
      }else {
      }
    });
    if(continueCallback) {
      continueCallback(clickedChromeTabObj_id, clickedChromeTabObj_windowId, tabsOutlinerViewWindowId)
    }
  })
}
function cloneTabsOutlinerView(tabsOutlinerInitiatorWindow_outerWidth, tabsOutlinerInitiatorWindow_screenX, sourceViewPageYOffset) {
  var createData = {url:window.chrome.extension.getURL("activesessionview.html") + "?type=clone&yo=" + sourceViewPageYOffset, type:"normal", left:tabsOutlinerInitiatorWindow_outerWidth + tabsOutlinerInitiatorWindow_screenX + 1, width:TABS_OUTLINER_DEFAULT_WIDTH, top:1, height:window.screen.availHeight - 1 - 1, focused:true};
  if(createData.left + createData.width > window.screen.availWidth) {
    delete createData.left
  }
  window.chrome.windows.create(createData, null)
}
function clickHandler(e, tab) {
  console.log(e.pageUrl, e.selectionText, e.mediaType, e.linkUrl, e.srcUrl, e, tab)
}
var backgroundInterpagesComunicationStorageForDragedItems = new BackgroundInterpagesComunicationStorageForDragedItems;
function BackgroundInterpagesComunicationStorageForDragedItems() {
  this.tabsOutlinerDraggedModel = null
}
BackgroundInterpagesComunicationStorageForDragedItems.prototype.setDragedModel = function(model) {
  this.tabsOutlinerDraggedModel = model
};
BackgroundInterpagesComunicationStorageForDragedItems.prototype.clearDragedModel = function() {
  this.tabsOutlinerDraggedModel = null
};
BackgroundInterpagesComunicationStorageForDragedItems.prototype.getDragedModel = function() {
  return this.tabsOutlinerDraggedModel
};
function closeAllWindowsExceptThis(excludedChromeWindowObjId) {
  activeSession.treeModel.getListOfAllActiveWindowNodes().forEach(function(openWindowNode) {
    if(openWindowNode.chromeWindowObj.id != excludedChromeWindowObjId) {
      openWindowNode.performChromeRemove(true, true)
    }
  })
}
function getActiveSessionTreeModel() {
  return activeSession.treeModel
}
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
function fsErrorHandler(err) {
  console.error("ERROR on file system access. FileError.code:", err["code"])
}
function saveSessionDataAsFile_fsErrorHandler(err) {
  console.error("ERROR on file system access. FileError.code:", err["code"]);
  window["treeWriteFail"] = true
}
var currentSessionSnapshotFilename = "currentSessionSnapshot.json";
function saveSessionDataAsFile(filename, sessionData, onwriteend) {
  if(debugLogChromeOperations) {
    if(console) {
      console.log("saveSessionDataAsFile START", filename, (new Date).toTimeString())
    }
  }
  var exportDataString = JSON.stringify(sessionData);
  var exportDataBlob = new Blob([exportDataString]);
  window.requestFileSystem(window.PERSISTENT, exportDataBlob.size + 100, fsReady, saveSessionDataAsFile_fsErrorHandler);
  function fsReady(fs) {
    fs.root.getFile(filename, {create:true, exclusive:false}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.truncate(0);
        fileWriter.onwriteend = function() {
          fileWriter.onwriteend = onwriteend || null;
          fileWriter.write(exportDataBlob)
        }
      }, saveSessionDataAsFile_fsErrorHandler)
    }, saveSessionDataAsFile_fsErrorHandler)
  }
}
var userSelectedFileToOpen;
function storeUserSelectedFile(file) {
  userSelectedFileToOpen = file
}
function readSessionDataFromUserSelectedFile(callback) {
  readJsonOperationsFromFile(userSelectedFileToOpen, callback)
}
function readSessionDataFromFile(filename, callback) {
  window.requestFileSystem(window.PERSISTENT, 1024 * 1024, fsReady, callback);
  function fsReady(fs) {
    fs.root.getFile(filename, {create:false}, function(fileEntry) {
      fileEntry.file(function(file) {
        readJsonOperationsFromFile(file, callback)
      }, callback)
    }, callback)
  }
}
function readJsonOperationsFromFile(file, callback) {
  var reader = new FileReader;
  reader.onloadend = function(e) {
    try {
      var operations = JSON.parse(e.target.result)
    }catch(parseError) {
      callback(parseError)
    }
    callback(operations)
  };
  reader.onerror = callback;
  reader.readAsText(file)
}
function saveCurrentSessionAsFileNow(callback) {
  console.time("= Save Tree Total ====");
  console.time("Serialize Tree Full");
  console.time("Serialize Tree");
  var exportData = serializeActiveSessionToOperations();
  console.timeEnd("Serialize Tree");
  console.time("Stringify Tree");
  var exportDataString = JSON.stringify(exportData);
  console.timeEnd("Stringify Tree");
  console.time("Blobify Tree");
  var exportDataBlob = new Blob([exportDataString], {"type":"application/octet-stream"});
  console.timeEnd("Blobify Tree");
  console.log("data.size:", exportDataBlob.size);
  console.timeEnd("Serialize Tree Full");
  window.requestFileSystem(window.TEMPORARY, exportDataBlob.size + 100, fsReady, fsErrorHandler);
  function fsReady(fs) {
    fs.root.getFile("tree-exported-" + (new Date).toDateString().replace(/ /g, "-") + ".tree", {create:true, exclusive:false}, function(fileEntry) {
      console.log("A file " + fileEntry.name + " was created successfully.");
      fileEntry.createWriter(function(fileWriter) {
        console.time("Write Data");
        fileWriter.write(exportDataBlob);
        console.timeEnd("Write Data");
        console.timeEnd("= Save Tree Total ====");
        console.log(fileEntry.toURL());
        callback(fileEntry, exportDataBlob)
      }, fsErrorHandler)
    }, fsErrorHandler)
  }
}
chrome.commands.onCommand.addListener(processCommand);
function processCommand(command) {
  calculateNumberOfTabsAndWindow(function(tabsCount, windowsCount) {
    getLastFocusedTabIdAndWindowId(function(tabId, windowId) {
      if(command == "save_close_current_tab") {
        if(tabsCount <= 1) {
          createOrFocusTabsOutlinerTab(tabId, windowId, saveTab)
        }else {
          saveTab(tabId)
        }
      }
      if(command == "save_close_current_window") {
        if(windowsCount <= 1) {
          createOrFocusTabsOutlinerTab(tabId, windowId, saveWindow)
        }else {
          saveWindow(tabId, windowId)
        }
      }
      if(command == "save_close_all_windows") {
        createOrFocusTabsOutlinerTab(tabId, windowId, saveAllWindows)
      }
    })
  })
}
function saveTab(tabId) {
  var tabModel = activeSession.treeModel.findActiveTab(tabId);
  if(tabModel) {
    tabModel.performChromeRemove(true)
  }else {
    console.error("ERROR NOT ! STM #qdfhwve#  ", tabId)
  }
}
function saveWindow(tabId, windowId) {
  var windowModel = activeSession.treeModel.findActiveWindow(windowId);
  if(windowModel) {
    windowModel.performChromeRemove(true, true)
  }else {
    console.error("ERROR NOT ! STM #qdfhwve#  ", tabId)
  }
}
function saveAllWindows(tabId, windowId, tabsOutlinerViewWinId) {
  closeAllWindowsExceptThis(tabsOutlinerViewWinId)
}
function getIdentityEmailNonInteractive(continue_callback) {
  chrome.identity.getProfileUserInfo(function(userInfo) {
    continue_callback(userInfo)
  })
}
function isEmailPemissionPresent(callback) {
  chrome.permissions.contains({permissions:["identity.email"], origins:[]}, callback)
}
function setLicenseKey(newLicenseKey_base64) {
  var keyObj = unpackLicenseKey(newLicenseKey_base64);
  if(!keyObj || (!keyObj["serial"] || (!keyObj["timestamp"] || (!keyObj["product"] || !keyObj["signature"])))) {
    return false
  }
  _addLicenseKeyToLocalStorage(keyObj);
  _addLicenseKeyToSyncStorage(keyObj);
  return true
}
function unpackLicenseKey(licenseKeyUrlString) {
  var keyString = window.atob(decodeURIComponent(licenseKeyUrlString));
  try {
    var keyObj = JSON.parse(keyString)
  }catch(e) {
    return false
  }
  return keyObj
}
function packLicenseKey(keyObj) {
  return encodeURIComponent(window.btoa(JSON.stringify(keyObj)))
}
function _addLicenseKeyToLocalStorage(keyObj, isFromSyncStorage) {
  var keysArray = getArrayFromLocalStorage("licenseKeys");
  var keysArray_ = keysArray.filter(function(obj) {
    return obj.serial != keyObj.serial
  });
  keysArray_.push(keyObj);
  setArrayToLocalStorage("licenseKeys", keysArray_);
  if(keysArray_.length > keysArray.length) {
    chrome.extension.getBackgroundPage().ga_event("New License Key Added" + (isFromSyncStorage ? " - From Sync" : " - From Link"));
    return true
  }else {
    return false
  }
}
function getLicenseKeys() {
  return getArrayFromLocalStorage("licenseKeys")
}
function sha1_promise(str) {
  var buffer = (new TextEncoder("utf-8")).encode(str);
  return window.crypto.subtle.digest("SHA-1", buffer).then(function(hash) {
    return hex(hash)
  })
}
function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for(var i = 0;i < view.byteLength;i += 4) {
    var value = view.getUint32(i);
    var stringValue = value.toString(16);
    var padding = "00000000";
    var paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue)
  }
  return hexCodes.join("")
}
function console_log_licenseKeysLinks(console) {
  var keys = getLicenseKeys();
  keys.forEach(function(key) {
    console.log(key);
    console.log("Key Apply URL:");
    console.log(chrome.runtime.getURL("options.html") + "?setkey=" + packLicenseKey(key))
  })
}
function calculateSerialNumber_promise(email) {
  return sha1_promise(email.toLowerCase())
}
function checkLicenseKeySignature_promise(licenseKeyObj) {
  var message = licenseKeyObj.timestamp + licenseKeyObj.serial + licenseKeyObj.product;
  var signature = licenseKeyObj.signature;
  return new Promise(function(resolve, reject) {
    SignatureValidator.isMessageSignatureValid_promise(message, signature).then(function(result) {
      if(result) {
        resolve(licenseKeyObj)
      }else {
        reject(licenseKeyObj)
      }
    })
  })
}
function isSomeLicenseKeyValid_promise(licenseKeysArray, userEmail) {
  return calculateSerialNumber_promise(userEmail).then(findAndValidateRelatedLicenseKey_promise);
  function findAndValidateRelatedLicenseKey_promise(serialNumber) {
    return new Promise(function(resolve, reject) {
      var licenseKey = licenseKeysArray.filter(function(key) {
        return key.serial == serialNumber
      })[0];
      if(licenseKey && licenseKey.serial == serialNumber) {
        checkLicenseKeySignature_promise(licenseKey).then(resolve).catch(reject)
      }else {
        reject(licenseKeysArray[0])
      }
    })
  }
}
chrome.identity.onSignInChanged.addListener(function(accountInfo, isSignedIn) {
  checkAndUpdateLicenseStatusInAllViews(accountInfo, isSignedIn)
});
function checkAndUpdateLicenseStatusInAllViews(onSignInChanged_accountInfo, onSignInChanged_isSignedIn) {

  var licenseKeys = getLicenseKeys();
  if(licenseKeys.length == 0) {
    notifyAllViews_invalidLicenseState_NoLicenseKey({"isLicenseValid":false, "isUserEmailAccessible":false, "isLicenseKeyPresent":false, "userInfoEmail":null, "licenseKey":null, "onSignInChanged_isSignedIn":onSignInChanged_isSignedIn});
    return
  }
  getIdentityEmailNonInteractive(function(userInfo) {
    if(userInfo && userInfo.email) {
      isSomeLicenseKeyValid_promise(licenseKeys, userInfo.email).then(function(validLicenseKey) {
        notifyAllViews_validLicenseState({"isLicenseValid":true, "isUserEmailAccessible":true, "isLicenseKeyPresent":true, "userInfoEmail":userInfo.email, "licenseKey":validLicenseKey})
      }).catch(function(invalidLicenseKey) {
        notifyAllViews_invalidLicenseState_KeyPresentIdentityIsAccesibleButNotMatchTheLicenseKey({"isLicenseValid":false, "isUserEmailAccessible":true, "isLicenseKeyPresent":true, "userInfoEmail":userInfo.email, "licenseKey":invalidLicenseKey})
      })
    }else {
      chrome.identity.getAuthToken({"interactive":false}, function(token) {
        if(!token && chrome.runtime.lastError.message == "The user is not signed in.") {
          notifyAllViews_invalidLicenseState_KeyPresentButChromeIsNotSignedIn({"isLicenseValid":false, "isUserEmailAccessible":false, "isLicenseKeyPresent":true, "userInfoEmail":null, "licenseKey":licenseKeys[0]})
        }else {
          notifyAllViews_invalidLicenseState_KeyPresentChromeIsSignedInButNoEmailPermission({"isLicenseValid":false, "isUserEmailAccessible":false, "isLicenseKeyPresent":true, "userInfoEmail":null, "licenseKey":licenseKeys[0]})
        }
      })
    }
  })
}
function callOnAllViews(methodName, argument1, argument2, argument3) {
  chrome.extension.getViews({}).forEach(function(tab) {
    try {
      if(tab && tab[methodName]) {
        tab[methodName](argument1, argument2, argument3)
      }
    }catch(e) {
      console.error(e);
      console.error(e.stack)
    }
  })
}
function notifyAllViews_validLicenseState(licenseStateValues) {
  callOnAllViews("setLicenseState_valid", licenseStateValues)
}
function notifyAllViews_invalidLicenseState_KeyPresentIdentityIsAccesibleButNotMatchTheLicenseKey(licenseStateValues) {
  callOnAllViews("setLicenseState_invalid_KeyPresentIdentityIsAccesibleButNotMatchTheLicenseKey", licenseStateValues)
}
function notifyAllViews_invalidLicenseState_KeyPresentButChromeIsNotSignedIn(licenseStateValues) {
  callOnAllViews("setLicenseState_invalid_KeyPresentButChromeIsNotSignedIn", licenseStateValues)
}
function notifyAllViews_invalidLicenseState_KeyPresentChromeIsSignedInButNoEmailPermission(licenseStateValues) {
  callOnAllViews("setLicenseState_invalid_KeyPresentChromeIsSignedInButNoEmailPermission", licenseStateValues)
}
function notifyAllViews_invalidLicenseState_NoLicenseKey(licenseStateValues) {
  callOnAllViews("setLicenseState_invalid_NoLicenseKey", licenseStateValues)
}
function optionsChanged_notifyAllViews(changedOption) {
  callOnAllViews("optionsChanged_message", changedOption)
}
function getArrayFromLocalStorage(arrayName) {
  try {
    var r = JSON.parse(localStorage[arrayName])
  }catch(e) {
    r = []
  }
  return r
}
function setArrayToLocalStorage(arrayName, arrayObj) {
  localStorage[arrayName] = JSON.stringify(arrayObj)
}
function firstUseOfEventMark(eventTitle) {
  var alreadyFiredEventsArray = getArrayFromLocalStorage("alreadyFiredEventsArray");
  if(alreadyFiredEventsArray.some(function(item) {
    return item == eventTitle
  })) {
    return"N"
  }else {
    alreadyFiredEventsArray.push(eventTitle);
    setArrayToLocalStorage("alreadyFiredEventsArray", alreadyFiredEventsArray);
    return"Y"
  }
}
function pad4(n) {
  var padding = "0000";
  return(padding + n).slice(-padding.length)
}
function beforeAfter(n) {
  if(n > 0) {
    return"B" + pad4(n | 0)
  }else {
    return"A" + pad4(-n | 0)
  }
}
function getInstallTimestamp() {
  return Number(localStorage["install"])
}
var releaseDate = new Date(2015, 9, 28);
function msecondsInstalledBeforePaidRelease() {
  return releaseDate.getTime() - (getInstallTimestamp() || 0)
}
function getInstanceInstallDayDimension() {
  return getInstallDimension(24 * 60 * 60 * 1E3)
}
function getInstanceInstallWeekDimension() {
  return getInstallDimension(7 * 24 * 60 * 60 * 1E3)
}
function getInstanceInstallMonthDimension() {
  return getInstallDimension(30 * 24 * 60 * 60 * 1E3)
}
function getInstallDimension(k) {
  if(!getInstallTimestamp()) {
    return"NONE"
  }
  var days_weeks_months = msecondsInstalledBeforePaidRelease() / k;
  return beforeAfter(days_weeks_months)
}
var ga;
(function(i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date;
  a = s.createElement(o), m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");
ga("create", "UA-33566936-5", "auto");
ga("set", "checkProtocolTask", null);
ga("set", "useBeacon", true);
ga("set", "appName", chrome.app.getDetails().name);
ga("set", "appVersion", chrome.app.getDetails().version);
ga("set", "appId", chrome.app.getDetails().id);
function ga_setInstanceInstallTimeDimensions() {
  ga("set", "dimension6", getInstanceInstallDayDimension());
  ga("set", "dimension7", getInstanceInstallWeekDimension());
  ga("set", "dimension8", getInstanceInstallMonthDimension())
}
ga_setInstanceInstallTimeDimensions();
ga("set", "dimension9", get_signin_state_dimension("profile_sign_in"));
ga("set", "dimension10", get_signin_state_dimension("email_access"));
ga("set", "dimension11", get_signin_state_dimension("gdrive_access"));
ga("set", "dimension12", !!localStorage["oneClickToOpen"] ? "1" : "2");
function ga_screenview(screenName) {
  var page = "/" + screenName.replace(/ /g, "");
  ga("set", {"location":window.location.protocol + "//" + window.location.hostname + page});
  ga("set", {"page":page, "title":screenName});
  ga("send", "pageview", setFirstUseDimension("pageview@" + screenName))
}
function incrementLocalStorageValue(valueName) {
  var v = Number(localStorage["valueName"]) || 0;
  localStorage[valueName] = ++v
}
function setFirstUseDimension(titleForFirstUseCheck) {
  return{"dimension2":firstUseOfEventMark(titleForFirstUseCheck)}
}
function ga_event_access_states(eventTitle, chromeSignedInState, emailGrantedState, gdriveAccessGrantedState) {
  if(chromeSignedInState) {
    ga_set_access_state_dimension("dimension9", "profile_sign_in", chromeSignedInState)
  }
  if(emailGrantedState) {
    ga_set_access_state_dimension("dimension10", "email_access", emailGrantedState)
  }
  if(gdriveAccessGrantedState) {
    ga_set_access_state_dimension("dimension11", "gdrive_access", gdriveAccessGrantedState)
  }
  ga_event(eventTitle)
}
function ga_set_access_state_dimension(dimensionId, dimensionStateName, newDimensionState) {
  ga_signin_state_dimension(dimensionStateName, newDimensionState);
  ga("set", dimensionId, get_signin_state_dimension(dimensionStateName))
}
function ga_signin_state_dimension(dimensionName, newState) {
  var currentState = get_signin_state_dimension(dimensionName);
  if(currentState.slice(-1) == newState) {
    return
  }
  if(newState == "N") {
    if(currentState == "Y" || currentState == "NY") {
      localStorage[dimensionName] = "YN"
    }else {
      localStorage[dimensionName] = "N"
    }
    return
  }
  if(newState == "Y") {
    if(currentState == "N" || currentState == "YN") {
      localStorage[dimensionName] = "NY"
    }else {
      localStorage[dimensionName] = "Y"
    }
    return
  }
  if(currentState == "-") {
    localStorage[dimensionName] = newState;
    return
  }
}
function get_signin_state_dimension(dimensionName) {
  return localStorage[dimensionName] || "-"
}
function ga_event_backup_view(eventTitle, errorText) {
  var category = "Backup View";
  var action = eventTitle;
  var label = errorText || "-";
  ga("send", "event", category, action, label, setFirstUseDimension(category + "#" + action))
}
function ga_event(eventTitle) {
  var category = "Flow";
  var action = eventTitle;
  var label = "-";
  ga("send", "event", category, action, label, setFirstUseDimension(category + "#" + action))
}
function ga_event_error(eventTitle, errorText) {
  var category = "Error";
  var action = eventTitle;
  var label = errorText || "-";
  ga("send", "event", category, action, label, setFirstUseDimension(category + "#" + action + "#" + label))
}
function ga_event_backup_started(isInteractive) {
  var category = "Backup";
  var action = "Backup Started";
  var label = isInteractive ? "Interactive" : "Auto";
  ga("send", "event", category, action, label, setFirstUseDimension(category + "#" + action + "#" + label));
  incrementLocalStorageValue("backup_atemptCount")
}
function ga_event_backup_succeded(backupRequestBodySize) {
  var category = "Backup";
  var action = "Backup Succeded";
  var label = "-";
  ga("send", "event", category, action, label, backupRequestBodySize, setFirstUseDimension(category + "#" + action));
  incrementLocalStorageValue("backup_successCount")
}
function ga_event_backup_error(errorReason) {
  var category = "Backup";
  var action = "Backup Failed";
  var label = errorReason || "-";
  ga("send", "event", category, action, label);
  incrementLocalStorageValue("backup_failsCount")
}
var licenseKeyLinkRegExp = /\?tabsoutlinerkey=(.*)/;
var alreadyDetektedLicenseKey;
function licenseKeyLinkHandler(tabId, changeInfornamtion, tab) {
  var match = licenseKeyLinkRegExp.exec(tab.url);
  if(match && match[1]) {
    var key = match[1];
    if(key != alreadyDetektedLicenseKey) {
      window.chrome.tabs.create({"url":chrome.runtime.getURL("options.html") + "?setkey=" + key, "active":true});
      alreadyDetektedLicenseKey = key
    }
  }
}
window.chrome.tabs.onUpdated.addListener(licenseKeyLinkHandler);
function _addLicenseKeyToSyncStorage(keyObj) {
  chrome.storage.sync.get({"licenseKeys":[]}, function getKeys(syncDataObj) {
    var keysArray = syncDataObj["licenseKeys"];
    var keysArray_ = keysArray.filter(function(obj) {
      return obj.serial != keyObj.serial
    });
    keysArray_.push(keyObj);
    chrome.storage.sync.set({"licenseKeys":keysArray_})
  })
}
setTimeout(function() {
  chrome.storage.sync.get({"licenseKeys":[]}, adapter_proceedLicenseKeysFromSyncStorage);
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if(changes["licenseKeys"]) {
      proceedLicenseKeysFromSyncStorage(changes["licenseKeys"]["newValue"])
    }
  })
}, 1E3);
function adapter_proceedLicenseKeysFromSyncStorage(syncDataObj) {
  proceedLicenseKeysFromSyncStorage(syncDataObj["licenseKeys"])
}
function proceedLicenseKeysFromSyncStorage(licensekeys) {
  if(!licensekeys) {
    return
  }
  var isNewKeyAppears = false;
  licensekeys.forEach(function(licensekey) {
    isNewKeyAppears |= _addLicenseKeyToLocalStorage(licensekey, true)
  });
  if(isNewKeyAppears) {
    console.log("New license key applied from chrome.sync");
    checkAndUpdateLicenseStatusInAllViews()
  }
}
var VIEW_selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick = "__a";
window["backgroundInterpagesComunicationStorageForDragedItems"] = backgroundInterpagesComunicationStorageForDragedItems;
window["preventScrollToViewInNextOnFocusChangeForWinId"] = preventScrollToViewInNextOnFocusChangeForWinId;
window["focusTab"] = focusTab;
window["focusWindow"] = focusWindow;
window["supressUnexpectedRemovedTabIdErrorFor"] = supressUnexpectedRemovedTabIdErrorFor;
window["supressUnexpectedRemovedWindowIdErrorFor"] = supressUnexpectedRemovedWindowIdErrorFor;
window["closeAllWindowsExceptThis"] = closeAllWindowsExceptThis;
window["cloneTabsOutlinerView"] = cloneTabsOutlinerView;
window["getActiveSessionTreeModel"] = getActiveSessionTreeModel;
window["isRemovedTabIdUnexpected"] = isRemovedTabIdUnexpected;
window["isRemovedWindowIdUnexpected"] = isRemovedWindowIdUnexpected;
window["checkAndUpdateLicenseStatusInAllViews"] = checkAndUpdateLicenseStatusInAllViews;
window["setLicenseKey"] = setLicenseKey;
window["calculateSerialNumber_promise"] = calculateSerialNumber_promise;
window["console_log_licenseKeysLinks"] = console_log_licenseKeysLinks;
window["listAllFiles"] = listAllFiles;
window["deleteFileByFullPath"] = deleteFileByFullPath;
window["readSessionDataFromFile"] = readSessionDataFromFile;
window["enableDetailedLogs"] = enableDetailedLogs;
window["disableDetailedLogs"] = disableDetailedLogs;
window["optionsChanged_notifyAllViews"] = optionsChanged_notifyAllViews;
window["ga"] = ga;
window["ga_screenview"] = ga_screenview;
window["ga_event"] = ga_event;
window["ga_event_error"] = ga_event_error;
window["ga_event_backup_started"] = ga_event_backup_started;
window["ga_event_backup_error"] = ga_event_backup_error;
window["ga_event_backup_succeded"] = ga_event_backup_succeded;
window["ga_signin_state_dimension"] = ga_signin_state_dimension;
window["ga_event_access_states"] = ga_event_access_states;
window["ga_event_backup_view"] = ga_event_backup_view;
console.log("enableDetailedLogs() / disableDetailedLogs()");
window["saveCurrentSessionAsFileNow"] = saveCurrentSessionAsFileNow;
window["storeUserSelectedFile"] = storeUserSelectedFile;
window["readSessionDataFromUserSelectedFile"] = readSessionDataFromUserSelectedFile;

///////////////////////////////////
console.log("Hello tab outline")

// notifyAllViews_validLicenseState({"isLicenseValid":true, "isUserEmailAccessible":true, "isLicenseKeyPresent":true, "userInfoEmail":"yuguorui96@gmail.com", "licenseKey":"123456"})
///////////////////////////////////