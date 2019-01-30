// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
var DbOperations = {};
DbOperations.DbSchemaVersion = 1;
DbOperations.OperationsEnum = {TREE_CREATE:1E3, NODE_NEWROOT:2E3, NODE_INSERT:2001, NODE_REPLACE:2002, NODE_DELETE:2003, NODE_MOVE:2004, NODE_UPDATE_CHROME_OBJ_DATA:3005, NODE_UPDATE_MARKS:3006, LOG_ERROR:9E3, EOF:11111};
DbOperations.OperationBase = Class.extend({init:function(opType) {
  this.data = {"opType":opType, "opSchemeVersion":DbOperations.DbSchemaVersion, "opData":{}}
}, saveToDb:function() {
}, restore:function(tree) {
}, EOC:null});
DbOperations.OperationTreeCreate = DbOperations.OperationBase.extend({init:function() {
  this._super(DbOperations.OperationsEnum.TREE_CREATE)
}, EOC:null});
DbOperations.NodeOperationBase = DbOperations.OperationBase.extend({init:function(opType, targetPath) {
  this._super(opType);
  this.data.opData.targetPath = targetPath
}, EOC:null});
DbOperations.NodeOperationInsert = DbOperations.NodeOperationBase.extend({init:function(targetPath, nodeData) {
  this._super(DbOperations.OperationsEnum.NODE_INSERT, targetPath);
  this.data.opData.nodeData = nodeData
}, EOC:null});
DbOperations.NodeOperationReplace = DbOperations.NodeOperationBase.extend({init:function(targetPath, nodeData) {
  this._super(DbOperations.OperationsEnum.NODE_REPLACE, targetPath);
  this.data.opData.nodeData = nodeData
}, EOC:null});
DbOperations.NodeOperationEOF = DbOperations.NodeOperationBase.extend({init:function(time) {
  this._super(DbOperations.OperationsEnum.EOF);
  this.data.opData.time = time
}, EOC:null});

