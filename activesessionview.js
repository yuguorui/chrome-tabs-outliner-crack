// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var VIEW_selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick = "__a";
window[VIEW_selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick] = selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick;
var actionLinksBtnsIds = ["newWindowActionLink", "newTextNodeActionLink", "newGroupNodeActionLink", "newSeparatorNodeActionLink", "newGoogleDocNodeActionLink"];
actionLinksBtnsIds.forEach(function(btnId) {
  var btn = document.getElementById(btnId);
  btn.addEventListener("click", actionLink_onclick);
  btn.addEventListener("dragstart", actionLink_ondragstart_fillDragedModelStorage)
});
document.getElementById("cloneViewButton").addEventListener("click", cloneView);
document.getElementById("undoScrollButton").addEventListener("click", undoScroll);
document.getElementById("nextOpenWindowButton").addEventListener("click", scrollUpToNextOpenWindow);
document.getElementById("savecloseAllWindowsButton").addEventListener("click", closeAllOpenWindows);
document.getElementById("expandAllButton").addEventListener("click", expandAll);
document.getElementById("undoExpandAllButton").addEventListener("click", undoExpandAll);
document.getElementById("backupNowButton").addEventListener("click", backupNow);
document.getElementById("infoButton").addEventListener("click", onInfoClick);
document.getElementById("helpButton").addEventListener("click", onHelpClick);
document.getElementById("settingsButton").addEventListener("click", onOptionsClick);
window.isAutoscrollView = false;
var activeSessionTreeScrollableContainer = null;
var treeView;
var performOperationOnLoadComplete = null;
var scrollToLastNodeCompensator = document.createElement("div");
scrollToLastNodeCompensator.id = "scrollToLastNodeCompensator";
var winNodePlusOneTabNodeHeight = 46;
var preventResizeOnEveryEvent_resizeTimeout = 200;
var preventResizeOnEveryEvent_resizeTimeoutId;
function Global_onResize_UpdateScrollToLastNodeCompensator(event) {
  clearTimeout(preventResizeOnEveryEvent_resizeTimeoutId);
  preventResizeOnEveryEvent_resizeTimeoutId = setTimeout(enablePossibilityToScrollLastWindowTitleToFirstVisibleLine, preventResizeOnEveryEvent_resizeTimeout)
}
function enablePossibilityToScrollLastWindowTitleToFirstVisibleLine() {
  var h = window.innerHeight;
  scrollToLastNodeCompensator.style.height = h - winNodePlusOneTabNodeHeight + "px"
}
enablePossibilityToScrollLastWindowTitleToFirstVisibleLine();
window.addEventListener("resize", Global_onResize_UpdateScrollToLastNodeCompensator);
function selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick(focusTabId, altFocusNodeId, scrollToVieWinId) {
  if(!treeView) {
    return
  }
  enablePossibilityToScrollLastWindowTitleToFirstVisibleLine();
  var windowNode = treeView.treeModel.findActiveWindow(scrollToVieWinId);
  if(windowNode) {
    windowNode.requestScrollNodeToViewInAutoscrolledViews()
  }
  var tabNode = treeView.treeModel.findActiveTab(focusTabId);
  if(tabNode) {
    tabNode.setCursorHereOrToFirstCollapsedParent(treeView)
  }else {
    if(windowNode) {
      windowNode.setCursorHereOrToFirstCollapsedParent(treeView)
    }
  }
}
function scrollToDefaultPageOffestForClonedViewsOnInitialOpen(sourceViewPageYOffset) {
  if(!treeView) {
    return
  }
  enablePossibilityToScrollLastWindowTitleToFirstVisibleLine();
  undoScroll_memorizePageOffset(sourceViewPageYOffset);
  window.scrollTo(0, window.document.documentElement.scrollHeight - window.innerHeight - scrollToLastNodeCompensator.offsetHeight + document.getElementById("mainToolbarAndMessagesContainer").offsetHeight)
}
window.document.addEventListener("selectstart", preventSelection);
function preventSelection(e) {
  e.preventDefault();
  return false
}
window.addEventListener("scroll", undoHorizontalScroling);
function undoHorizontalScroling(e) {
  if(window.pageXOffset != 0) {
    window.scrollTo(0, window.pageYOffset)
  }
}
function cloneView() {
  window.chrome.extension.getBackgroundPage().cloneTabsOutlinerView(window.outerWidth, window.screenX, window.pageYOffset)
}
window.addEventListener("scroll", undoScroll_onScroll_pageOffsetsMemorizerScheduler);
window.addEventListener("before_scroll_node_to_view", undoScroll_memorizeCurrentPageOffset);
var undoScroll_pageOffsetStableTimeoutToMemorizeIt = 1E3;
var undoScroll_pageOffsetsMemorizerId;
var undoScroll_memorizerEnabled = true;
var undoScroll_memorizedOffsets = [];
function undoScroll_onScroll_pageOffsetsMemorizerScheduler(e) {
  clearTimeout(undoScroll_pageOffsetsMemorizerId);
  undoScroll_pageOffsetsMemorizerId = setTimeout(undoScroll_memorizeCurrentPageOffset, undoScroll_pageOffsetStableTimeoutToMemorizeIt)
}
function undoScroll_memorizeCurrentPageOffset() {
  if(undoScroll_memorizerEnabled) {
    undoScroll_memorizePageOffset(window.pageYOffset)
  }
}
function undoScroll_memorizePageOffset(pageYOffsetToMemorize) {
  if(undoScroll_memorizedOffsets.length > 0 && undoScroll_memorizedOffsets[undoScroll_memorizedOffsets.length - 1] == pageYOffsetToMemorize) {
    return
  }
  undoScroll_memorizedOffsets.push(pageYOffsetToMemorize);
  if(pageYOffsetToMemorize != undoScroll_memorizedOffsets_undoSequenceCopy_lastUndoValue) {
    undoScroll_memorizedOffsets_undoSequenceCopy = null
  }
}
var undoScroll_memorizedOffsets_undoSequenceCopy = null;
var undoScroll_memorizedOffsets_undoSequenceCopy_lastUndoValue = 0;
function undoScroll() {
  if(!undoScroll_memorizedOffsets_undoSequenceCopy) {
    undoScroll_memorizedOffsets_undoSequenceCopy = undoScroll_memorizedOffsets.slice()
  }
  do {
    var pageOffset = undoScroll_memorizedOffsets_undoSequenceCopy.pop()
  }while(pageOffset && pageOffset == window.pageYOffset);
  if(pageOffset) {
    window.scrollTo(0, undoScroll_memorizedOffsets_undoSequenceCopy_lastUndoValue = pageOffset)
  }
}
function expandBtnsAnimationEnd_ClearStyles() {
  document.getElementById("expandAllButton").removeEventListener("webkitAnimationEnd", expandBtnsAnimationEnd_ClearStyles);
  document.getElementById("undoExpandAllButton").removeEventListener("webkitAnimationEnd", expandBtnsAnimationEnd_ClearStyles);
  document.getElementById("expandAllButton").classList.remove("flipIn");
  document.getElementById("undoExpandAllButton").classList.remove("flipIn");
  document.getElementById("expandAllButton").classList.remove("flipOut");
  document.getElementById("undoExpandAllButton").classList.remove("flipOut");
  document.getElementById("expandAllButton").classList.remove("face");
  document.getElementById("undoExpandAllButton").classList.remove("face");
  document.getElementById("expandAllButton").classList.remove("face");
  document.getElementById("undoExpandAllButton").classList.remove("face")
}
function flitToUndoAnimationEnd_performExpand() {
  document.getElementById("undoExpandAllButton").removeEventListener("webkitAnimationEnd", flitToUndoAnimationEnd_performExpand);
  expandAllNodesInTreeModel()
}
function flitToNormalAnimationEnd_performUndoExpand() {
  document.getElementById("expandAllButton").removeEventListener("webkitAnimationEnd", flitToNormalAnimationEnd_performUndoExpand);
  undoExpandAllNodesInTreeModel()
}
function expandAllBtnAnimationEnd_flitToUndo() {
  document.getElementById("expandAllButton").removeEventListener("webkitAnimationEnd", expandAllBtnAnimationEnd_flitToUndo);
  document.getElementById("expandAllButton").classList.add("hidden");
  document.getElementById("undoExpandAllButton").classList.remove("hidden");
  document.getElementById("undoExpandAllButton").addEventListener("webkitAnimationEnd", expandBtnsAnimationEnd_ClearStyles);
  document.getElementById("undoExpandAllButton").addEventListener("webkitAnimationEnd", flitToUndoAnimationEnd_performExpand);
  document.getElementById("undoExpandAllButton").classList.add("flipIn")
}
function undoExpandAllButtonEnd_flipToNormal() {
  document.getElementById("undoExpandAllButton").removeEventListener("webkitAnimationEnd", undoExpandAllButtonEnd_flipToNormal);
  document.getElementById("expandAllButton").classList.remove("hidden");
  document.getElementById("undoExpandAllButton").classList.add("hidden");
  document.getElementById("expandAllButton").addEventListener("webkitAnimationEnd", expandBtnsAnimationEnd_ClearStyles);
  document.getElementById("expandAllButton").addEventListener("webkitAnimationEnd", flitToNormalAnimationEnd_performUndoExpand);
  document.getElementById("expandAllButton").classList.add("flipIn")
}
function expandAll() {
  document.getElementById("expandAllButton").addEventListener("webkitAnimationEnd", expandAllBtnAnimationEnd_flitToUndo);
  document.getElementById("expandAllButton").classList.add("face");
  document.getElementById("expandAllButton").classList.add("flipOut")
}
function undoExpandAll() {
  document.getElementById("undoExpandAllButton").addEventListener("webkitAnimationEnd", undoExpandAllButtonEnd_flipToNormal);
  document.getElementById("undoExpandAllButton").classList.add("face");
  document.getElementById("undoExpandAllButton").classList.add("flipOut")
}
var undoExpandAllNodesList = null;
function expandAllNodesInTreeModel() {
  undoExpandAllNodesList = treeView.treeModel.getAllCollapsedNodes();
  undoExpandAllNodesList.forEach(function(node) {
    node.setCollapsing(false)
  })
}
function undoExpandAllNodesInTreeModel() {
  if(!undoExpandAllNodesList) {
    return
  }
  undoExpandAllNodesList.forEach(function(node) {
    node.setCollapsing(true)
  });
  undoExpandAllNodesList = null
}
function closeAllOpenWindows() {
  if(confirm("Confirm close all open windows. \n\nClosed windows will be preserved in the tree as saved.")) {
    window.chrome.windows.getCurrent({"populate":false}, function(ourChromeWindowObj) {
      chrome.extension.getBackgroundPage().closeAllWindowsExceptThis(ourChromeWindowObj.id)
    })
  }
}
function scrollUpToNextOpenWindow() {
  var isAutoscrollView_originalValue = window.isAutoscrollView;
  window.isAutoscrollView = true;
  var pageYOffset_originalValue = window.pageYOffset;
  var allOpenWindows = treeView.treeModel.getListOfAllActiveWindowNodes();
  undoScroll_memorizerEnabled = false;
  for(var j = allOpenWindows.length - 1;j >= 0;j--) {
    allOpenWindows[j].requestScrollNodeToViewInAutoscrolledViews();
    if(window.pageYOffset < pageYOffset_originalValue) {
      break
    }
  }
  undoScroll_memorizerEnabled = true;
  undoScroll_memorizeCurrentPageOffset();
  allOpenWindows = null;
  window.isAutoscrollView = isAutoscrollView_originalValue
}
function actionLink_ondragstart_fillDragedModelStorage(event) {
  var actionLinkModelConstructor = treeView.treeModel[event.srcElement.dataset["fabric"]];
  treeView.dragedModelStorage.setDragedModel(actionLinkModelConstructor());
  return true
}
function actionLink_onclick(event) {
  actionLink_ondragstart_fillDragedModelStorage(event);
  var dropTarget = {"container":treeView.treeModel[0], "position":-1};
  treeView.performDrop(dropTarget, false);
  scrollTolastNodeInTreeAfterActionLinkInserted();
  return true
}
function scrollTolastNodeInTreeAfterActionLinkInserted() {
  treeView.treeModel[0].subnodes[treeView.treeModel[0].subnodes.length - 1].requestScrollNodeToViewInAutoscrolledViews()
}
function onInfoClick() {
  focusTabIfAliveCreateAsPopUpIfAbsent(chrome.extension.getURL("about.html"), function() {
    window.open("about.html", "_blank", "height=1000,width=920, left=350, top=50")
  })
}
function onOptionsClick() {
  focusTabIfAliveCreateAsPopUpIfAbsent(chrome.extension.getURL("options.html"), function() {
    window.open("options.html", "_blank", "height=850,width=900, left=200, top=200")
  })
}
function focusTabIfAliveCreateAsPopUpIfAbsent(url, createMethod) {
  window.chrome.windows.getAll({"populate":true}, function(windowsList) {
    var neededtab;
    windowsList.forEach(function(chromeWindowObj) {
      chromeWindowObj.tabs.forEach(function(chromeTabObj) {
        if(chromeTabObj.url.indexOf(url) == 0) {
          neededtab = chromeTabObj
        }
      })
    });
    if(neededtab) {
      chrome.extension.getBackgroundPage().focusTab(neededtab.windowId, neededtab.id)
    }else {
      createMethod()
    }
  })
}
document.getElementById("mainToolbar").addEventListener("mouseover", maintoolbarFocusHack_onMouseOver);
document.getElementById("mainToolbar").addEventListener("mouseout", maintoolbarFocusHack_onMouseOut);
var elementFocusedWhenMainToolbarHovered = null;
function isAChildOf(_parent, _child) {
  var testElement = _child;
  while(testElement) {
    if(testElement === _parent) {
      return true
    }
    testElement = testElement.parentNode
  }
  return false
}
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value
  });
  return vars
}
function maintoolbarFocusHack_onMouseOver(event) {
  if(!isAChildOf(this, event.relatedTarget)) {
    maintoolbarFocusHack_onMouseEnter()
  }
}
function maintoolbarFocusHack_onMouseOut(event) {
  if(!isAChildOf(this, event.relatedTarget)) {
    maintoolbarFocusHack_onMouseLeave()
  }
}
function maintoolbarFocusHack_onMouseEnter() {
  elementFocusedWhenMainToolbarHovered = document.activeElement;
  document.activeElement.blur()
}
function maintoolbarFocusHack_onMouseLeave() {
  undoScroll_memorizerEnabled = false;
  var currentScrollPos = window.pageYOffset;
  elementFocusedWhenMainToolbarHovered.focus();
  window.scrollTo(0, currentScrollPos);
  undoScroll_memorizerEnabled = true;
  elementFocusedWhenMainToolbarHovered = null
}
function getTreeModel() {
  if(window.chrome && window.chrome.extension) {
    return window.chrome.extension.getBackgroundPage().getActiveSessionTreeModel()
  }else {
  }
}
console.time("SessionView TreeGenerationTime");
if(window.chrome && window.chrome.extension) {
  treeView = new TreeView(window, getTreeModel(), 1, window.chrome.extension.getBackgroundPage().backgroundInterpagesComunicationStorageForDragedItems, document.getElementById("mainToolbar").offsetHeight, true);
  activeSessionTreeScrollableContainer = document.getElementById("ID_activeSessionTreeScrollableContainer");
  activeSessionTreeScrollableContainer.appendChild(treeView.currentSessionRowDom);
  activeSessionTreeScrollableContainer.appendChild(scrollToLastNodeCompensator);
  loadAllDefferedIcons(70);
  applyCustomUserStyles();
  window.addEventListener("keydown", window_onkeydown, false);
  window.addEventListener("actionCommand", window_onActionCommand, false)
}else {
  document.addEventListener("DOMContentLoaded", prepareDomForSavedAsHtmlMode)
}
function actionPrint() {
  setTimeout(function() {
    window.print()
  }, 1)
}
function requestClipboardPermissions(callback) {
  chrome.permissions.request({permissions:["clipboardRead", "clipboardWrite"], origins:[]}, callback)
}
function execCommand_cut() {
  document.execCommand("cut")
}
function execCommand_copy() {
  document.execCommand("copy")
}
function execCommand_paste() {
  document.execCommand("paste")
}
function ifLite_goPro(skipNagScreen) {
  return false;
  // if(!!window["isKeysAndcontextMenuActionsEnabled"]) {
  //   return false
  // }else {
  //   if(!skipNagScreen) {
  //     activateProFeatureUsageInLiteModeDialog(null, null, onOptionsClick)
  //   }
  //   return true
  // }
}
function window_onActionCommand(event) {
  // if(ifLite_goPro()) {
  //   return
  // }
  var action = event["detail"]["action"];
  switch(action) {
    case "actionCut":
      requestClipboardPermissions(execCommand_cut);
      break;
    case "actionCopy":
      requestClipboardPermissions(execCommand_copy);
      break;
    case "actionPaste":
      requestClipboardPermissions(execCommand_paste);
      break;
    case "actionCollapseExpand":
      treeView.togleCollapsedStateOfCursoredNode();
      break;
    case "actionEdit":
      treeView.editCurrentNodeNote();
      break;
    case "actionSaveClose":
      treeView.saveCloseCurrentNode();
      break;
    case "actionDelete":
      treeView.deleteCurrentNode();
      break;
    case "actionRestore":
      treeView.activateCurrentNode(false);
      break;
    case "actionAltRestore":
      treeView.activateCurrentNode(true);
      break;
    case "actionInsNoteAsParent":
      treeView.addNoteAsParentOfCurrentNode();
      break;
    case "actionInsNoteAsFirstSubnode":
      treeView.addNoteAsFirstSubnodeOfCurrentNode();
      break;
    case "actionInsNoteAsLastSubnode":
      treeView.addNoteAsLastSubnodeOfCurrentNode();
      break;
    case "actionAddNoteAbove":
      treeView.addNoteAsPrevSiblingOfCurrentNode();
      break;
    case "actionAddNoteBelove":
      treeView.addNoteAsNextSiblingOfCurrentNode();
      break;
    case "actionAddNoteAtTheEndOfTree":
      treeView.addNoteAtTheEndOfTree();
      break;
    case "actionAddGroupAbove":
      treeView.actionAddGroupAbove();
      break;
    case "actionAddSeparatorBelove":
      treeView.actionAddSeparatorBelove();
      break;
    case "actionMoveRight":
      treeView.moveCurrentNode_levelUp();
      break;
    case "actionMoveLeft":
      treeView.moveCurrentNode_levelDown();
      break;
    case "actionMoveUp":
      treeView.moveCurrentNode_up();
      break;
    case "actionMoveDown":
      treeView.moveCurrentNode_down();
      break;
    case "actionMoveHome":
      treeView.moveCurrentNode_asFirstSiblingInSameLevel();
      break;
    case "actionMoveEnd":
      treeView.moveCurrentNode_asLastSiblingInSameLevel();
      break;
    case "actionFlattenTabsHierarchy":
      treeView.actionFlattenTabsHierarchy();
      break;
    case "actionMoveWindowToTheEndOfTree":
      treeView.actionMoveWindowToTheEndOfTree();
      break;
    case "actionOpenLinkInNewWindow":
      treeView.actionOpenLinkInNewWindow();
      break;
    case "actionOpenLinkInNewTab":
      treeView.actionOpenLinkInNewTab();
      break;
    case "actionPrint":
      actionPrint();
      break
  }
}
function window_onkeydown(event) {
  if(treeView.isModalUiElementsActive(event)) {
    return
  }
  switch(event.keyCode) {
    case 107:
    ;
    case 187:
    ;
    case 109:
    ;
    case 189:
      if(!event.ctrlKey && !event.metaKey) {
        treeView.togleCollapsedStateOfCursoredNode();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 33:
      treeView.moveCursor_pageUp();
      event.preventDefault();
      event.stopPropagation();
      break;
    case 34:
      treeView.moveCursor_pageDown();
      event.preventDefault();
      event.stopPropagation();
      break;
    case 36:
      if(event.ctrlKey) {
        ifLite_goPro() || treeView.moveCurrentNode_asFirstSiblingInSameLevel()
      }else {
        ifLite_goPro() || treeView.moveCursor_toFirstSiblingInSameLevel()
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 35:
      if(event.ctrlKey) {
        ifLite_goPro() || treeView.moveCurrentNode_asLastSiblingInSameLevel()
      }else {
        ifLite_goPro() || treeView.moveCursor_toLastSiblingInSameLevel()
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 37:
      if(event.ctrlKey) {
        ifLite_goPro() || treeView.moveCurrentNode_levelDown()
      }else {
        ifLite_goPro() || treeView.moveCursor_toParent_butNotToRoot()
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 39:
      if(event.ctrlKey) {
        ifLite_goPro() || treeView.moveCurrentNode_levelUp()
      }else {
        ifLite_goPro() || treeView.moveCursor_toFirstSubnode()
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 38:
      if(event.ctrlKey) {
        ifLite_goPro() || treeView.moveCurrentNode_up()
      }else {
        treeView.moveCursor_up(event.altKey)
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 40:
      if(event.ctrlKey) {
        ifLite_goPro() || treeView.moveCurrentNode_down()
      }else {
        treeView.moveCursor_down(event.altKey)
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 9:
      if(event.shiftKey) {
        ifLite_goPro() || treeView.moveCurrentNode_levelDown()
      }else {
        ifLite_goPro() || treeView.moveCurrentNode_levelUp()
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 32:
      ifLite_goPro() || treeView.activateCurrentNode(event.altKey);
      event.preventDefault();
      event.stopPropagation();
      break;
    case 13:
      if(event.shiftKey && (event.altKey || event.ctrlKey)) {
        ifLite_goPro() || treeView.addNoteAsParentOfCurrentNode()
      }else {
        if(event.altKey || event.ctrlKey) {
          ifLite_goPro() || treeView.addNoteAtTheEndOfTree()
        }else {
          if(event.shiftKey) {
            ifLite_goPro() || treeView.addNoteAsPrevSiblingOfCurrentNode()
          }else {
            ifLite_goPro() || treeView.addNoteAsNextSiblingOfCurrentNode()
          }
        }
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 45:
      if(event.shiftKey) {
        ifLite_goPro() || treeView.addNoteAsParentOfCurrentNode()
      }else {
        if(event.altKey || event.ctrlKey) {
          ifLite_goPro() || treeView.addNoteAsFirstSubnodeOfCurrentNode()
        }else {
          ifLite_goPro() || treeView.addNoteAsLastSubnodeOfCurrentNode()
        }
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 113:
      ifLite_goPro() || treeView.editCurrentNodeNote();
      event.preventDefault();
      event.stopImmediatePropagation();
      break;
    case 8:
      ifLite_goPro() || treeView.saveCloseCurrentNode();
      event.preventDefault();
      event.stopPropagation();
      break;
    case 46:
      if(event.altKey) {
        ifLite_goPro() || treeView.saveCloseCurrentNode()
      }else {
        ifLite_goPro() || treeView.deleteCurrentNode()
      }
      event.preventDefault();
      event.stopPropagation();
      break;
    case 191:
      ifLite_goPro() || treeView.actionFlattenTabsHierarchy();
      event.preventDefault();
      event.stopPropagation();
      break;
    case 69:
      ifLite_goPro() || treeView.actionMoveWindowToTheEndOfTree();
      event.preventDefault();
      event.stopPropagation();
      break;
    case 87:
      if(!event.altKey && (!event.ctrlKey && !event.metaKey)) {
        ifLite_goPro() || scrollUpToNextOpenWindow();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 83:
      if(!event.ctrlKey && !event.metaKey) {
        ifLite_goPro() || undoScroll();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 67:
      if(!event.ctrlKey && !event.metaKey) {
        ifLite_goPro() || cloneView();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 81:
      if(!event.ctrlKey && !event.metaKey) {
        ifLite_goPro() || closeAllOpenWindows();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 80:
      if(event.ctrlKey || event.metaKey) {
        actionPrint();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 66:
      if(event.ctrlKey) {
        ifLite_goPro() || backupNow();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 71:
      if(event.shiftKey) {
        ifLite_goPro() || treeView.actionAddGroupAbove();
        event.preventDefault();
        event.stopPropagation()
      }
      break;
    case 76:
      ifLite_goPro() || treeView.actionAddSeparatorBelove();
      event.preventDefault();
      event.stopPropagation();
      break;
    default:
      break
  }
}
function getEmptyCustomStyleshit() {
  var customStyleshitId = "usersCustomColorsStyleshit";
  var alreadyPlacedCustomStyleshit = document.getElementById(customStyleshitId);
  if(alreadyPlacedCustomStyleshit) {
    alreadyPlacedCustomStyleshit.parentNode.removeChild(alreadyPlacedCustomStyleshit)
  }
  var styleshit = document.createElement("style");
  styleshit.id = customStyleshitId;
  styleshit.appendChild(document.createTextNode(""));
  document.head.appendChild(styleshit);
  return styleshit.sheet
}
function applyCustomUserStyles() {
  var styleshit = getEmptyCustomStyleshit();
  if(localStorage["experimentalLightBackground"]) {
    styleshit.addRule("#ID_activeSessionTreeScrollableContainer", "background-image: url(tree/img/backgrounds/wavecut.png);");
    styleshit.addRule("::-webkit-scrollbar-track", "background-image: url(tree/img/backgrounds/wavecut.png);");
    styleshit.addRule(".tabNTC", "color: black;");
    styleshit.addRule(".collapsedNodesInfo", "color: black;");
    styleshit.addRule(".textnote_text", "color: #009C6A;");
    styleshit.addRule(".tab_comment", "color: #009C6A;")
  }
  if(localStorage["overrideSavedTabColor"]) {
    styleshit.addRule(".savedtab_text", "color: " + localStorage["savedTabTextColor"] + ";")
  }
  if(localStorage["overrideOpenTabColor"]) {
    styleshit.addRule(".tabNTC", "color: " + localStorage["openTabTextColor"] + ";")
  }
  if(localStorage["overrideCurrentTabColor"]) {
    styleshit.addRule(".selectedtab.tabNTC", "color: " + localStorage["currentTabTextColor"] + ";")
  }
  if(localStorage["overrideNoteTextColor"]) {
    styleshit.addRule(".textnote_text", "color: " + localStorage["noteTextColor"] + ";");
    styleshit.addRule(".tab_comment", "color: " + localStorage["noteTextColor"] + ";")
  }
}
function prepareDomForSavedAsHtmlMode() {
  document.title = "Tabs Outliner Window Saved As Html File";
  document.getElementById("mainToolbar").style.display = "none";
  document.styleSheets[0].addRule("a:hover", "text-decoration: underline; cursor:pointer;");
  document.styleSheets[0].addRule(".node_text", "cursor: auto;");
  makeAllElementsDragable();
  replaceChromeFaviconUrls()
}
window.onbeforeunload = function(e) {
  if(getUrlVars()["type"] == "main") {
    localStorage["MainViewLastClosedPos"] = JSON.stringify({"x":window.screenX, "y":window.screenY, "w":window.outerWidth, "h":window.outerHeight, "iw":window.innerWidth, "ih":window.innerHeight})
  }
  treeView.treeModel.saveNowOnViewClose()
};
window.onunload = function() {
  elementFocusedWhenMainToolbarHovered = null;
  performOperationOnLoadComplete = null;
  treeView.treeModel.deleteDeadObservers(window.document, treeView);
  treeView.deleteAllMembers(window);
  treeView = null;
  window.document.body.innerHTML = "";
  while(activeSessionTreeScrollableContainer.hasChildNodes()) {
    activeSessionTreeScrollableContainer.removeChild(activeSessionTreeScrollableContainer.lastChild)
  }
  activeSessionTreeScrollableContainer = null;
  scrollToLastNodeCompensator = null;
  window.onload = null;
  window.onbeforeunload = null;
  window.onunload = null;
  window.removeEventListener("resize", Global_onResize_UpdateScrollToLastNodeCompensator);
  undoExpandAllNodesList = null;
  localStorage["MainViewLastClosedTime"] = Date.now()
};
function doScrollAndSetIsAutoscrollViewOnReadyAndShowHelpBlock() {
  var urlVars = getUrlVars();
  if(urlVars["type"] == "clone") {
    scrollToDefaultPageOffestForClonedViewsOnInitialOpen(parseInt(urlVars["yo"]));
    var lastChildOfRoot = treeView.treeModel[0].subnodes[treeView.treeModel[0].subnodes.length - 1];
    lastChildOfRoot.setCursorHereOrToFirstCollapsedParent(treeView)
  }
  if(urlVars["type"] == "main") {
    window.isAutoscrollView = true;
    selectTreeNodePlusScrollToNodeOnBrowserActionBtnClick(urlVars["focusNodeId"], urlVars["altFocusNodeId"], urlVars["scrollToViewWinId"]);
    if(!localStorage["doNotShowHelpBlockOnStartV2"]) {
      showHelpBlock(false)
    }
  }
}
console.timeEnd("SessionView TreeGenerationTime");
window.onload = onLoad;
function onLoad() {
  window.onload = null;
  doScrollAndSetIsAutoscrollViewOnReadyAndShowHelpBlock()
}
var HELP_BLOCK_ELEMENT_ID = "helpBlock";
function createHelpBlock() {
  var r = document.createElement("div");
  r.id = HELP_BLOCK_ELEMENT_ID;
  r.innerHTML = window["helpBlockHtmlContent"];
  return r
}
function onChange_doNotShowHelpBlockOnStartV2() {
  if(this.checked) {
    localStorage["doNotShowHelpBlockOnStartV2"] = "true"
  }else {
    delete localStorage["doNotShowHelpBlockOnStartV2"]
  }
}
function hideHelpBlock() {
  var helpBlock = document.getElementById(HELP_BLOCK_ELEMENT_ID);
  if(helpBlock) {
    helpBlock.parentElement.removeChild(helpBlock)
  }
}
window["hideHelpBlock"] = hideHelpBlock;
function showHelpBlock(scrollIntoView) {
  var helpBlock = document.getElementById(HELP_BLOCK_ELEMENT_ID);
  if(!helpBlock) {
    helpBlock = createHelpBlock();
    activeSessionTreeScrollableContainer.insertBefore(helpBlock, scrollToLastNodeCompensator)
  }
  document.getElementById("doNotShowHelpBlockOnStartV2").checked = !!localStorage["doNotShowHelpBlockOnStartV2"];
  document.getElementById("printFriendlyBtn").onclick = onPrintClick;
  document.getElementById("hideHelpBtn").onclick = hideHelpBlock;
  document.getElementById("doNotShowHelpBlockOnStartV2").onchange = onChange_doNotShowHelpBlockOnStartV2;
  var colapsibleBlocks = helpBlock.getElementsByClassName("toggleHlpBlock");
  for(var i = 0;i < colapsibleBlocks.length;++i) {
    var elem = colapsibleBlocks[i];
    elem.onclick = onclick_toggleHlpBlock
  }
  if(scrollIntoView) {
    helpBlock.scrollIntoView();
    window.scrollTo(0, window.pageYOffset - 120)
  }
}
function onHelpClick() {
  showHelpBlock(true)
}
window["onPrintClick"] = function() {
  var helpWindow = window.open("help.html", "_blank", "height=1000,width=800, left=300, top=0");
  helpWindow.onload = onHelpWindowLoaded
};
function onHelpWindowLoaded() {
  var helpBlock = createHelpBlock();
  this.document.body.appendChild(helpBlock);
  var imges = this.document.querySelectorAll("img");
  var img = imges[imges.length - 1];
  function loaded(event) {
    event.target.ownerDocument.defaultView.print()
  }
  if(img.complete) {
    loaded()
  }else {
    img.addEventListener("load", loaded);
    img.addEventListener("error", loaded)
  }
}
function onclick_toggleHlpBlock() {
  var controlelement = this;
  var bodyelement = document.getElementById(controlelement.id + "-body");
  if(bodyelement.offsetHeight == 0) {
    bodyelement.style.height = bodyelement.firstChild.offsetHeight + "px";
    controlelement.classList.add("expanded");
    controlelement.classList.remove("collapsed");
    bodyelement.addEventListener("webkitTransitionEnd", onExpandTransitionEnd, false)
  }else {
    bodyelement.classList.add("block_body_collapsed");
    bodyelement.classList.remove("block_body_expanded");
    bodyelement.style.height = "";
    controlelement.classList.remove("expanded");
    controlelement.classList.add("collapsed")
  }
}
function onExpandTransitionEnd() {
  this.removeEventListener("webkitTransitionEnd", onExpandTransitionEnd);
  var isExpanded = parseInt(this.style.height) != 0;
  if(isExpanded) {
    this.classList.add("block_body_expanded");
    this.classList.remove("block_body_collapsed");
    this.style.height = ""
  }
}
function replaceChromeFaviconUrls() {
  var images = document.images;
  for(var i = 0;i < images.length;i++) {
    var imgsrc = images[i].dataset["nodeIconForHtmlExport"];
    if(imgsrc) {
      images[i].src = imgsrc
    }
  }
}
function loadAllDefferedIcons(max) {
  var images = document.images;
  var count = 0;
  for(var i = images.length - 1;i >= 0;i--) {
    var imgsrc = images[i].dataset["iconSrcDefferedLoad"];
    if(imgsrc) {
      images[i].src = imgsrc;
      delete images[i].dataset["iconSrcDefferedLoad"];
      count++;
      if(count >= max) {
        break
      }
    }
  }
  return count
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
function makeAllElementsDragable() {
  var nodes = document.getElementsByTagName("li");
  for(var i = 0;i < nodes.length;i++) {
    nodes[i].ondragstart = linodes_ondragstart
  }
}
function linodes_filterOutFavIconsInHtml(htmlText) {
  return htmlText.replace(/<img[^>]*>/g, "")
}
function linodes_classListToInterchangeType(nodeTitleEl) {
  if(nodeTitleEl.classList.contains("winNTC")) {
    return"savedwin_"
  }
  if(nodeTitleEl.classList.contains("savedwinNTC")) {
    return"savedwin_"
  }
  if(nodeTitleEl.classList.contains("tabNTC")) {
    return"link_"
  }
  if(nodeTitleEl.classList.contains("savedtabNTC")) {
    return"link_"
  }
  if(nodeTitleEl.classList.contains("groupNTC")) {
    return"group_"
  }
  if(nodeTitleEl.classList.contains("separatorlineNTC")) {
    return"separator_"
  }
  if(nodeTitleEl.classList.contains("textnoteNTC")) {
    return"textline_"
  }
  return"?"
}
function linodes_convertDomElementToInterchangeJsonObj(nodeDomObj) {
  var r = {};
  var nodeTitleEl = nodeDomObj.querySelector(".nodeTitleContainer");
  if(nodeTitleEl) {
    r["type"] = linodes_classListToInterchangeType(nodeTitleEl);
    var node_textEl = nodeTitleEl.querySelector(".node_text");
    if(node_textEl) {
      r["title"] = node_textEl.innerHTML
    }
    if(nodeTitleEl.href) {
      r["url"] = nodeTitleEl.href
    }
  }
  var nodeSubnodesEl = nodeDomObj.querySelector(".subnodeslist");
  if(nodeSubnodesEl) {
    r["subnodes"] = [];
    for(var i = 0;i < nodeSubnodesEl.childNodes.length;i++) {
      r["subnodes"].push(linodes_convertDomElementToInterchangeJsonObj(nodeSubnodesEl.childNodes[i]))
    }
  }
  return r
}
function linodes_convertToInterchangeJson(nodeDomObj) {
  var r = linodes_convertDomElementToInterchangeJsonObj(nodeDomObj);
  return JSON.stringify(r)
}
function linodes_ondragstart(event) {
  event.stopPropagation();
  try {
    event.dataTransfer.setData("text/html", TO_DD_HTML_INTERCHANGE_BEG + linodes_convertToInterchangeJson(this) + TO_DD_HTML_INTERCHANGE_END + linodes_filterOutFavIconsInHtml(this.outerHTML))
  }catch(e) {
    console.error(e)
  }
  return true
}
function setTrialMode() {
  window["isContextMenuGoProBanerVisible"] = true;
  window["isKeysAndcontextMenuActionsEnabled"] = false
}
function setProMode() {
  window["isContextMenuGoProBanerVisible"] = false;
  window["isKeysAndcontextMenuActionsEnabled"] = true
}
///////
setProMode();
///////
window["optionsChanged_message"] = function(changedOption) {
  switch(changedOption) {
    case "showBackupNowBtn":
      setBackupNowBtnVisibility();
      break;
    case "colors":
      applyCustomUserStyles();
      break;
    case "oneClickToOpen":
      location.reload();
      break
  }
};
function setBackupNowBtnVisibility() {
  document.getElementById("backupNowButton").style.display = localStorage["showBackupNowBtn"] ? "" : "none"
}
setBackupNowBtnVisibility();
var backupOperationId_;
function backupNow() {
  ifLite_goPro() || chrome.extension.getBackgroundPage()["performGdriveBackup"](backupOperationId_ = Math.random());
  chrome.extension.getBackgroundPage().ga_event("Backup Now Button Clicked - Main View - " + (!!window["isKeysAndcontextMenuActionsEnabled"] ? "Paid" : "NoValidKey"))
}
;
