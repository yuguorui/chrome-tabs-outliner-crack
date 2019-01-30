// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
function initContextMenu(window_) {
  function createContextMenu(document) {
    var goProWarning = '<div id="noteGoProContextMenuWarning" class="goProAlertBlock">' + "Context menu, clipboard operations and keyboard shortcuts are not working in the Free Mode. " + "To enable them you need to Upgrade " + 'to the <a target="_blank" href="' + chrome.extension.getURL("options.html") + '">Paid Mode</a>.' + "Below is a preview of what will be available after the Upgrade.";
    "</div>";
    var cnmenuModel = [, ["section", "Clipboard", , ["actionCut", "Cut                           [Ctrl]+[X]"], ["actionCopy", "Copy                          [Ctrl]+[C]"], ["actionPaste", "Paste (as the last subnode)   [Ctrl]+[V]"], ["tip", "Tips: Paste or Drag&Drop to notepad to export hierarchy in a plain text. Dragging Tab node to the Chrome Tab Strip or Adress Bar is also supported."]], ["subsection", 'General   [F2], [-], [Del], [\u21d0<span style="margin-left: -2px;margin-right: 1px;">=</span>], [&nbsp;&nbsp;&nbsp;Space&nbsp;&nbsp;&nbsp;] ...', 
    , ["actionCollapseExpand", "Collapse\\Expand            [+] or [-]"], ["actionEdit", "Edit                              [F2]"], ["actionSaveClose", "Save & Close            [\u21e6 Backspace]"], ["actionDelete", "Delete                           [Del]"], ["tip", "Tip: Deletion of an open window will delete only unmarked open tabs, tabs with notes will be saved"], ["actionRestore", "Restore\\Activate        {DblClick} or [&nbsp;&nbsp;&nbsp;Space&nbsp;&nbsp;&nbsp;]"], ["actionAltRestore", "Alt Restore     [Alt] + {DblClick} or [&nbsp;&nbsp;&nbsp;Space&nbsp;&nbsp;&nbsp;]"], 
    ["tip", "Alternative Restore restore only those tabs in window that was open on last save"], ["tip", "Tip: To apply Delete, Save & Close, Restore commands on all subnodes need collapse hierarchy first. Quick way to do so is by clicking the circle in the hovering menu.<br><br>Note that Drag & Drop and Clipboard operations work with the whole hierarchy, regardless of the collapsed state"]], ["subsection", "Notes                       [Ins], [Enter] ...", ["actionEdit", "Edit Inline Note (exist only on Tabs)                 [F2]"], 
    ["space"], ["actionInsNoteAsParent", "Insert Note as parent                        [Shift]+[Ins]"], ["actionInsNoteAsFirstSubnode", "Insert Note as the first subnode               [Alt]+[Ins]"], ["actionInsNoteAsLastSubnode", "Insert Note as the last subnode                      [Ins]"], ["space"], ["actionAddNoteAbove", "Add Note above                             [Shift]+[Enter]"], ["actionAddNoteBelove", "Add Note below (on the same level)                 [Enter]"], ["actionAddNoteAtTheEndOfTree", 
    "Add Note to the end of Tree                  [Alt]+[Enter]"], ["space"], ["actionAddGroupAbove", "Add Group above                                [Shift]+[G]"], ["tip", 'Tip: Alternatively you can start note text with "2G " to create Group instead of Note'], ["actionAddSeparatorBelove", "Add Separator below                                    [L]"], ["tip", 'Tip: Note with the text like "----" or "====" or "...." (of any length) will be automatically converted to a separator']], ["subsection", 
    "Move    [Tab], [Ctrl]+[\u21d0\u21d5\u21d2][Home] [End] ...", ["actionMoveRight", "Right                                   [Tab] or [Ctrl]+[\u21d2]"], ["actionMoveLeft", "Level Up                        [Shift]+[Tab] or [Ctrl]+[\u21d0]"], ["actionMoveUp", "Up \t\t\t\t\t\t                      [Ctrl]+[\u21d1]"], ["actionMoveDown", "Down \t\t\t\t\t\t\t                  [Ctrl]+[\u21d3]"], ["actionMoveHome", "As the first subnode                          [Ctrl]+[Home]"], ["actionMoveEnd", "As the last subnode                            [Ctrl]+[End]"], 
    ["space"], ["tip", "Keys for cursor movement:</br>" + "<table>" + "<tr><td>[Home]</td><td>- </td><td>to first node on the same level</td></tr>" + "<tr><td>[End]</td><td>- </td><td>to last node on the same level</td></tr>" + "<tr><td>[\u21d0]</td><td>- </td><td>to parent</td></tr>" + "<tr><td>[\u21d2]</td><td>- </td><td>to the first subnode</td></tr>" + "</table>" + "[PgUp], [PgDn], [\u21d1], [\u21d3] - moves cursor up and down by rows.<br>" + ""], ["tip", "Tip: Ctrl + Drag & Drop create copies of dragged hierarchies"]], 
    ["section", "Utils", ["actionFlattenTabsHierarchy", "Flatten Tabs Hierarchy                    [/]"], ["actionMoveWindowToTheEndOfTree", "Move Window\\Group To The End Of Tree     [E]"], ["actionOpenLinkInNewWindow", "Open Link In New Window       [Shift]+[Click]"], ["actionOpenLinkInNewTab", "Open Link In Last Window       [Ctrl]+[Click]"]], ["section", "Global Keyboard Shortcuts", ["tip", "<table>" + '<tr><td style="text-align: right">[W]</td><td>- </td><td> Scroll Up To Next Open Window</td></tr>' + 
    '<tr><td style="text-align: right">[S]</td><td>- </td><td> Undo Scroll</td></tr>' + '<tr><td style="text-align: right">[C]</td><td>- </td><td> Clone View</td></tr>' + '<tr><td style="text-align: right">[Q]</td><td>- </td><td> Close All Open Windows</td></tr>' + '<tr><td style="text-align: right">[Ctrl]+[F]</td><td>- </td><td> Search Through Visible Nodes</td></tr>' + '<tr><td style="text-align: right">[Ctrl]+[P]</td><td>- </td><td> Print Tree</td></tr>' + '<tr><td style="text-align: right; vertical-align:top">[Ctrl]+[S]</td><td style="text-align: right; vertical-align:top">- </td><td> Export Visible Nodes as HTML (select "Save as complete HTML" in a dialog that will open)</td></tr>' + 
    "</table>" + "There is also shortcuts to open Tabs Outliner, and for Save-Close Tab or Window without opening or switching to Tabs Outliner, see the help."], ["tip", "Tip: Native Chrome context menu can be opened by Right Click with [Shift] pressed"]]];
    function createElement(tag, id, className) {
      var r = document.createElement(tag);
      if(id) {
        r.id = id
      }
      if(className) {
        r.className = className
      }
      return r
    }
    var contextMenuElement = createElement("ul", "treeContextMenu", "contextMenu");
    contextMenuElement.style.display = "none";
    function getEntryClass(entryId) {
      var match = /^[a-z]*/.exec(entryId);
      return match ? match[0] : ""
    }
    function processEntryText(text, isGroup) {
      if(!text) {
        return""
      }
      var a = text.split(/\s\s\s+/);
      var titleClasses = isGroup ? "contextMenu-grpTitle" : "contextMenu-entryTitle";
      function processShortcutsBorders(text) {
        var r = text;
        r = r.replace(/\[(.+?)\]/g, "<span class='shortCutKey'>$1</span>");
        r = r.replace(/\{(.+?)\}/g, "<span class='mouseKey'>$1</span>");
        return r
      }
      var r = '<span class="' + titleClasses + '">' + processShortcutsBorders(a[0]) + "</span>";
      if(a[1]) {
        r += '<span class="contextMenu-entryShortcuts">' + processShortcutsBorders(a[1]) + "</span>"
      }
      return r
    }
    function processGroup(groupParentDomElement, groupArray) {
      groupArray.forEach(function(entry) {
        var entryId = entry[0];
        var entryText = entry[1];
        var entryType = getEntryClass(entryId);
        if(entryId === entryType) {
          entryId = ""
        }
        var entryClassesList = "contextMenu-" + entryType + " contextMenu-item";
        var isGroup = entryType === "subsection" || entryType === "section";
        entryClassesList += isGroup ? " contextMenu-grp" : " contextMenu-entry";
        if(entryType === "subsection" || entryType === "action") {
          entryClassesList += " contextMenu-hoverable"
        }
        var entryDom = createElement("il", entryId, entryClassesList);
        entryDom.innerHTML = processEntryText(entryText, isGroup);
        groupParentDomElement.appendChild(entryDom);
        if(entryType === "section") {
          processGroup(entryDom, entry.slice(2))
        }
        if(entryType === "subsection") {
          var popupDom = createElement("ul", "", "contextMenu-subMenuPopup");
          entryDom.appendChild(popupDom);
          processGroup(popupDom, entry.slice(2))
        }
      })
    }
    processGroup(contextMenuElement, cnmenuModel);
    var goProWarningElement = createElement("div", "noteGoProContextMenuWarningPopUp", "");
    goProWarningElement.innerHTML = goProWarning;
    // contextMenuElement.insertBefore(goProWarningElement, contextMenuElement.firstChild);
    return contextMenuElement
  }
  var modalElement = createContextMenu(window_.document);
  Array.prototype.slice.call(modalElement.querySelectorAll(".contextMenu-subMenuPopup")).forEach(function(submenuPopUpElement) {
    submenuPopUpElement.style.display = "none"
  });
  Array.prototype.slice.call(modalElement.querySelectorAll(".contextMenu-subsection")).forEach(function(subsectionTitle) {
    subsectionTitle.addEventListener("mouseenter", function(e) {
      var subMenuEntry = e.currentTarget;
      var subPopup = subMenuEntry.querySelector(".contextMenu-subMenuPopup");
      var groupTitleRect = subMenuEntry.getBoundingClientRect();
      showPopUpInPos(e.clientX, groupTitleRect.top + 13, subPopup, e.target.ownerDocument.defaultView, 60, groupTitleRect, 4, 5, true)
    }, false);
    subsectionTitle.addEventListener("mouseleave", function(e) {
      var subPopup = e.currentTarget.querySelector(".contextMenu-subMenuPopup");
      subPopup.style.display = "none"
    }, false)
  });
  Array.prototype.slice.call(modalElement.querySelectorAll(".contextMenu-action")).forEach(function(action) {
    action.addEventListener("click", function(e) {
      var isPreventDefaultFlagSet = dispatchBubledCustomEvent(e.currentTarget, "actionCommand", {"action":e.currentTarget.id});
      if(!isPreventDefaultFlagSet) {
        deactivatePopUp(e)
      }
    }, false)
  });
  modalElement.addEventListener("click", function(e) {
    e.stopPropagation()
  }, false);
  modalElement.addEventListener("touchstart", function(e) {
    e.stopPropagation()
  }, false);
  var modalBg = window_.document.createElement("div");
  modalBg.classList.add("modal-bg");
  modalBg.addEventListener("contextmenu", deactivatePopUp, false);
  modalElement.addEventListener("contextmenu", deactivatePopUp, false);
  removeModal(window_);
  function removeModal(window_) {
    delete window_["modalContextMenuActive"];
    if(modalBg.parentNode) {
      modalBg.parentNode.removeChild(modalBg)
    }
    if(modalElement.parentNode) {
      modalElement.parentNode.removeChild(modalElement)
    }
  }
  function connectGlobalEventListeners(window_, okBtn, cancellBtn) {
    window_.document.addEventListener("click", deactivatePopUp, false);
    window_.document.addEventListener("touchstart", deactivatePopUp, false);
    window_.addEventListener("keydown", onWindowKeyDown, false)
  }
  function removeGlobalEventListeners(window_) {
    window_.document.removeEventListener("click", deactivatePopUp, false);
    window_.document.removeEventListener("touchstart", deactivatePopUp, false);
    window_.removeEventListener("keydown", onWindowKeyDown, false)
  }
  function onWindowKeyDown(e) {
    if(e.keyCode == 27) {
      deactivatePopUp(e)
    }
  }
  function onCancellTouch(e) {
    deactivatePopUp(e)
  }
  function deactivatePopUp(e) {
    removeGlobalEventListeners(e.target.ownerDocument.defaultView);
    removeModal(e.target.ownerDocument.defaultView);
    if(!e.ctrlKey) {
      e.preventDefault()
    }
  }
  function showPopUpInPos(x, y, modalElement, window_, xPadding, titleRect, xMinLeftOverlapWithTitle, xMinRightOverlapWithTitle, isSubmenu) {
    xPadding = xPadding || 0;
    modalElement.style.display = "block";
    Array.prototype.slice.call(modalElement.querySelectorAll(".contextMenu-subMenuPopup")).forEach(function(subMenuPopup) {
      subMenuPopup.style.display = "none"
    });
    var clientWidth = window_.document.documentElement.clientWidth;
    var clientHeight = window_.document.documentElement.clientHeight;
    var popupWidth = modalElement.offsetWidth;
    var popupHeight = modalElement.offsetHeight;
    if(y + popupHeight > clientHeight) {
      y -= y + popupHeight - clientHeight
    }
    if(x + popupWidth > clientWidth && x > clientWidth - x) {
      x -= popupWidth + xPadding;
      if(titleRect && x + popupWidth < titleRect["left"] + xMinLeftOverlapWithTitle) {
        x = titleRect["left"] + xMinLeftOverlapWithTitle - popupWidth
      }
    }else {
      x += xPadding;
      if(titleRect && x > titleRect["right"] - xMinRightOverlapWithTitle) {
        x = titleRect["right"] - xMinRightOverlapWithTitle
      }
    }
    if(x + popupWidth > clientWidth) {
      x = clientWidth - popupWidth
    }
    if(x < 0) {
      x = 0;
      if(!isSubmenu && popupWidth < clientWidth) {
        x = clientWidth - popupWidth
      }
    }
    modalElement.style.top = y + "px";
    modalElement.style.left = x + "px"
  }
  function showModal(x, y, window_, isGoProBanerVisible) {
    window_["modalContextMenuActive"] = true;
    window_.document.body.insertBefore(modalBg, null);
    window_.document.body.insertBefore(modalElement, null);
    var goProBaner = modalElement.querySelector("#noteGoProContextMenuWarningPopUp");
    if(goProBaner) {
      goProBaner.style.display = isGoProBanerVisible ? "" : "none"
    }
    showPopUpInPos(x, y, modalElement, window_);
    var noteGoProContextMenuWarningPopUp = modalElement.querySelector("#noteGoProContextMenuWarningPopUp");
    if(noteGoProContextMenuWarningPopUp) {
      noteGoProContextMenuWarningPopUp.style.top = "-" + (noteGoProContextMenuWarningPopUp.offsetHeight + 2) + "px"
    }
    var editField = modalElement.querySelector("#modalEditPrompt-editField");
    if(editField) {
      editField.focus();
      editField.select()
    }
  }
  return function activateContextMenu(e, isGoProBanerVisible) {
    var window_ = e.target.ownerDocument.defaultView;
    var x = e.clientX;
    var y = e.clientY;
    showModal(x, y, window_, isGoProBanerVisible);
    window_.setTimeout(function() {
      connectGlobalEventListeners(window_)
    }, 1);
    chrome.extension.getBackgroundPage().ga_event("Context Menu Shown - " + (isGoProBanerVisible ? "Free" : "Paid"))
  }
}
;
