// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
function initModalDialog_(window_, modalPromtId, createModalDialogDom) {
  var modalElement = modalPromtId ? window_.document.getElementById(modalPromtId) : createModalDialogDom(window_.document);
  var editField = modalElement.querySelector("#modalEditPrompt-editField");
  if(editField) {
    editField.addEventListener("blur", function(e) {
      e.stopPropagation();
      e.target.focus()
    }, false)
  }
  modalElement.addEventListener("click", function(e) {
    e.stopPropagation()
  }, false);
  modalElement.addEventListener("touchstart", function(e) {
    e.stopPropagation()
  }, false);
  var modalBg = window_.document.createElement("div");
  modalBg.classList.add("modal-bg");
  removeModal(window_);
  function removeModal(window_) {
    delete window_["modalEditPromptActive"];
    if(modalBg.parentNode) {
      modalBg.parentNode.removeChild(modalBg)
    }
    if(modalElement.parentNode) {
      modalElement.parentNode.removeChild(modalElement)
    }
  }
  function showModal(window_, defaultText, serial, customLabel) {
    window_["modalEditPromptActive"] = true;
    window_.document.body.insertBefore(modalBg, null);
    window_.document.body.insertBefore(modalElement, null);
    modalElement.style.display = "block";
    var editField = modalElement.querySelector("#modalEditPrompt-editField");
    if(editField) {
      editField.value = defaultText;
      editField.focus();
      editField.select()
    }
    var serialField = modalElement.querySelector("#modalPrompt-serialNumber");
    if(serialField) {
      serialField.innerText = serial
    }
    var customLabelField = modalElement.querySelector("#modalPrompt-customLabelField");
    if(customLabelField) {
      customLabelField.innerText = customLabel
    }
  }
  return function activatePrompt(serial, defaultText, onOk, onCancell) {
    showModal(window_, defaultText, serial, defaultText);
    var cancellBtn = modalElement.querySelector("#modalEditPrompt-cancellBtn");
    var okBtn = modalElement.querySelector("#modalEditPrompt-okBtn");
    window_.setTimeout(function() {
      window_.document.addEventListener("click", onCancellTouch, false);
      window_.document.addEventListener("touchstart", onCancellTouch, false);
      window_.addEventListener("keydown", onWindowKeyDown, false);
      if(cancellBtn) {
        cancellBtn.addEventListener("click", onCancellTouch, false)
      }
      if(okBtn) {
        okBtn.addEventListener("click", onOkTouch, false)
      }
    }, 1);
    function removeEventListeners(window_) {
      window_.document.removeEventListener("click", onCancellTouch, false);
      window_.document.removeEventListener("touchstart", onCancellTouch, false);
      window_.removeEventListener("keydown", onWindowKeyDown, false);
      if(cancellBtn) {
        cancellBtn.removeEventListener("click", onCancellTouch, false)
      }
      if(okBtn) {
        okBtn.removeEventListener("click", onOkTouch, false)
      }
    }
    function onWindowKeyDown(e) {
      if(e.keyCode == 27) {
        onCancellTouch(e)
      }
      if(e.keyCode == 13) {
        onOkTouch(e)
      }
    }
    function onCancellTouch(e) {
      var window_ = e.target.ownerDocument.defaultView;
      removeEventListeners(window_);
      if(onCancell) {
        onCancell()
      }
      removeModal(window_)
    }
    function onOkTouch(e) {
      var window_ = e.target.ownerDocument.defaultView;
      removeEventListeners(window_);
      var editField = modalElement.querySelector("#modalEditPrompt-editField");
      onOk(editField && editField.value);
      removeModal(window_)
    }
  }
}
;
