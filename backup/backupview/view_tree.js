// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
chrome.extension.getBackgroundPage().ga_screenview("Backup View");
function EntrysLoader(treeModel, treeId, userId, entrysCdidsListInOrderOfAppearence, entrysCdidsToNodesMap) {
  this.treeId = treeId;
  this.userId = userId;
  this.entrysCdidsToNodesMap = entrysCdidsToNodesMap
}
EntrysLoader.prototype.requestEntrysByRev = function(rev) {
  this._requestEntrys("/render_entrys?userId=" + this.userId + "&treeId=" + this.treeId + "&rev=" + rev)
};
EntrysLoader.prototype.requestTreeByRev = function(rev) {
  this._requestTree("/render_knots?userId=" + this.userId + "&treeId=" + this.treeId + "&rev=" + rev)
};
EntrysLoader.prototype.requestTreeByTime = function(utcTimestamp) {
  this._requestTree("/render_knots?userId=" + this.userId + "&treeId=" + this.treeId + "&utcTimestamp=" + utcTimestamp)
};
EntrysLoader.prototype._entrysReady = function(entrysDict) {
  var entrysCdidsArray = [];
  for(var cdid in entrysDict) {
    if(cdid) {
      entrysCdidsArray.push(cdid)
    }
  }
  var BATCH_SIZE = 200;
  var PAUSE_BEFORE_NEXT_BATCH = 1;
  scheduleEntrysBatchInsert(BATCH_SIZE);
  var _this = this;
  function scheduleEntrysBatchInsert(entrysToInsertInOneBatch) {
    setTimeout(function insertEntrysInBatch() {
      var cdid;
      while(cdid = entrysCdidsArray.pop()) {
        var node = _this.entrysCdidsToNodesMap[cdid];
        setEntry(node, entrysDict[cdid]);
        if(--entrysToInsertInOneBatch <= 0) {
          scheduleEntrysBatchInsert(BATCH_SIZE);
          break
        }
      }
      if(entrysCdidsArray.length == 0) {
        showAjaxSpiner(false)
      }
    }, PAUSE_BEFORE_NEXT_BATCH)
  }
};
EntrysLoader.prototype._knotsReady = function(treeData) {
  renderTree(treeData, window.document)
};
EntrysLoader.prototype._requestEntrys = function(url) {
  var xmlhttp = new XMLHttpRequest;
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = onreadystatechange;
  var _entrysReady = this._entrysReady.bind(this);
  function onreadystatechange() {
    if(this.readyState == this.DONE) {
      if(this.status == 200 && this.responseText != null) {
        _entrysReady(JSON.parse(this.responseText));
        return
      }
      console.error(this)
    }
  }
  return xmlhttp
};
EntrysLoader.prototype._requestTree = function(url) {
  var xmlhttp = new XMLHttpRequest;
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = onreadystatechange;
  var _knotsReady = this._knotsReady.bind(this);
  function onreadystatechange() {
    if(this.readyState == this.DONE) {
      if(this.status == 200 && this.responseText != null) {
        _knotsReady(JSON.parse(this.responseText));
        return
      }
      console.error(this)
    }
  }
  return xmlhttp
};
var backgroundInterpagesComunicationStorageForDragedItems = {tabsOutlinerDraggedModel:null, "setDragedModel":function(model) {
  this.tabsOutlinerDraggedModel = model
}, "clearDragedModel":function() {
  this.tabsOutlinerDraggedModel = null
}, "getDragedModel":function() {
  return this.tabsOutlinerDraggedModel
}};
function renderTree(treeData, treeBackupFileData, document) {
  window.treeData = treeData;
  document.title = treeData.treeTitle + " (Rev:" + treeData.treeRev + " Time:" + (new Date(treeData.treeUtcTimestamp)).toLocaleString() + ")";
  var timesaved = new Date(treeData.treeUtcTimestamp - timeShift);
  document.title = "Tabs Outliner Backup saved at " + timesaved.toLocaleTimeString() + ", " + timesaved.toLocaleDateString();
  var entrysCdidsListInOrderOfAppearence = [];
  var entrysCdidsToNodesMap = {};
  var treeModel;
  if(treeBackupFileData) {
    var rootNode = restoreTreeFromOperations(treeBackupFileData);
    treeModel = extentToTreeModel([rootNode], dummyTreePersistenceManager);
    showAjaxSpiner(false)
  }else {
    treeModel = buildTreeModel(treeData.beFilled_rootDid, treeData.beFilled_allKnots, entrysCdidsListInOrderOfAppearence, entrysCdidsToNodesMap);
    var entrysLoader = new EntrysLoader(treeModel, treeData.treeId, treeData.userId, entrysCdidsListInOrderOfAppearence, entrysCdidsToNodesMap);
    entrysLoader.requestEntrysByRev(treeData.treeRev)
  }
  var activeSessionTreeScrollableContainer = document.getElementById("ID_activeSessionTreeScrollableContainer");
  var oldTree = document.getElementById("currentSessionRoot");
  if(oldTree) {
    activeSessionTreeScrollableContainer.removeChild(oldTree)
  }
  var lastChildCssFix = document.getElementById("lastChildCssFix");
  if(lastChildCssFix) {
    activeSessionTreeScrollableContainer.removeChild(lastChildCssFix)
  }
  activeSessionTreeScrollableContainer.appendChild(createTreeView(document.defaultView, treeModel, 1, backgroundInterpagesComunicationStorageForDragedItems, 20));
  if(!lastChildCssFix) {
    lastChildCssFix = document.createElement("div");
    lastChildCssFix.id = "lastChildCssFix";
    lastChildCssFix.setAttribute("style", "height:40px;")
  }
  activeSessionTreeScrollableContainer.appendChild(lastChildCssFix);
  prepareDomForSavedAsHtmlMode__()
}
function prepareDomForSavedAsHtmlMode__() {
  document.styleSheets[0].addRule("a:hover", "text-decoration: underline; cursor:pointer;");
  document.styleSheets[0].addRule(".node_text", "cursor: auto;")
}
function replaceChromeFaviconUrls__() {
  var images = document.images;
  for(var i = 0;i < images.length;i++) {
    var imgsrc = images[i].dataset["nodeIconForHtmlExport"] || images[i].src;
    images[i].src = isChromeUrl(imgsrc) ? "img/chrome-window-icon-rgb.png" : imgsrc
  }
}
function isChromeUrl(url) {
  return url.indexOf("chrome:") == 0
}
var timeShift = (new Date).getTimezoneOffset() * (60 * 1E3);
var treeData = {beFilled_rootDid:"none", beFilled_allKnots:"none", userId:"none", treeId:"none", treeRev:"?", treeUtcTimestamp:0, treeTitle:"Tabs Outliner Backup File"};
function ThrotleEvent(action) {
  this.interval = 1E3;
  this.timerId = null;
  this.action = action;
  this.event = null
}
ThrotleEvent.prototype._fireAction = function _fireAction() {
  this.action(this.event);
  this.event = null
};
ThrotleEvent.prototype.eventListener = function eventListener(event) {
  this.event = event;
  clearTimeout(this.timerId);
  this.timerId = setTimeout(ThrotleEvent.prototype._fireAction.bind(this), this.interval)
};
function throtleEvent(action) {
  return ThrotleEvent.prototype.eventListener.bind(new ThrotleEvent(action))
}
function showAjaxSpiner(isVisible) {
  document.getElementById("ajaxSpiner").style.display = isVisible ? "block" : "none"
}
function onRevDateTimeRequest(event) {
  if(!event.target.value) {
    return
  }
  var entrysLoader = new EntrysLoader(null, treeData.treeId, treeData.userId, null, null);
  entrysLoader.requestTreeByTime(Date.parse(event.target.value) + timeShift);
  showAjaxSpiner(true)
}
function onRevClick(event) {
  var requestedRev = event.target.value;
  if(requestedRev == window.treeData.treeRev) {
    return
  }
  var entrysLoader = new EntrysLoader(null, treeData.treeId, treeData.userId, null, null);
  entrysLoader.requestTreeByRev(requestedRev);
  showAjaxSpiner(true)
}
function getUrlParameters() {
  var queryDict = {};
  location.search.substr(1).split("&").forEach(function(item) {
    queryDict[item.split("=")[0]] = item.split("=")[1]
  });
  return queryDict
}
function openTreeFromUrl(downloadUrl, treeData) {
  chrome.identity.getAuthToken({"interactive":true}, function(token) {
    if(token) {
      ajax(downloadUrl, token, updateProgress).then(JSON.parse).then(function(backupDataJson) {
        renderTree(treeData, backupDataJson, document);
        chrome.extension.getBackgroundPage().ga_event_backup_view("Backup View Tree Successfully Rendered")
      }).catch(function(error) {
        console.error(error);
        if(error instanceof AuthorizationError) {
          rewokeToken();
          alert("Authorization Error. Please reload this page and Authorize Google Drive Access in Authorize dialog which will appear.");
          chrome.extension.getBackgroundPage().ga_event_backup_view("Backup View Error", "Gdrive Authorization Error")
        }else {
          if(error instanceof SyntaxError) {
            alert("Error: Tree Data has invalid format.");
            chrome.extension.getBackgroundPage().ga_event_backup_view("Backup View Error", "Data In Invalid Format")
          }else {
            alert(error.toString());
            chrome.extension.getBackgroundPage().ga_event_backup_view("Backup View Error", error.toString())
          }
        }
      })
    }else {
      console.error("Auth token undefined. chrome.runtime.lastError:", chrome.runtime.lastError);
      alert("Error: " + chrome.runtime.lastError.message);
      rewokeToken();
      chrome.extension.getBackgroundPage().ga_event_backup_view("Backup View Error", "No Auth Token")
    }
  })
}
function rewokeToken() {
  chrome.extension.getBackgroundPage().authTokenInvalidOrAbsent_dropAndNotifyAllOpenedViews()
}
function updateProgress(oEvent) {
  if(oEvent.lengthComputable) {
    var percentComplete = 100 * (oEvent.loaded / oEvent.total);
    document.getElementById("ajaxSpinerPercentComplete").innerText = Math.floor(percentComplete) + "%"
  }else {
    if(fileSize) {
      var percentComplete = 100 * (oEvent.loaded / fileSize);
      document.getElementById("ajaxSpinerPercentComplete").innerText = Math.floor(percentComplete) + "%"
    }
  }
}
function getJSON(url) {
  return ajax(url).then(JSON.parse)
}
function AuthorizationError() {
  this.name = "AuthorizationError";
  this.message = "Authorization Error"
}
AuthorizationError.prototype = Object.create(Error.prototype);
AuthorizationError.prototype.constructor = AuthorizationError;
var Promise = Promise || function() {
  alert("Error:Promises is not supported")
};
function ajax(url, authToken, progresseventhandler) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization", "Bearer " + authToken);
    xhr.addEventListener("progress", progresseventhandler, false);
    xhr.onload = function() {
      if(xhr.status == 200) {
        resolve(xhr.response)
      }
      if(xhr.status == 401) {
        reject(new AuthorizationError)
      }
      if(xhr.status == 403) {
        reject(Error("403 Access Denied (invalid URL)"))
      }
      if(xhr.status == 404) {
        reject(Error("404 No Such File On Server"))
      }else {
        reject(Error("Server respond with Error. status:" + xhr.status + "; statusText:" + xhr.statusText))
      }
    };
    xhr.onerror = function() {
      reject(Error("A network error occurred, and the download could not be completed. Check you Internet connection."))
    };
    xhr.send()
  })
}
function openTreeFromFilesystem(path, treeData) {
  chrome.extension.getBackgroundPage().readSessionDataFromFile(path, function(backupData) {
    renderTree(treeData, backupData, document)
  })
}
function openTreeFromUserInput(treeData) {
  chrome.extension.getBackgroundPage().readSessionDataFromUserSelectedFile(function(backupData) {
    renderTree(treeData, backupData, document)
  })
}
var queryDict = getUrlParameters();
var path = decodeURIComponent(queryDict.path);
var fileSize = Number(queryDict.fileSize);
treeData.treeUtcTimestamp = parseInt(queryDict.timestamp) + timeShift;
if(path) {
  if(queryDict.isLocal != "true") {
    openTreeFromUrl(path, treeData)
  }else {
    if(queryDict.isUserSelectedFile == "true") {
      openTreeFromUserInput(treeData)
    }else {
      openTreeFromFilesystem(path, treeData)
    }
  }
}
setTimeout(function() {
  addEventListener("scroll", loadVisibleIcons, false);
  addEventListener("resize", loadVisibleIcons, false);
  loadVisibleIcons()
}, 1500);
var favIconSourceDatasetName = window.location.href.indexOf("activesessionview.html") < 0 ? "nodeIconForHtmlExport" : "iconSrcDefferedLoad";
function loadVisibleIcons() {
  var visibleFavicons = getVisibleFavicons();
  var requestedCount = 0;
  for(var i = 0;i < visibleFavicons.length;i++) {
    var visibleFavicon = visibleFavicons[i];
    var imgsrc = visibleFavicon.dataset[favIconSourceDatasetName];
    if(imgsrc && visibleFavicon.src != imgsrc) {
      visibleFavicon.src = imgsrc;
      requestedCount++
    }
  }
}
var lastVisibleImageIndex = -1;
function getVisibleFavicons() {
  var images = document.images;
  var visibleImages = [];
  var i;
  var maxIndex = images.length - 1;
  if(maxIndex < 0) {
    return[]
  }
  if(lastVisibleImageIndex < 0 || lastVisibleImageIndex >= images.length) {
    lastVisibleImageIndex = maxIndex >> 1
  }
  var beg_index_end = [0, lastVisibleImageIndex, maxIndex];
  var preventHalt = 32;
  while(--preventHalt > 0) {
    i = beg_index_end[1];
    beg_index_end = getNextSearchIntervalForVisibleElement(images[i], beg_index_end);
    if(!beg_index_end) {
      break
    }
  }
  for(var up = i;up >= 0;up--) {
    if(!isElementVerticalProjectionInViewport(images[up])) {
      break
    }else {
      visibleImages.push(images[up])
    }
  }
  for(var dn = i + 1;dn < images.length;dn++) {
    if(!isElementVerticalProjectionInViewport(images[dn])) {
      break
    }else {
      visibleImages.push(images[dn])
    }
  }
  lastVisibleImageIndex = up + (dn - up >> 2);
  for(var up2 = up;up2 >= 0 && up - up2 <= 20;up2--) {
    visibleImages.push(images[up2])
  }
  for(var dn2 = dn;dn2 < images.length && dn2 - dn <= 20;dn2++) {
    visibleImages.push(images[dn2])
  }
  return visibleImages
}
function isElementVerticalProjectionInViewport(el) {
  if(!el) {
    return false
  }
  var rect = el.getBoundingClientRect();
  var elHeight = rect.bottom - rect.top;
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= 0 - elHeight && rect.bottom <= viewportHeight + elHeight
}
function getNextSearchIntervalForVisibleElement(el, beg_index_end) {
  var beg = beg_index_end[0];
  var index = beg_index_end[1];
  var end = beg_index_end[2];
  var rect = el.getBoundingClientRect();
  var elHeight = rect.bottom - rect.top;
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  if(rect.bottom < 0 - elHeight) {
    return[index, index + (end - index >> 1), end]
  }
  if(rect.top > viewportHeight + elHeight) {
    return[beg, beg + (index - beg >> 1), index]
  }
  return null
}
;
