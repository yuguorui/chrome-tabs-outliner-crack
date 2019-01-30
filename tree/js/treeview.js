// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var tiles = {rexmark:{src:"tree/img/tagicons/test/exmark_red_s1.png", w:8, h:18}, gexmark:{src:"tree/img/tagicons/test/exmark_green_s1.png", w:8, h:18}, ystar:{src:"tree/img/tagicons/test/star_yellow_s1.png", w:17, h:16}, vstar:{src:"tree/img/tagicons/test/star_violet_s1.png", w:17, h:16}, bigstar:{src:"tree/img/tagicons/test/star_big_s1.png", w:29, h:27}, work:{src:"tree/img/tagicons/test/work_s1.png", w:45, h:18}, nodeanchor_no_subnodes:{src:"tree/img/treetiles/correlatestyle/node_anchor_no_subnodes_s1.png", 
w:15, h:16, className:"rellinetiles"}, nodeanchor_colapsed:{src:"tree/img/treetiles/correlatestyle/node_anchor_colapsed_s1.png", w:15, h:16, className:"rellinetiles"}, nodeanchor_expanded:{src:"tree/img/treetiles/correlatestyle/node_anchor_expanded_s1.png", w:15, h:16, className:"rellinetiles"}, lineto_last_subnode:{src:"tree/img/treetiles/correlatestyle/lineto_last_subnode_s1.png", w:15, h:16, className:"rellinetiles"}, lineto_subnode:{src:"tree/img/treetiles/correlatestyle/lineto_subnode_s1.png", 
w:15, h:16, className:"rellinetiles"}, line_vertical:{src:"tree/img/treetiles/correlatestyle/line_vertical_s1.png", w:15, h:1, className:"rellinetiles"}, line_horizontal:{src:"tree/img/treetiles/correlatestyle/line_horizontal_s1.png", w:1, h:16, className:"rellinetiles"}, icons_separator:{src:"tree/img/treetiles/correlatestyle/icons_separator_s1.png", w:5, h:16, className:"rellinetiles"}};
var incorect_tiles_size_warning_alert_was_fires = false;
function onClick_hoveringMenu_expandCollapseBtn() {
  dispatchBubledCustomEvent(this, "node_expand_collapse_anchor_activated")
}
function onClick_hoveringMenu_actionBtn() {
  dispatchBubledCustomEvent(this, "hovering_menu_action_btn_activated", {"actionId":this.id})
}
function makeHoveringMenu(window_) {
  var r = window_.document.createElement("span");
  r.className = "hoveringMenu_container";
  r._ref_actionButtonsContainer = window_.document.createElement("span");
  r._ref_actionButtonsContainer.className = "hoveringMenu_panel";
  r.appendChild(r._ref_actionButtonsContainer);
  r._ref_hoveringMenu_expandCollapseBtn = document.createElement("div");
  r._ref_hoveringMenu_expandCollapseBtn.className = "hoveringMenu_expandCollapseBtn";
  r._ref_hoveringMenu_expandCollapseBtn.onclick = onClick_hoveringMenu_expandCollapseBtn;
  r.addActionButton = function(action) {
    if(!action) {
      return
    }
    var b = this.ownerDocument.createElement("span");
    b.className = "hoveringMenu_" + action.id;
    b.id = action.id;
    b.onclick = onClick_hoveringMenu_actionBtn;
    this._ref_actionButtonsContainer.appendChild(b)
  };
  r.setOwner = function(owner) {
    this._ref_owner = owner;
    if(owner) {
      this._ref_actionButtonsContainer.innerHTML = "";
      if(this._ref_owner._ref_nodeModel.subnodes.length > 0) {
        this._ref_actionButtonsContainer.appendChild(this._ref_hoveringMenu_expandCollapseBtn)
      }
      var actions = this._ref_owner._ref_nodeModel.getHoveringMenuActions();
      if(this._ref_owner._ref_treeView.isOneClickToActivateMode && window["isKeysAndcontextMenuActionsEnabled"]) {
        this.addActionButton(actions["setCursorAction"])
      }
      this.addActionButton(actions["editTitleAction"]);
      this.addActionButton(actions["deleteAction"]);
      this.addActionButton(actions["closeAction"])
    }
  };
  r.getOwner = function() {
    return this._ref_owner
  };
  return r
}
function makeDragFeedbackAsFirstChild(window_) {
  var i = window_.document.createElement("img");
  i.src = "tree/img/drag_feedback_as_first_child.png";
  i.style.cssText = "pointer-events:none;";
  var r = window_.document.createElement("div");
  r.id = "dragFeedback";
  r.appendChild(i);
  return r
}
function makeDragFeedbackAsSibling(window_) {
  var i = window_.document.createElement("img");
  i.src = "tree/img/drag_feedback_as_sibling.png";
  i.style.cssText = "pointer-events:none;position:absolute;bottom:-9px";
  var r = window_.document.createElement("div");
  r.id = "dragFeedback";
  r.appendChild(i);
  return r
}
function findAbsolutePosition(obj) {
  var box = obj.getBoundingClientRect(), doc = obj.ownerDocument, body = doc.body, docElem = doc.documentElement, clientTop = docElem.clientTop || (body.clientTop || 0), clientLeft = docElem.clientLeft || (body.clientLeft || 0), top = box.top + window.pageYOffset - clientTop, left = box.left + window.pageXOffset - clientLeft;
  return{top:top, left:left}
}
function makeTileDom(tile, parameters) {
  var r = new Image;
  r.src = tile.src;
  if(parameters && parameters.style) {
    r.style.cssText = parameters.style
  }
  if(parameters && parameters.w) {
    r.style.width = parameters.w
  }else {
    r.width = tile.w
  }
  if(parameters && parameters.h) {
    r.style.height = parameters.h
  }else {
    r.height = tile.h
  }
  if(parameters && parameters.className) {
    r.className = parameters.className
  }else {
    if(tile.className) {
      r.className = tile.className
    }
  }
  r.onload = function() {
    var warningsPresent = false;
    if(this.naturalWidth != tile.w) {
      warningsPresent = true;
      if(typeof console != "undefined") {
        console.warn("Warning: tile " + this.src + " have incorect width, provided:" + tile.w + " must be:" + this.naturalWidth, tile, this)
      }
    }
    if(this.naturalHeight != tile.h) {
      warningsPresent = true;
      if(typeof console != "undefined") {
        console.warn("Warning: tile " + this.src + " have incorect height, provided:" + tile.h + " must be:" + this.naturalHeight, tile, this)
      }
    }
    if(warningsPresent && !incorect_tiles_size_warning_alert_was_fires) {
      alert("Warning. Some tiles was declared with incorect size, see console log for details.");
      incorect_tiles_size_warning_alert_was_fires = true
    }
  };
  return r
}
function makeRelIconDom(icontile) {
  var r = document.createElement("span");
  var rellinerowheight = tiles.line_horizontal.h;
  r.style.cssText = "display:inline-block; position:relative; width:" + icontile.w + "px;height:" + rellinerowheight + "px;";
  var icon = makeTileDom(icontile);
  icon.style.cssText = "position:absolute; top:" + (rellinerowheight - icontile.h) / 2 + "px";
  r.appendChild(icon);
  return r
}
var tiles_line_horizontal_w100 = makeTileDom(tiles.line_horizontal, {w:"100%"});
function makeRelLineWithIconsDom(window_, icons) {
  if(!icons || icons.length === 0) {
    return tiles_line_horizontal_w100
  }
  var r = window_.document.createElement("table");
  r.className = "relllineiconstable";
  var row = r.insertRow(-1);
  var iconscontainer = row.insertCell(-1);
  iconscontainer.appendChild(makeTileDom(tiles.line_horizontal, {w:"5"}));
  icons.forEach(function(icon) {
    iconscontainer.appendChild(makeTileDom(tiles.icons_separator));
    iconscontainer.appendChild(makeRelIconDom(icon))
  });
  iconscontainer.appendChild(makeTileDom(tiles.icons_separator));
  var fillercontainer = row.insertCell(-1);
  fillercontainer.style.width = "100%";
  fillercontainer.appendChild(tiles_line_horizontal_w100);
  return r
}
function NodeTextWithAnchorDom_createStatBlockInnerHtml(nodeModel) {
  var subnodesStatistic = nodeModel.countSubnodes({"nodesCount":0, "activeWinsCount":0, "activeTabsCount":0});
  if(subnodesStatistic["nodesCount"] === subnodesStatistic["activeTabsCount"]) {
    delete subnodesStatistic["nodesCount"]
  }
  var r = "";
  for(var s in subnodesStatistic) {
    if(subnodesStatistic.hasOwnProperty(s) && subnodesStatistic[s] > 0) {
      r += '<span class="' + s + '">' + subnodesStatistic[s] + "</span>"
    }
  }
  return r
}
function NodeTextWithAnchorDom_updateNodeAnchorImageAndCollapsedStatDom(window_, nodeModel, isCursored) {
  var isColapsedSubnodes = nodeModel.colapsed;
  var isNoSubnodes = nodeModel.subnodes.length === 0;
  this.updateCssClasses(nodeModel, isCursored);
  if(isColapsedSubnodes && !isNoSubnodes) {
    if(!this._ref_collapsedNodesInfoDom) {
      this._ref_collapsedNodesInfoDom = window_.document.createElement("span");
      this._ref_collapsedNodesInfoDom.className = "collapsedNodesInfo " + nodeModel.titleCssClass;
      this._ref_collapsedNodesInfoDom.addEventListener("mousedown", fireExpandCollapseAnchorEventOnSelf, false);
      this.insertBefore(this._ref_collapsedNodesInfoDom, this.firstChild)
    }
    this._ref_collapsedNodesInfoDom.innerHTML = NodeTextWithAnchorDom_createStatBlockInnerHtml(nodeModel)
  }else {
    if(this._ref_collapsedNodesInfoDom) {
      this.removeChild(this._ref_collapsedNodesInfoDom);
      this._ref_collapsedNodesInfoDom = null
    }
  }
}
function NodeTextWithAnchorDom_updateNodeTitle(nodeModel, isCursored, isFullTreeBuild) {
  var nodeIcon = nodeModel.getIcon();
  var nodeIconForHtmlExport = nodeModel.getIconForHtmlExport();
  this.href = nodeModel.getHref();
  if(nodeIcon !== null) {
    if(isFullTreeBuild) {
      if(nodeIcon.indexOf(":") === -1) {
        this._ref_nodeFaviconDom.src = nodeIcon
      }else {
        this._ref_nodeFaviconDom.dataset["iconSrcDefferedLoad"] = nodeIcon
      }
    }else {
      this._ref_nodeFaviconDom.src = nodeIcon
    }
  }
  if(nodeIconForHtmlExport) {
    this._ref_nodeFaviconDom.dataset["nodeIconForHtmlExport"] = nodeIconForHtmlExport
  }
  if(nodeModel.isLink && nodeModel.getCustomTitle()) {
    this._ref_nodeTextDom.innerHTML = '<span class="tab_comment">' + nodeModel.getCustomTitle() + "</span>" + nodeModel.getNodeText()
  }else {
    this._ref_nodeTextDom.textContent = nodeModel.getNodeText()
  }
  this.updateCssClasses(nodeModel, isCursored)
}
function isSimleLeftClickWithoutKeybModifiers(event) {
  var isLeftClick = event.which == null ? event.button <= 1 : event.which == 1;
  return isLeftClick && (!event.ctrlKey && !event.shiftKey)
}
function NodeTextWithAnchorDom_preventDefaultOnSimpleLMBClick(event) {
  if(isSimleLeftClickWithoutKeybModifiers(event)) {
    event.preventDefault()
  }
}
function dispatchBubledCustomEvent(domElem, eventType, detail) {
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(eventType, true, true, detail);
  var isPreventDefaultFlagSet = !domElem.dispatchEvent(evt);
  return isPreventDefaultFlagSet
}
function isClickOnAnchorArea(nodeTextWithAnchorDomObjThis, event) {
  return nodeTextWithAnchorDomObjThis === event.srcElement && event.offsetX < 40
}
function NodeTextWithAnchorDom_detectAndFireExpandCollapseAnchorEvent(event) {
  if(isClickOnAnchorArea(this, event)) {
    dispatchBubledCustomEvent(this, "node_expand_collapse_anchor_activated")
  }
}
function fireExpandCollapseAnchorEventOnSelf(event) {
  dispatchBubledCustomEvent(this, "node_expand_collapse_anchor_activated")
}
function NodeTextWithAnchorDom_onHover(event) {
  dispatchBubledCustomEvent(this.parentNode, "node_hovered")
}
function NodeTextWithAnchorDom_onActivated(event) {
  if(isSimleLeftClickWithoutKeybModifiers(event) && !isClickOnAnchorArea(this, event)) {
    dispatchBubledCustomEvent(this.parentNode, "node_activated", {"altKey":event["altKey"]});
    event.preventDefault()
  }
}
function NodeTextWithAnchorDom_onFocused(event) {
  dispatchBubledCustomEvent(this.parentNode, "node_focused")
}
function NodeTextWithAnchorDom_isInEditMode() {
  return this._ref_nodeFaviconAndTextContainerDom.contentEditable === "true"
}
function NodeTextWithAnchorDom_setEditMode(isEditMode) {
  return this._ref_nodeFaviconAndTextContainerDom.contentEditable = isEditMode ? "true" : "inherit"
}
function NodeTextWithAnchorDom_updateCssClasses(nodeModel, isCursored) {
  var classes = "nodeTitleContainer " + nodeModel.titleCssClass + "NTC NTC-" + nodeModel.titleBackgroundCssClass;
  var isColapsedSubnodes = nodeModel.colapsed;
  var isNoSubnodes = nodeModel.subnodes.length === 0;
  if(isNoSubnodes) {
    classes += " nosubnodes"
  }else {
    classes += isColapsedSubnodes ? " collapsedsubnodes" : " expandedsubnodes"
  }
  if(nodeModel.isSelectedTab()) {
    classes += " selectedtab"
  }
  if(nodeModel.isFocusedWindow()) {
    classes += " focusedwindow"
  }
  if(nodeModel.isProtectedFromGoneOnClose()) {
    classes += " protected"
  }
  if(nodeModel.getNodeContentCssClass()) {
    classes += " NCC-NTC-" + nodeModel.getNodeContentCssClass()
  }
  if(isCursored) {
    classes += " " + cursoredNodeCssClass
  }
  if(this.className != classes) {
    this.className = classes
  }
}
function makeNodeTextWithAnchorDom(window_, nodeModel, isOneClickToActivateMode, isCursored, isFullTreeBuild) {
  var rNodeTitleContainer = window_.document.createElement(nodeModel.isLink ? "a" : "div");
  rNodeTitleContainer.updateCssClasses = NodeTextWithAnchorDom_updateCssClasses;
  rNodeTitleContainer.updateNodeTitle = NodeTextWithAnchorDom_updateNodeTitle;
  rNodeTitleContainer.isInEditMode = NodeTextWithAnchorDom_isInEditMode;
  rNodeTitleContainer.setEditMode = NodeTextWithAnchorDom_setEditMode;
  rNodeTitleContainer.updateNodeAnchorImageAndCollapsedStatDom = NodeTextWithAnchorDom_updateNodeAnchorImageAndCollapsedStatDom;
  rNodeTitleContainer.addEventListener("click", NodeTextWithAnchorDom_preventDefaultOnSimpleLMBClick, false);
  rNodeTitleContainer.addEventListener("mousedown", NodeTextWithAnchorDom_detectAndFireExpandCollapseAnchorEvent, false);
  rNodeTitleContainer.addEventListener("mousedown", NodeTextWithAnchorDom_onFocused, false);
  rNodeTitleContainer.addEventListener("mouseover", NodeTextWithAnchorDom_onHover, false);
  rNodeTitleContainer.addEventListener(isOneClickToActivateMode ? "click" : "dblclick", NodeTextWithAnchorDom_onActivated, false);
  rNodeTitleContainer.updateNodeAnchorImageAndCollapsedStatDom(window_, nodeModel, isCursored);
  if(nodeModel.needFaviconAndTextHelperContainer) {
    var nodeFaviconAndTextHelperContainerDom = window_.document.createElement("div");
    nodeFaviconAndTextHelperContainerDom.className = "nodeFaviconAndTextHelperContainer " + nodeModel.titleCssClass;
    rNodeTitleContainer.appendChild(nodeFaviconAndTextHelperContainerDom)
  }
  rNodeTitleContainer._ref_nodeFaviconAndTextContainerDom = nodeFaviconAndTextHelperContainerDom ? nodeFaviconAndTextHelperContainerDom : rNodeTitleContainer;
  if(nodeModel.getIcon() != null) {
    var favicon = window_.document.createElement("img");
    favicon.className = "node_favicon " + nodeModel.titleCssClass + "_favicon";
    rNodeTitleContainer._ref_nodeFaviconAndTextContainerDom.appendChild(favicon)
  }
  var text = window_.document.createElement("span");
  text.className = "node_text " + nodeModel.titleCssClass + "_text";
  text.setAttribute("draggable", "true");
  if(nodeModel.additionalTextCss) {
    text.className += " " + nodeModel.additionalTextCss
  }
  if(nodeModel.getNodeTextCustomStyle()) {
    text.style.cssText = nodeModel.getNodeTextCustomStyle()
  }
  rNodeTitleContainer._ref_nodeFaviconAndTextContainerDom.appendChild(text);
  rNodeTitleContainer._ref_nodeFaviconDom = favicon;
  rNodeTitleContainer._ref_nodeTextDom = text;
  rNodeTitleContainer.updateNodeTitle(nodeModel, isCursored, isFullTreeBuild);
  return rNodeTitleContainer
}
var SubnodesListView = function() {
};
var NodeView = function(nodeModel, nodeViewOwner) {
  this.nodeModel = nodeModel;
  this.nodeViewOwner = nodeViewOwner
};
NodeView.prototype = {nodeModel:null, nodeViewOwner:null, subnodesViews:[], nodeRowDom:null, nodeContentAndSubnodesCellDom:null, nodeContentDom:null, nodeSubnodesDom:null, takeFocus:function() {
}, removeFromTabOrder:function() {
}, switchToEditMode:function() {
}, selectNodeUp:function() {
}, selectNodeDown:function() {
}, selectNodeLeft:function() {
}, selectNodeRight:function() {
}, fromHtml_onAnchorClicked:function() {
}, fromModel_onSubnodesCollapsingStatusChanged:function() {
}, fromModel_onSubnodeDeleted:function(atIndex) {
}, fromModel_onSubnodeInserted:function(atIndex) {
}, model_setSubnodesCollapsedState:function() {
}, model_addObserver:function() {
}, model_applyNewTextToNode:function() {
}, model_deleteNode:function() {
}, model_addSiblingNodeAbove:function() {
}, model_addSiblingNodeBelow:function() {
}, model_addSubNode:function(atIndex) {
}, end:null};
var cursoredNodeCssClass = "currentNode";
function getRowDomFromEvent_orNull(e) {
  for(var element = e.target;!!element.parentNode;element = element.parentNode) {
    if(element.parentNode._ref_nodeModel) {
      break
    }
  }
  return element.parentNode
}
function TreeView(window_, treeModel, thisTreeTabIndex, dragedModelStorage, bottomMainPanelHeight, isEnableContextMenu) {
  this.cursoredNodeModel = null;
  this.treeModel = treeModel;
  this.treeTabIndex = thisTreeTabIndex;
  this.dragedModelStorage = dragedModelStorage;
  this.activatePrompt = initModalPrompt(window_);
  this.activateContextMenu = initContextMenu(window_);
  this.bottomMainPanelHeight = bottomMainPanelHeight;
  this.currentDragFeedbackHolder = null;
  this.dragFeedbackAsFirstChild = makeDragFeedbackAsFirstChild(window_);
  this.dragFeedbackAsSibling = makeDragFeedbackAsSibling(window_);
  this.dragFeedback = this.dragFeedbackAsFirstChild;
  this.dragFeedbackDefferedDrawTimer = null;
  this.hoveringMenu = makeHoveringMenu(window_);
  this.isOneClickToActivateMode = !!localStorage["oneClickToOpen"];
  this.currentSessionRowDom = makeNodeRowDom(window_, treeModel[0], this, true);
  this.currentSessionRowDom.id = "currentSessionRoot";
  this.connectClipboardListeners(window_);
  if(isEnableContextMenu) {
    this.connectContextMenu()
  }
}
TreeView.prototype = {PAGE_UP_DOWN_REPEAT:10, connectContextMenu:function() {
  this.currentSessionRowDom.addEventListener("contextmenu", function(e) {
    if(e.shiftKey) {
      return true
    }
    var rowDom = getRowDomFromEvent_orNull(e);
    if(rowDom) {
      rowDom._ref_treeView.setCursorToRowDom(rowDom);
      rowDom._ref_treeView.activateContextMenu(e, !!window["isContextMenuGoProBanerVisible"]);
      e.preventDefault()
    }
  }, false)
}, activateCurrentNode:function(isAlternativeRestore) {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  model.onNodeDblClicked(this.treeModel, this, isAlternativeRestore)
}, activateHoveringMenuActionOnCurrentNode:function(actionId) {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var action = model.getHoveringMenuActions()[actionId];
  if(action) {
    action.performAction(model, this)
  }
}, editCurrentNodeNote:function() {
  this.activateHoveringMenuActionOnCurrentNode("editTitleAction")
}, deleteCurrentNode:function() {
  this.activateHoveringMenuActionOnCurrentNode("deleteAction")
}, deleteCurrentHierarchy:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  model.setCollapsing(true);
  this.activateHoveringMenuActionOnCurrentNode("deleteAction")
}, saveCloseCurrentNode:function() {
  this.activateHoveringMenuActionOnCurrentNode("closeAction")
}, moveHierarchy:function(hierarchy, whereRelativeToAnchorModel, anchorModel) {
  if(!anchorModel || !hierarchy) {
    return
  }
  var dropTarget = selectDropTarget(whereRelativeToAnchorModel, anchorModel);
  this.treeModel.moveCopyHierarchy(dropTarget, hierarchy, false, this)
}, moveCurrentNode_levelDown:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.moveHierarchy(model, AS_NEXT_SIBLING, model.parent)
}, moveCurrentNode_levelUp:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.moveHierarchy(model, AS_LAST_SUBNODE, model.findPrevSibling())
}, moveCurrentNode_up:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.moveHierarchy(model, AS_PREV_SIBLING, model.findPrevSibling_ifAbsent_parent())
}, moveCurrentNode_down:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.moveHierarchy(model, AS_NEXT_SIBLING, model.findNextSibling_ifAbsent_anyParentsNextSibling())
}, moveCurrentNode_asFirstSiblingInSameLevel:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.moveHierarchy(model, AS_FIRST_SUBNODE, model.parent)
}, moveCurrentNode_asLastSiblingInSameLevel:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.moveHierarchy(model, AS_LAST_SUBNODE, model.parent)
}, actionFlattenTabsHierarchy:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var a = [model];
  if(model.colapsed) {
    model.findAllTabsOrganizersInsideHierarchy(a)
  }
  a.forEach(function(node) {
    node.flattenTabsHierarchy_skipTabsOrganizers()
  })
}, actionMoveWindowToTheEndOfTree:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var tabsOrganizer = model.findFirstSavedOrOpenTabsOrganizerInPathToRoot();
  if(!tabsOrganizer) {
    return
  }
  tabsOrganizer.moveToTheEndOfTree()
}, actionOpenLinkInNewWindow:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var href = model.getHref();
  if(!href) {
    return
  }
  chrome.windows.getAll({}, function(chromeWindowObjects) {
    var chromeWindowObj = {"top":11, "left":11, "id":0};
    chromeWindowObjects.forEach(function(winobj) {
      if(winobj["type"] == "normal" && winobj["id"] >= chromeWindowObj.id) {
        chromeWindowObj = winobj
      }
    });
    window.chrome.windows.create({"url":href, "top":chromeWindowObj.top + 11, "left":chromeWindowObj.left + 11, "height":chromeWindowObj.height, "width":chromeWindowObj.width})
  })
}, actionOpenLinkInNewTab:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var href = model.getHref();
  if(!href) {
    return
  }
  window.open(href, "_blank")
}, addNoteAsParentOfCurrentNode:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var newnote = model.insertParent(this.treeModel.createNodeNote());
  newnote.setCursorHereOrToFirstCollapsedParent(this);
  this.editCurrentNodeNote()
}, addNoteAsFirstSubnodeOfCurrentNode:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  model.setCollapsing(false);
  var newnote = model.insertAsFirstSubnode(this.treeModel.createNodeNote());
  newnote.setCursorHereOrToFirstCollapsedParent(this);
  this.editCurrentNodeNote()
}, addNoteAsLastSubnodeOfCurrentNode:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  model.setCollapsing(false);
  var newnote = model.insertAsLastSubnode(this.treeModel.createNodeNote());
  newnote.setCursorHereOrToFirstCollapsedParent(this);
  this.editCurrentNodeNote()
}, addNoteAsPrevSiblingOfCurrentNode:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var newnote = model.insertAsPreviousSibling(this.treeModel.createNodeNote());
  newnote.setCursorHereOrToFirstCollapsedParent(this);
  this.editCurrentNodeNote()
}, addNoteAsNextSiblingOfCurrentNode:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var newnote = model.insertAsNextSibling(this.treeModel.createNodeNote());
  newnote.setCursorHereOrToFirstCollapsedParent(this);
  this.editCurrentNodeNote()
}, actionAddSeparatorBelove:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var newnode = model.insertAsNextSibling(this.treeModel.createNodeSeparator())
}, actionAddGroupAbove:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var newnode = model.insertAsPreviousSibling(this.treeModel.createNodeGroup())
}, addNoteAtTheEndOfTree:function() {
  var model = this.treeModel.currentSession_rootNode;
  if(!model) {
    return
  }
  var newnote = model.insertAsLastSubnode(this.treeModel.createNodeNote());
  newnote.setCursorHereOrToFirstCollapsedParent(this);
  this.editCurrentNodeNote()
}, addHierarchyAsLastSubnodeOfCurrentNode:function(hierarchy) {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  model.setCollapsing(false);
  var newnote = model.insertAsLastSubnode(hierarchy);
  newnote.setCursorHereOrToFirstCollapsedParent(this)
}, moveCursor_toFirstSiblingInSameLevel:function() {
  var nodeParent = this.ICursorOwner_getNodeModelAtCursor().parent;
  if(!nodeParent) {
    return
  }
  nodeParent.subnodes[0].setCursorHereOrToFirstCollapsedParent(this)
}, moveCursor_toLastSiblingInSameLevel:function() {
  var nodeParent = this.ICursorOwner_getNodeModelAtCursor().parent;
  if(!nodeParent) {
    return
  }
  nodeParent.subnodes[nodeParent.subnodes.length - 1].setCursorHereOrToFirstCollapsedParent(this)
}, moveCursor_up:function(bySiblings) {
  this.moveCursorUp(this.ICursorOwner_getNodeModelAtCursor(), 1)
}, moveCursor_down:function(bySiblings) {
  this.moveCursorDown(this.ICursorOwner_getNodeModelAtCursor(), 1)
}, moveCursor_toFirstSubnode:function() {
  this.moveCursorToFirstSubnodeExpandIfCollapsed(this.ICursorOwner_getNodeModelAtCursor())
}, moveCursor_toParent_butNotToRoot:function() {
  this.moveCursorToParrent_butNotToRoot(this.ICursorOwner_getNodeModelAtCursor())
}, moveCursorUp:function(cursoredNode, repeat) {
  while(repeat-- && cursoredNode) {
    cursoredNode = cursoredNode.findNodeOnPrevRow();
    if(cursoredNode) {
      cursoredNode.setCursorHereOrToFirstCollapsedParent(this)
    }
  }
}, moveCursorDown:function(cursoredNode, repeat) {
  while(repeat-- && cursoredNode) {
    cursoredNode = cursoredNode.findNodeOnNextRow(false);
    if(cursoredNode) {
      cursoredNode.setCursorHereOrToFirstCollapsedParent(this)
    }
  }
}, moveCursorToFirstSubnodeExpandIfCollapsed:function(cursoredNode) {
  cursoredNode.setCollapsing(false);
  if(cursoredNode.subnodes.length > 0) {
    cursoredNode.subnodes[0].setCursorHereOrToFirstCollapsedParent(this)
  }
}, moveCursorToParrent_butNotToRoot:function(cursoredNode) {
  if(!cursoredNode.parent) {
    return
  }
  if(!cursoredNode.parent.parent) {
    return
  }
  cursoredNode.parent.setCursorHereOrToFirstCollapsedParent(this)
}, togleCollapsedStateOfCursoredNode:function() {
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(model) {
    model.setCollapsing(!model.colapsed)
  }
}, moveCursor_pageUp:function() {
  this.moveCursorUp(this.ICursorOwner_getNodeModelAtCursor(), this.PAGE_UP_DOWN_REPEAT)
}, moveCursor_pageDown:function() {
  this.moveCursorDown(this.ICursorOwner_getNodeModelAtCursor(), this.PAGE_UP_DOWN_REPEAT)
}, isModalUiElementsActive:function(event) {
  var w_ = event.target.ownerDocument.defaultView;
  return w_["modalEditPromptActive"] || w_["modalContextMenuActive"]
}, isNoteEditBoxActive:function(event) {
  var w_ = event.target.ownerDocument.defaultView;
  return w_["modalEditPromptActive"]
}, setDragClipboardData:function(dataTransferObj, hierarchy) {
  dataTransferObj.setData("text/uri-list", this.treeModel.makeTransferableRepresentation_UriList(hierarchy));
  dataTransferObj.setData("text/html", this.treeModel.makeTransferableRepresentation_Html(hierarchy));
  dataTransferObj.setData("text/plain", this.treeModel.makeTransferableRepresentation_TextMultiline(hierarchy));
  dataTransferObj.setData("application/x-tabsoutliner-items", this.treeModel.makeTransferableRepresentation_TabsOutlinerInterchangeFormat(hierarchy))
}, cut:function(event) {
  if(this.isNoteEditBoxActive(event)) {
    return true
  }
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.dragedModelStorage.clearDragedModel();
  this.setDragClipboardData(event.clipboardData, model);
  this.deleteCurrentHierarchy();
  event.stopPropagation();
  event.preventDefault()
}, copy:function(event) {
  if(this.isNoteEditBoxActive(event)) {
    return true
  }
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  this.dragedModelStorage.clearDragedModel();
  this.setDragClipboardData(event.clipboardData, model);
  event.stopPropagation();
  event.preventDefault()
}, paste:function(event) {
  if(this.isNoteEditBoxActive(event)) {
    return true
  }
  var model = this.ICursorOwner_getNodeModelAtCursor();
  if(!model) {
    return
  }
  var x_tabsoutliner_data = event.clipboardData.getData("application/x-tabsoutliner-items");
  var nodesHierarchy;
  if(x_tabsoutliner_data) {
    nodesHierarchy = this.makeDragModelFromTabsOutlinerInterchangeFormat(x_tabsoutliner_data)
  }else {
    nodesHierarchy = this.treeModel.createNodeNote(event.clipboardData.getData("text/plain"))
  }
  this.addHierarchyAsLastSubnodeOfCurrentNode(nodesHierarchy);
  this.dragedModelStorage.clearDragedModel();
  event.stopPropagation();
  event.preventDefault()
}, connectClipboardListeners:function(window_) {
  this.binded_paste = this.paste.bind(this);
  this.binded_copy = this.copy.bind(this);
  this.binded_cut = this.cut.bind(this);
  window_.addEventListener("paste", this.binded_paste);
  window_.addEventListener("copy", this.binded_copy);
  window_.addEventListener("cut", this.binded_cut)
}, deleteAllMembers:function(window_) {
  window_.removeEventListener("paste", this.binded_paste);
  window_.removeEventListener("copy", this.binded_copy);
  window_.removeEventListener("cut", this.binded_cut);
  this.binded_paste = null;
  this.binded_copy = null;
  this.binded_cut = null;
  this.activatePrompt = null;
  this.cursoredNodeRowDom = null;
  this.cursoredNodeModel = null;
  this.treeModel = null;
  this.treeTabIndex = null;
  this.dragedModelStorage = null;
  this.currentSessionRowDom = null;
  this.currentDragFeedbackHolder = null;
  this.dragFeedbackAsFirstChild = null;
  this.dragFeedbackAsSibling = null;
  this.dragFeedback = null;
  this.hoveringMenu.setOwner(null);
  this.hoveringMenu = null
}, isNodeModelCursored:function(nodeModel) {
  return this.ICursorOwner_getNodeModelAtCursor() === nodeModel
}, ICursorOwner_getNodeModelAtCursor:function() {
  return this.cursoredNodeModel
}, scrollIntoViewIfOutOfView_byShortestPath:function(element, window_) {
  var isAboveVisibleArea = element.offsetTop < window_.pageYOffset;
  var bottomMainPanelHeight = 70;
  var isBelowVisibleArea = element.offsetTop + element.offsetHeight > window_.pageYOffset + window_.innerHeight - this.bottomMainPanelHeight;
  var PADDING = 2;
  if(isAboveVisibleArea) {
    window_.scrollTo(0, element.offsetTop - PADDING)
  }
  if(isBelowVisibleArea) {
    window_.scrollTo(0, element.offsetTop - window_.innerHeight + (element.offsetHeight + PADDING) + this.bottomMainPanelHeight)
  }
}, removeCursorStyles:function(rowDom) {
  rowDom._ref_nodeTextWithAnchorDom.tabIndex = -1;
  rowDom.classList.remove(cursoredNodeCssClass);
  rowDom._ref_nodeTextWithAnchorDom.classList.remove(cursoredNodeCssClass)
}, setCursorToRowDom:function(rowDom, doNotScrollView) {
  if(!rowDom._ref_nodeModel) {
    return
  }
  if(this.cursoredNodeModel) {
    this.cursoredNodeModel.removeCursorStyles(this)
  }
  this.cursoredNodeModel = rowDom._ref_nodeModel;
  rowDom.classList.add(cursoredNodeCssClass);
  rowDom._ref_nodeTextWithAnchorDom.classList.add(cursoredNodeCssClass);
  rowDom._ref_nodeTextWithAnchorDom.tabIndex = this.treeTabIndex;
  if(!doNotScrollView) {
    this.scrollIntoViewIfOutOfView_byShortestPath(rowDom._ref_nodeTextWithAnchorDom, window);
    rowDom._ref_nodeTextWithAnchorDom.focus()
  }
}, setCursorToDomElementWithId:function(nodeId, alternateNodeId) {
  var rowDom = document.getElementById(nodeId);
  if(!rowDom) {
    rowDom = document.getElementById(alternateNodeId)
  }
  if(rowDom) {
    this.setCursorToRowDom(rowDom)
  }
}, deferred_clearDragFeedback:function() {
  var _this = this;
  window.clearTimeout(this.dragFeedbackDefferedDrawTimer);
  this.dragFeedbackDefferedDrawTimer = window.setTimeout(function() {
    _this.clearDragFeedback()
  }, 26)
}, deferred_showDragFeedback:function(rowDom, dropPosition) {
  var _this = this;
  window.clearTimeout(this.dragFeedbackDefferedDrawTimer);
  this.dragFeedbackDefferedDrawTimer = window.setTimeout(function() {
    _this.showDragFeedback(rowDom, dropPosition)
  }, 26)
}, clearDragFeedback:function() {
  this.currentDragFeedbackHolder = null;
  if(this.dragFeedback.parentNode) {
    this.dragFeedback.parentNode.removeChild(this.dragFeedback)
  }
}, showDragFeedback:function(rowDom, dropPosition) {
  if(dropPosition === AS_FIRST_SUBNODE) {
    this.showDragFeedback_asFirstSubnode(rowDom._ref_nodeTextWithAnchorDom)
  }else {
    this.showDragFeedback_asNextSibling(rowDom)
  }
}, showDragFeedback_asNextSibling:function(dragFeedBackHolder) {
  this._showDragFeedback(this.dragFeedbackAsSibling, dragFeedBackHolder)
}, showDragFeedback_asFirstSubnode:function(dragFeedBackHolder) {
  this._showDragFeedback(this.dragFeedbackAsFirstChild, dragFeedBackHolder, dragFeedBackHolder.offsetWidth)
}, _showDragFeedback:function(dragFeedback, dragFeedBackHolder, width) {
  this.clearHoveringMenu(null);
  if(this.currentDragFeedbackHolder === dragFeedBackHolder) {
    return
  }
  this.currentDragFeedbackHolder = dragFeedBackHolder;
  if(this.dragFeedback !== dragFeedback) {
    this.clearDragFeedback()
  }
  this.dragFeedback = dragFeedback;
  if(this.dragFeedback.parentNode) {
    this.dragFeedback.parentNode.removeChild(this.dragFeedback)
  }
  var abspos = findAbsolutePosition(dragFeedBackHolder);
  if(width) {
    this.dragFeedback.style.width = width + "px"
  }else {
    delete this.dragFeedback.style.width
  }
  this.dragFeedback.style.height = dragFeedBackHolder.offsetHeight + "px";
  this.dragFeedback.style.left = abspos.left + "px";
  this.dragFeedback.style.top = abspos.top + "px";
  document.body.appendChild(this.dragFeedback)
}, showHoveringMenu:function(nodeRowDom) {
  if(this.hoveringMenu.getOwner === nodeRowDom) {
    return
  }
  if(this.hoveringMenu.parentNode) {
    this.hoveringMenu.parentNode.removeChild(this.hoveringMenu)
  }
  this.hoveringMenu.setOwner(nodeRowDom);
  this.hoveringMenu.style.visibility = "visible";
  nodeRowDom.insertBefore(this.hoveringMenu, nodeRowDom.firstChild)
}, updateHoveringMenu:function(nodeRowDom) {
  this.hoveringMenu.setOwner(null);
  this.showHoveringMenu(nodeRowDom)
}, clearHoveringMenu:function(ownerNodeView) {
  this.hoveringMenu.setOwner(null);
  this.hoveringMenu.style.visibility = "hidden"
}, makeDragModelFromTabsOutlinerInterchangeFormat:function(data) {
  return this.treeModel.createHierarchyFromTabsOutlinerInterchangeFormat(data)
}, prepareDragedModel:function(event, isDragDataStoreAllowRead) {
  var dragedModel = this.dragedModelStorage.getDragedModel();
  if(dragedModel) {
  }else {
    if(getItemFromDragDataStoreByMimeType(event.dataTransfer, "application/x-tabsoutliner-items")) {
      if(isDragDataStoreAllowRead) {
        dragedModel = this.makeDragModelFromTabsOutlinerInterchangeFormat(event.dataTransfer.getData("application/x-tabsoutliner-items"))
      }else {
        dragedModel = this.makeDragModelFromText("#")
      }
    }else {
      if(getItemFromDragDataStoreByMimeType(event.dataTransfer, "text/uri-list")) {
        if(isDragDataStoreAllowRead) {
          var url = event.dataTransfer.getData("text/uri-list");
          var title = url;
          try {
            var realTitle = event.dataTransfer.getData("text/html").match(/<a[^\b>]+>(.+)[\<]\/a>/)[1];
            if(realTitle) {
              title = realTitle
            }
          }catch(e) {
          }
          if(url === title && !isUrlStartWithValidSchema(url)) {
            var plaint_text_title = event.dataTransfer.getData("text/plain");
            if(plaint_text_title) {
              title = plaint_text_title
            }
            dragedModel = this.makeDragModelFromText(title)
          }else {
            dragedModel = this.makeDragModelFromUriList(url, title)
          }
        }else {
          dragedModel = this.makeDragModelFromUriList("#", "#")
        }
      }else {
        if(getItemFromDragDataStoreByMimeType(event.dataTransfer, "text/plain")) {
          if(isDragDataStoreAllowRead) {
            dragedModel = this.makeDragModelFromText(event.dataTransfer.getData("text/plain"))
          }else {
            dragedModel = this.makeDragModelFromText("#")
          }
        }else {
          if(getItemFromDragDataStoreByMimeType(event.dataTransfer, "text/html")) {
            if(isDragDataStoreAllowRead) {
              var htmlData = event.dataTransfer.getData("text/html");
              if(htmlData.indexOf(TO_DD_HTML_INTERCHANGE_BEG) == 0 && htmlData.indexOf(TO_DD_HTML_INTERCHANGE_END) > 0) {
                try {
                  var jsonHierarchyData = JSON.parse(htmlData.substring(TO_DD_HTML_INTERCHANGE_BEG.length, htmlData.indexOf(TO_DD_HTML_INTERCHANGE_END)));
                  dragedModel = this.makeDragModelFromJson(jsonHierarchyData)
                }catch(e) {
                  console.warn("WARNING prepareDragedModel - error during parsing tabsoutlinerdata embeded in interwindow dataTransfer html", e)
                }
              }else {
                dragedModel = this.makeDragModelFromText(htmlData)
              }
            }else {
              dragedModel = this.makeDragModelFromText("#")
            }
          }
        }
      }
    }
  }
  return dragedModel
}, makeDragModelFromJson:function(jsonDataObj) {
  try {
    var actionLinkModelParent = this.treeModel[jsonDataObj["type"]]();
    if(jsonDataObj["title"] || jsonDataObj["url"]) {
      var data = {};
      if(jsonDataObj["title"]) {
        data["title"] = jsonDataObj["title"]
      }
      if(jsonDataObj["url"]) {
        data["url"] = jsonDataObj["url"]
      }
      actionLinkModelParent.setDataForNodeConstructor(data)
    }
    var thisTreeView = this;
    if(jsonDataObj["subnodes"]) {
      jsonDataObj["subnodes"].forEach(function(jsonDataSubnodeObj) {
        actionLinkModelParent.subnodes.push(thisTreeView.makeDragModelFromJson(jsonDataSubnodeObj))
      })
    }
    return actionLinkModelParent
  }catch(e) {
    console.error("MakeDragModelFromJson json interchange format parse error", e);
    var errorNote = this.treeModel["textline_"]();
    errorNote.setDataForNodeConstructor("#?????#");
    return errorNote
  }
}, makeDragModelFromUriList:function(dragedUriList, linkText) {
  var actionLinkModel = this.treeModel["link_"]();
  actionLinkModel.setDataForNodeConstructor({"url":dragedUriList, "title":linkText});
  return actionLinkModel
}, makeDragModelFromText:function(dragedTextPlain) {
  var actionLinkModel = this.treeModel["textline_"]();
  actionLinkModel.setDataForNodeConstructor({"title":this.restrictDragedText(dragedTextPlain)});
  return actionLinkModel
}, restrictDragedText:function(text) {
  return text.substr(0, 1024)
}, performDrop:function(dropTarget, dropAsCopy) {
  var nodesHierarchy = this.prepareDragedModel(event, true);
  if(nodesHierarchy) {
    this.treeModel.moveCopyHierarchy(dropTarget, nodesHierarchy, dropAsCopy, this)
  }
  this.dragedModelStorage.clearDragedModel()
}, EOC:null};
function makeSubnodesTableDom(window_, treeModel, treeView, isFullTreeBuild) {
  var rTableDom = document.createElement("ul");
  rTableDom.className = "subnodeslist";
  for(var i = 0;i < treeModel.length;i++) {
    rTableDom.appendChild(makeNodeRowDom(window_, treeModel[i], treeView, isFullTreeBuild))
  }
  return rTableDom
}
function consoleLogCallbackParameters(message, retvalue) {
  return function() {
    var a = [message];
    for(var i = 0;i < arguments.length;++i) {
      a.push(arguments[i])
    }
    console.log.apply(console, a);
    arguments[0].stopPropagation();
    if(retvalue) {
      return retvalue
    }
  }
}
function RowDom_fromModel_requestScrollNodeToViewInAutoscrolledViews(forThisWindowOnly) {
  if(this.ownerDocument.defaultView.isAutoscrollView) {
    dispatchBubledCustomEvent(window, "before_scroll_node_to_view");
    scrollIntoViewAnimated(this._ref_nodeTextWithAnchorDom)
  }
}
function RowDom_fromModel_setCursorHere(ICursorOwner, doNotScrollView) {
  if(ICursorOwner === this._ref_treeView) {
    this.setCursorHere(doNotScrollView)
  }
}
function RowDom_fromModel_removeCursorStyles(ICursorOwner) {
  if(ICursorOwner === this._ref_treeView) {
    this._ref_treeView.removeCursorStyles(this)
  }
}
function RowDom_fromModel_onNodeUpdated() {
  var isCursored = this.isOurNodeModelUnderCursor();
  this.updateNodeCssClasses(this._ref_nodeModel, isCursored);
  this._ref_nodeTextWithAnchorDom.updateNodeTitle(this._ref_nodeModel, isCursored, false)
}
function RowDom_fromModel_onChangesInSubnodesTrees() {
  this.updateNodeAnchorImageAndCollapsedStatDom()
}
function RowDom_updateNodeAnchorImageAndCollapsedStatDom() {
  this._ref_nodeTextWithAnchorDom.updateNodeAnchorImageAndCollapsedStatDom(this.ownerDocument.defaultView, this._ref_nodeModel, this.isOurNodeModelUnderCursor())
}
function RowDom_fromModel_onSubnodesCollapsingStatusChanged() {
  if(this._ref_nodeModel.subnodes.length == 0) {
    return
  }
  this.updateNodeAnchorImageAndCollapsedStatDom();
  this._ref_treeView.updateHoveringMenu(this);
  if(this._ref_nodeModel.colapsed) {
    ShowHideCollapsingAnimator.doCollapsingAndRemove(getSubnodesDom_makeIfNotPresent(this.ownerDocument.defaultView, this, this._ref_treeView, false))
  }else {
    ShowHideCollapsingAnimator.doAppendIfNotPresentThenExpand(this, getSubnodesDom_makeIfNotPresent(this.ownerDocument.defaultView, this, this._ref_treeView, false))
  }
  if(this._ref_nodeModel.colapsed) {
    var currentCursoredNodeModel = this._ref_treeView.ICursorOwner_getNodeModelAtCursor();
    if(currentCursoredNodeModel.isSupliedNodePresentInPathToRoot(this._ref_nodeModel)) {
      this.setCursorHere()
    }
  }
}
function RowDom_fromModel_onBeforeReplaced_RememberCursor() {
  if(this.isOurNodeModelUnderCursor()) {
    this._ref_treeView._ref_tmp_needSetCursorOnReplacer = true
  }
}
function RowDom_fromModel_onAfterReplaced_SetCursor() {
  if(this._ref_treeView._ref_tmp_needSetCursorOnReplacer) {
    this.setCursorHere();
    delete this._ref_treeView._ref_tmp_needSetCursorOnReplacer
  }
}
function RowDom_isOurNodeModelUnderCursor() {
  return this._ref_treeView.isNodeModelCursored(this._ref_nodeModel)
}
function RowDom_setCursorHere(doNotScrollView) {
  this._ref_treeView.setCursorToRowDom(this, doNotScrollView)
}
function RowDom_fromModel_onBeforeRemoveSelfAndPromoteSubnodesInPlace_MoveCursor() {
  if(this.isOurNodeModelUnderCursor()) {
    var nextCursorHolder = this._ref_nodeModel.findNodeOnNextRow(true);
    if(!nextCursorHolder) {
      nextCursorHolder = this._ref_nodeModel.findNodeOnPrevRow()
    }
    if(nextCursorHolder) {
      nextCursorHolder.setCursorHereOrToFirstCollapsedParent(this._ref_treeView)
    }
  }
}
function RowDom_fromModel_onBeforeDeleteHierarchy_MoveCursor() {
  var currentCursoredNodeModel = this._ref_treeView.ICursorOwner_getNodeModelAtCursor();
  if(this.isOurNodeModelUnderCursor() || currentCursoredNodeModel.isSupliedNodePresentInPathToRoot(this._ref_nodeModel)) {
    var nextCursorHolder = this._ref_nodeModel.findNextSibling_ifAbsent_anyParentsNextSibling();
    if(!nextCursorHolder) {
      nextCursorHolder = this._ref_nodeModel.findNodeOnPrevRow()
    }
    if(nextCursorHolder) {
      nextCursorHolder.setCursorHereOrToFirstCollapsedParent(this._ref_treeView)
    }
  }
}
function RowDom_fromModel_onCopyPlacedDuringMove_TransferCursor(insertedCopy) {
  if(this.isOurNodeModelUnderCursor()) {
    insertedCopy.setCursorHereOrToFirstCollapsedParent(this._ref_treeView, true)
  }
}
function RowDom_fromModel_onSubnodeInserted(newNode, newNodeIndex, isInsertedInLastRow, isSubnodesWasEmptyBeforeInsert) {
  if(this._ref_subnodesDom) {
    this._ref_subnodesDom.insertBefore(makeNodeRowDom(this.ownerDocument.defaultView, newNode, this._ref_treeView, false), getChildElement(this._ref_subnodesDom, newNodeIndex))
  }
  if(isSubnodesWasEmptyBeforeInsert) {
    appendSubnodesDomIfSubnodesVisible(this.ownerDocument.defaultView, this, this._ref_nodeModel, this._ref_treeView, false)
  }
  this.updateNodeAnchorImageAndCollapsedStatDom()
}
function RowDom_fromModel_onSubnodeDeleted(deletedNodeMode, atIndex, isDelatedFromLastRow, isSubnodesListEmpty) {
  if(this._ref_subnodesDom) {
    this._ref_subnodesDom.removeChild(getChildElement(this._ref_subnodesDom, atIndex))
  }
  if(isSubnodesListEmpty) {
    if(this._ref_subnodesDom && this._ref_subnodesDom.parentElement) {
      this._ref_subnodesDom.parentElement.removeChild(this._ref_subnodesDom)
    }
    this._ref_subnodesDom = null
  }
  this.updateNodeAnchorImageAndCollapsedStatDom()
}
function RowDom_fromHtml_onAnchorClicked(event) {
  this._ref_nodeModel.setCollapsing(!this._ref_nodeModel.colapsed);
  event.stopPropagation()
}
function RowDom_fromHtml_onHoveredMenuActionBtnClicked(event) {
  var actions = this._ref_nodeModel.getHoveringMenuActions();
  actions[event["detail"]["actionId"]].performAction(this._ref_nodeModel, this._ref_treeView);
  event.stopPropagation()
}
function RowDom_fromHtml_onNodeTextWithAnchorDomHovered(event) {
  this._ref_treeView.showHoveringMenu(this);
  event.stopPropagation()
}
function RowDom_fromHtml_onNodeTextWithAnchorDomActivated(event) {
  this._ref_nodeModel.onNodeDblClicked(this._ref_treeView.treeModel, this._ref_treeView, event["detail"] && event["detail"]["altKey"]);
  event.stopPropagation()
}
function RowDom_fromHtml_onNodeTextWithAnchorDomFocused(event) {
  if(!this.isOurNodeModelUnderCursor()) {
    this.setCursorHere()
  }
  event.stopPropagation()
}
function RowDom_updateNodeCssClasses(nodeModel, isCursored) {
  var classes = "nodeTitleAndSubnodesContainer " + nodeModel.titleCssClass + "NTASC NTASC-" + nodeModel.titleBackgroundCssClass;
  if(nodeModel.getNodeContentCssClass()) {
    classes += " NCC-NTASC-" + nodeModel.getNodeContentCssClass()
  }
  if(isCursored) {
    classes += " " + cursoredNodeCssClass
  }
  if(this.className != classes) {
    this.className = classes
  }
}
function makeNodeRowDom(window_, nodeModel, treeView, isFullTreeBuild) {
  var rowDom = document.createElement("li");
  rowDom._ref_nodeModel = nodeModel;
  rowDom._ref_treeView = treeView;
  rowDom.id = rowDom._ref_nodeModel.id;
  rowDom.updateNodeAnchorImageAndCollapsedStatDom = RowDom_updateNodeAnchorImageAndCollapsedStatDom;
  rowDom.isOurNodeModelUnderCursor = RowDom_isOurNodeModelUnderCursor;
  rowDom.setCursorHere = RowDom_setCursorHere;
  rowDom.updateNodeCssClasses = RowDom_updateNodeCssClasses;
  var isCursored = rowDom.isOurNodeModelUnderCursor();
  rowDom.updateNodeCssClasses(nodeModel, isCursored);
  if(rowDom._ref_nodeModel.marks.relicons.length > 0) {
    rowDom.appendChild(makeRelLineWithIconsDom(window_, rowDom._ref_nodeModel.marks.relicons))
  }
  rowDom._ref_nodeTextWithAnchorDom = makeNodeTextWithAnchorDom(window_, rowDom._ref_nodeModel, treeView.isOneClickToActivateMode, isCursored, isFullTreeBuild);
  rowDom.appendChild(rowDom._ref_nodeTextWithAnchorDom);
  rowDom.addEventListener("node_expand_collapse_anchor_activated", RowDom_fromHtml_onAnchorClicked);
  rowDom.addEventListener("hovering_menu_action_btn_activated", RowDom_fromHtml_onHoveredMenuActionBtnClicked);
  rowDom.addEventListener("node_hovered", RowDom_fromHtml_onNodeTextWithAnchorDomHovered);
  rowDom.addEventListener("node_activated", RowDom_fromHtml_onNodeTextWithAnchorDomActivated);
  rowDom.addEventListener("node_focused", RowDom_fromHtml_onNodeTextWithAnchorDomFocused);
  connectDragControllers(rowDom);
  appendSubnodesDomIfSubnodesVisible(window_, rowDom, rowDom._ref_nodeModel, rowDom._ref_treeView, isFullTreeBuild);
  rowDom._ref_nodeModel.observers.push(rowDom);
  rowDom["fromModel_setCursorHere"] = RowDom_fromModel_setCursorHere;
  rowDom["fromModel_removeCursorStyles"] = RowDom_fromModel_removeCursorStyles;
  rowDom["fromModel_requestScrollNodeToViewInAutoscrolledViews"] = RowDom_fromModel_requestScrollNodeToViewInAutoscrolledViews;
  rowDom["fromModel_onNodeUpdated"] = RowDom_fromModel_onNodeUpdated;
  rowDom["fromModel_onSubnodesCollapsingStatusChanged"] = RowDom_fromModel_onSubnodesCollapsingStatusChanged;
  rowDom["fromModel_onSubnodeInserted"] = RowDom_fromModel_onSubnodeInserted;
  rowDom["fromModel_onSubnodeDeleted"] = RowDom_fromModel_onSubnodeDeleted;
  rowDom["fromModel_onChangesInSubnodesTrees"] = RowDom_fromModel_onChangesInSubnodesTrees;
  rowDom["fromModel_onBeforeReplaced_RememberCursor"] = RowDom_fromModel_onBeforeReplaced_RememberCursor;
  rowDom["fromModel_onAfterReplaced_SetCursor"] = RowDom_fromModel_onAfterReplaced_SetCursor;
  rowDom["fromModel_onBeforeRemoveSelfAndPromoteSubnodesInPlace_MoveCursor"] = RowDom_fromModel_onBeforeRemoveSelfAndPromoteSubnodesInPlace_MoveCursor;
  rowDom["fromModel_onBeforeDeleteHierarchy_MoveCursor"] = RowDom_fromModel_onBeforeDeleteHierarchy_MoveCursor;
  rowDom["fromModel_onCopyPlacedDuringMove_TransferCursor"] = RowDom_fromModel_onCopyPlacedDuringMove_TransferCursor;
  return rowDom
}
function getChildElement(ancestorElement, index) {
  return ancestorElement.childNodes.length > index ? ancestorElement.childNodes[index] : null
}
function filterOutFavIconsInHtml(htmlText) {
  return htmlText.replace(/<img[^>]*>/g, "")
}
var AS_FIRST_SUBNODE = "DROP_AS_FIRST_SUBNODE";
var AS_LAST_SUBNODE = "AS_LAST_SUBNODE";
var AS_PREV_SIBLING = "AS_PREV_SIBLING";
var AS_NEXT_SIBLING = "AS_NEXT_SIBLING";
function selectDropTarget(dropPosition, hoveredModel) {
  var r = {};
  if(dropPosition === AS_FIRST_SUBNODE) {
    r.container = hoveredModel;
    r.position = 0
  }else {
    if(dropPosition === AS_LAST_SUBNODE) {
      r.container = hoveredModel;
      r.position = -1
    }else {
      if(dropPosition === AS_PREV_SIBLING) {
        if(!hoveredModel.parent) {
          return null
        }
        r.container = hoveredModel.parent;
        r.position = hoveredModel.parent.subnodes.indexOf(hoveredModel)
      }else {
        if(!hoveredModel.parent) {
          return null
        }
        r.container = hoveredModel.parent;
        r.position = hoveredModel.parent.subnodes.indexOf(hoveredModel) + 1
      }
    }
  }
  return r
}
function getItemFromDragDataStoreByMimeType(dataTransfer, mimeType) {
  var items = dataTransfer["items"];
  if(items) {
    for(var i = 0;i < items.length;++i) {
      if(items[i]["type"] == mimeType) {
        return items[i]
      }
    }
  }
  return null
}
function isUrlStartWithValidSchema(url) {
  return/^[A-z0-9-.+]+:\S/.test(url)
}
function isElementPresentInPathFromTo(element, from, to) {
  for(var i = from;i && i != to;i = i.parentNode) {
    if(i == element) {
      return true
    }
  }
  return false
}
function connectDragControllers(rowDom) {
  rowDom.selectDragAndDropCursor = DD_selectDragAndDropCursor;
  rowDom._ref_treeView.onDragEnterReturnValueCasheForOnDragOver = true;
  rowDom.ondragstart = DD_ondragstart;
  rowDom.ondragend = DD_ondragend;
  rowDom.ondragover = DD_ondragover;
  rowDom.ondragenter = DD_ondragenter;
  rowDom.ondrop = DD_ondrop
}
var TO_DD_HTML_INTERCHANGE_BEG = "\x3c!--tabsoutlinerdata:begin";
var TO_DD_HTML_INTERCHANGE_END = "tabsoutlinerdata:end--\x3e";
function DD_ondragstart(event) {
  event.stopPropagation();
  try {
    this._ref_treeView.setDragClipboardData(event.dataTransfer, this._ref_nodeModel)
  }catch(e) {
    console.error(e)
  }
  this._ref_treeView.dragedModelStorage.setDragedModel(this._ref_nodeModel);
  event.dataTransfer.setDragImage(this, 28, 20);
  if(event.target.getBoundingClientRect().height > 1E3) {
    try {
      var treeIcon = document.getElementsByClassName("session_favicon")[0];
      event.dataTransfer.setDragImage(treeIcon, 16, 16)
    }catch(e) {
      console.error("Error during setting DragImage - session_favicon not found in a document", e)
    }
  }
  return true
}
function DD_ondrag(event) {
  event.stopPropagation()
}
function DD_ondragleave(event) {
  event.stopPropagation();
  this._ref_treeView.clearDragFeedback();
  return false
}
function DD_ondragend(event) {
  event.stopPropagation();
  this._ref_treeView.dragedModelStorage.clearDragedModel();
  this._ref_treeView.clearDragFeedback()
}
function DD_selectDragAndDropCursor(event) {
  var isCopyDrag = event.ctrlKey || event.altKey;
  if(isCopyDrag) {
    event.dataTransfer.dropEffect = "copy"
  }else {
    event.dataTransfer.dropEffect = "move";
    if(event.dataTransfer.effectAllowed == "copyLink") {
      event.dataTransfer.dropEffect = "link"
    }
    if(event.dataTransfer.effectAllowed == "copy") {
      event.dataTransfer.dropEffect = "copy"
    }
    if(event.dataTransfer.effectAllowed == "link") {
      event.dataTransfer.dropEffect = "link"
    }
  }
}
function DD_ondragover(event) {
  event.stopPropagation();
  this.selectDragAndDropCursor(event);
  return this._ref_treeView.onDragEnterReturnValueCasheForOnDragOver
}
function selectDropPosition_FirstSubnode_NextSibling(rowDom, event) {
  var dropPosition = isElementPresentInPathFromTo(rowDom._ref_nodeTextWithAnchorDom, event.srcElement, rowDom) ? AS_FIRST_SUBNODE : AS_NEXT_SIBLING;
  return dropPosition
}
function DD_ondragenter(event) {
  event.stopPropagation();
  var dropPosition = selectDropPosition_FirstSubnode_NextSibling(this, event);
  var dragedModel = this._ref_treeView.prepareDragedModel(event);
  if(!dragedModel || !this._ref_treeView.treeModel.isDropAllowed(selectDropTarget(dropPosition, this._ref_nodeModel), dragedModel)) {
    this._ref_treeView.deferred_clearDragFeedback();
    return this._ref_treeView.onDragEnterReturnValueCasheForOnDragOver = true
  }
  this.selectDragAndDropCursor(event);
  this._ref_treeView.deferred_showDragFeedback(this, dropPosition);
  return this._ref_treeView.onDragEnterReturnValueCasheForOnDragOver = false
}
function DD_ondrop(event) {
  event.stopPropagation();
  var dropPosition = selectDropPosition_FirstSubnode_NextSibling(this, event);
  this._ref_treeView.clearDragFeedback();
  var dropAsCopy = event.ctrlKey || event.altKey;
  var dropTarget = selectDropTarget(dropPosition, this._ref_nodeModel);
  this._ref_treeView.performDrop(dropTarget, dropAsCopy);
  return false
}
function appendSubnodesDomIfSubnodesVisible(window_, rowDom, nodeModel, treeView, isFullTreeBuild) {
  if(!nodeModel.colapsed && nodeModel.subnodes.length > 0) {
    rowDom.appendChild(getSubnodesDom_makeIfNotPresent(window_, rowDom, treeView, isFullTreeBuild))
  }
}
function getSubnodesDom_makeIfNotPresent(window_, rowDom, treeView, isFullTreeBuild) {
  if(!rowDom._ref_subnodesDom) {
    rowDom._ref_subnodesDom = makeSubnodesTableDom(window_, rowDom._ref_nodeModel.subnodes, treeView, isFullTreeBuild)
  }
  return rowDom._ref_subnodesDom
}
var simpleShowHideCollapsing = {doCollapsingAndRemove:function(animatedelem) {
  animatedelem.parentNode.removeChild(animatedelem)
}, doAppendIfNotPresentThenExpand:function(parent, animatedelem) {
  parent.appendChild(animatedelem)
}};
var animatedShowHideCollapsing = {doCollapsingAndRemove:animateCollapseThenRemove, doAppendIfNotPresentThenExpand:addIfNotPresentAndAnimateExpand};
var ShowHideCollapsingAnimator = animatedShowHideCollapsing;

