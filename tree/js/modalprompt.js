// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
function initModalPrompt(window_, modalPromtId) {
  function createModalDialogDom(document) {
    var div = document.createElement("div");
    div.id = "modalEditPrompt";
    div.className = "modal";
    div.style.display = "none";
    div.innerHTML = '<input id=modalEditPrompt-editField class="form_input" type="text" value="Initial Value" tabindex=0 placeholder="Enter Node Text" >' + '<button id=modalEditPrompt-cancellBtn class="form_btn btn_cancell" tabindex=-1>Cancel</button> <button id=modalEditPrompt-okBtn class="form_btn btn_ok" tabindex=-1>OK</button>';
    return div
  }
  function onBlur_preventFocusLoss(e) {
    e.stopPropagation();
    e.target.focus()
  }
  var modalElement = modalPromtId ? window_.document.getElementById(modalPromtId) : createModalDialogDom(window_.document);
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
  function showModal(window_, defaultText) {
    window_["modalEditPromptActive"] = true;
    window_.document.body.insertBefore(modalBg, null);
    window_.document.body.insertBefore(modalElement, null);
    modalElement.style.display = "block";
    var editField = modalElement.querySelector("#modalEditPrompt-editField");
    if(editField) {
      editField.value = defaultText
    }
  }
  return function activatePrompt(defaultText, onOk, onCancell) {
    showModal(window_, defaultText);
    var cancellBtn = modalElement.querySelector("#modalEditPrompt-cancellBtn");
    var okBtn = modalElement.querySelector("#modalEditPrompt-okBtn");
    var editField = modalElement.querySelector("#modalEditPrompt-editField");
    window_.setTimeout(function() {
      window_.document.addEventListener("click", onCancellTouch, false);
      window_.document.addEventListener("touchstart", onCancellTouch, false);
      window_.addEventListener("keydown", onWindowKeyDown, false);
      cancellBtn.addEventListener("click", onCancellTouch, false);
      okBtn.addEventListener("click", onOkTouch, false);
      if(editField) {
        editField.addEventListener("blur", onBlur_preventFocusLoss, false)
      }
      if(editField) {
        editField.focus()
      }
      if(editField) {
        editField.select()
      }
    }, 1);
    function removeEventListeners(window_) {
      window_.document.removeEventListener("click", onCancellTouch, false);
      window_.document.removeEventListener("touchstart", onCancellTouch, false);
      window_.removeEventListener("keydown", onWindowKeyDown, false);
      cancellBtn.removeEventListener("click", onCancellTouch, false);
      okBtn.removeEventListener("click", onOkTouch, false);
      if(editField) {
        editField.removeEventListener("blur", onBlur_preventFocusLoss, false)
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
      onOk(modalElement.querySelector("#modalEditPrompt-editField").value);
      removeModal(window_)
    }
  }
}
;
