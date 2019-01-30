// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var activateEnterLicenseKeyDialog = initEnterLicenseKeyDialog(window);
var activateBeforeIdentityAccessExplanationDialog = initBuyLicenseKeyDialog_beforeIdentityAccess(window);
function showEnterLicenseKeyDialog(userInfo) {
  activateEnterLicenseKeyDialog(userInfo.email, "OK: identity.email GRANTED & accessible. userInfo.email:" + userInfo.email + "; userInfo.id:" + userInfo.id, function onOk() {
  }, function onCancel() {
  })
}
function initBuyLicenseKeyDialog_beforeIdentityAccess(window_) {
  return initModalDialog_(window_, "buyBeforeIdentityAccessDialog")
}
function initEnterLicenseKeyDialog(window_, modalPromtId) {
  return initModalDialog_(window_, "manualyEnterProKeyDialog")
}
;
